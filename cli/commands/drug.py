from typing import Any, List, Dict
import click
from pathlib import Path
import logging
import re

from models.Drug import Drug
from models.ProteinTarget import Polypeptide, ProteinTarget
from commands.database.drug_db import insert_node_batch_DB
from common.database import get_connection, get_database
from common.files import load_tsv, load_xml_in_batches, parse_csv

# Use logger config in __init__.py
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)


DATA_DIR = Path(__file__).parent.parent / "data" / "drugs" / "drugbank_all_full_database.xml"

batch_size = 1

fields = {
  #  "primary_drugbank_id": "",  # no path porque es especial
    "drugbank-id" : "drugbank-id",
    "name": "name",
    "targets" : "targets",
    "synonyms" : "synonyms"
    }

# Use logger config in __init__.py
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

def insert_node(driver, batch, database):
    """ Insert metadata into Database """
    with driver.session(database=database) as session:
        insert_node_batch_DB(session, batch)


def choose_main_id(id_list: list[str | None]) -> str | None:
    for i in id_list:
        if isinstance(i, str) and i.startswith("BD"):
            return i 
        elif isinstance(i, dict):
            text = i.get("text")
            if text and text.startswith("BD"):
                return text       
    for i in id_list:
        if isinstance(i, str) and i is not None:
            return i
        elif isinstance(i, dict):
            text = i.get("text")
            if text:
                return text
    return None


@click.command(name="load-drug")
def load_drug():
    """ Load drugs from XLS file. """

    # Load from folder
    click.echo("🔍 Loading all drugs from default folder...")
    all_files = list(DATA_DIR.glob("full database.xml"))

    for xml_file in sorted(all_files):
        total = 0
        num = 0

        valid_targets_batch = []

        for batch in load_xml_in_batches(xml_file, fields=fields, batch_size=1):
            num = num + 1
            for entry in batch:
                # Filter: exists targets
                targets_section = entry.get("targets")
                if not targets_section:
                    continue  # o sigue con el siguiente drug


                print(str(num) + " - " + entry["name"])                

                # Targets
                targets = parse_protein_targets(targets_section)
                
                # Exists any target valid save drug and targets
                if targets:
                    total = total + 1
                    print(total)
                    # Drug
                    raw_ids = entry["drugbank-id"]
                    drug_ids = raw_ids if isinstance(raw_ids, list) else [raw_ids]
                    main_drugbank_id = choose_main_id(drug_ids)

                    if entry.get("synonyms") != None:                        
                        synonyms_raw = entry.get("synonyms", {}).get("synonym", [])
                        # Normalizamos a lista
                        if isinstance(synonyms_raw, dict):
                            synonyms_raw = [synonyms_raw]
                        synonyms = [s.get("text", "") for s in synonyms_raw if isinstance(s, dict)]


                    drug = Drug(main_drugbank_id=main_drugbank_id, name=entry["name"], synonyms=synonyms, targets=targets)
                    
                    valid_targets_batch.append(drug)

                    if len(valid_targets_batch) >= batch_size:
                        insert_node_batch(get_connection(), valid_targets_batch, get_database())
                        print("------------------------")                        
                        batch = []

        if valid_targets_batch:
            print(total)
            insert_node_batch_DB(get_connection(), batch)


        click.echo(f"Finished uploading {total} drugs from {xml_file.name}")


def insert_node_batch(driver, valid_targets_batch, database):
    """ Insert metadata into Database """
    with driver.session(database=database) as session:
        insert_node_batch_DB(session, valid_targets_batch)




dabase_key = {
  'HUGO Gene Nomenclature Committee (HGNC)': 'HGNC',
  'GenAtlas': 'GenAtlas',
  'GenBank Gene Database': 'GenBank',
  'GenBank Protein Database': 'GenBank',
  'Guide to Pharmacology': 'Pharmacology',
  'UniProtKB': 'UniProtKB',
  'UniProt Accession': 'UniProt_A'
}




def get_external_ids(ext_ids):
    result = []
    for e in ext_ids:
        resource = e.get("resource", "")
        identifier = e.get("identifier", "")
        if ":" in identifier:
            # have : equal
            result.append(identifier)
        else:
            # No have :  resource:identifier
            nr = dabase_key.get(resource, resource)
            result.append(f"{nr}:{identifier}")

    return result    

def parse_protein_target(target: List[Dict[str, Any]]) -> List[ProteinTarget]:
    valid_targets: List[ProteinTarget] = []
    
    organism = target.get("organism", "")
    if organism is None or "human" not in organism.lower():
        return

    polypeptides_raw = target.get("polypeptide")
    if not polypeptides_raw:
        return

    # Normalize polypeptide to list
    if isinstance(polypeptides_raw, dict):
        polypeptides_raw = [polypeptides_raw]
    elif not isinstance(polypeptides_raw, list):
        return

    valid_polypeptides: List[Polypeptide] = []

    for polypep in polypeptides_raw:
        ext_ids_raw = polypep.get("external-identifiers", {}).get("external-identifier", [])
        if isinstance(ext_ids_raw, dict):
            ext_ids_raw = [ext_ids_raw]
        
        ext_ids = get_external_ids(ext_ids_raw)
        
        # TODO: only if pharmacology
        #if "Pharmacology" not in ext_ids:
        #    return
        #ext_ids = {e["resource"]: e["identifier"] for e in ext_ids_raw if "resource" in e and "identifier" in e}

        polypeptide_obj = Polypeptide(
            id=polypep.get("id", ""),
            source=polypep.get("source", ""),
            general_function=polypep.get("general-function", ""),
            gene_name=polypep.get("gene-name", ""),
            external_ids=ext_ids
        )

        valid_polypeptides.append(polypeptide_obj)

    if not valid_polypeptides:
        return

    
    
    if target.get("actions") == None:
       return
    
    actions_raw = target.get("actions", {}).get("action", [])
    if isinstance(actions_raw, str):
        actions = [actions_raw]
    elif isinstance(actions_raw, list):
        actions = actions_raw
    else:
        actions = []

    target_obj = ProteinTarget(
        drugbank_id=target.get("id", ""),
        name=target.get("name", ""),
        organism=organism,
        actions=actions,
        polypeptide=valid_polypeptides
    )

    valid_targets.append(target_obj)

    return valid_targets
    

def parse_protein_targets(data: List[Dict[str, Any]]) -> List[ProteinTarget]:
    valid_targets: List[ProteinTarget] = []

    if isinstance(data, dict):
        if isinstance(data.get("target"), dict):
            target_ouput = parse_protein_target(data.get("target"))
            if target_ouput != None:  
                valid_targets.extend(target_ouput)
        else:
            for target in data.get("target") :
                target_ouput = parse_protein_target(target)
                if target_ouput != None:  
                    valid_targets.extend(target_ouput)
    else:
        print("Error")
        exit()

    return valid_targets