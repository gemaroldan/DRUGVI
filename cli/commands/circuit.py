import click
from pathlib import Path
import logging
import re

from commands.database.circuit_db import insert_meta_node_DB, insert_relations_DB
from common.database import get_connection, get_database
from common.files import load_tsv, parse_csv

# Use logger config in __init__.py
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)


DATA_DIR = Path(__file__).parent.parent / "data" / "circuits"


# Use logger config in __init__.py
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

def insert_meta_data(driver, row, database):
    """ Insert metadata into Database """
    with driver.session(database=database) as session:
        insert_meta_node_DB(session, row)


def insert_relations(driver, diseaseId, df_nodes_pathways, database):
    """ Insert data and relations into Database """
    with driver.session(database=database) as session:
        for i, row in df_nodes_pathways.iterrows(): 
            logger.debug(f"Insert data: {i}")
            if row["in_disease"] == 1:
                insert_relations_DB(session, diseaseId, row["index"], i)


def upload_circuit_files(disease_abrev, files=None):
    """Uploading a set of files from Circuits to Neo4"""
    if not files:
        # Search names
        pattern = f"circuits_{disease_abrev}.tsv"
        matches = list(DATA_DIR.glob(pattern))
        if matches:
            nodes = matches[0]
        else:
            print("No matching file found.")
        metadata = DATA_DIR / f"metadata.tsv"
        files = [nodes, metadata]

    for f in files:
        if not Path(f).exists():
            click.echo(click.style(f"File not found: {f}", fg="red"))
            return

    click.echo(f"👌 Loading {disease_abrev}:")
    for f in files:
        click.echo(f"  - {f}")

    try:
        logger.info("Starting the TSV to Neo4j import process")
        driver = get_connection();         

        df_meta = load_tsv(metadata, dtype={"id": str})       
        df_nodes = load_tsv(nodes)
        
        row_meta_tmp =  df_meta[df_meta["abrev"] == disease_abrev]
        diseaseId =  row_meta_tmp["id"].iloc[0]
        # TODO: parse all type of annotation disease
        row_meta = {
            "idOrpha" : diseaseId,
            "name" : row_meta_tmp["name"].iloc[0],
            "label" : row_meta_tmp["abrev"].iloc[0],
        }

        # Insert meta
        insert_meta_data(driver, row_meta, get_database())

        logger.debug("----- NODES & RELATIONS -----")    
        # Insert relationships
        insert_relations(driver, diseaseId, df_nodes, get_database())
        
        # Close the driver connection
        driver.close()
        logger.info("Process completed successfully")
    except Exception as e:
        logger.error(f"Error in the main process: {e}")
        raise  

@click.command(name="load-circuit")
@click.option('--diseases', help='Abrev disease like FamiMela -> ORPHA:618 - Familial melanoma',     callback=parse_csv)
@click.option('--circuits', type=click.Path(), help="File nodes and relations", callback=parse_csv)
@click.option('--metadatas', type=click.Path(), help="File metadatas circuits")
def load_circuit(diseases, circuits,  metadatas):
    """
    Load diseases' circuits from TSV files.

    - No arguments: Load all diseases found in the default folder.
    - With --diseases: Automatically load nodes, relationships, and metadata from standard files.
    - With --diseases + files: Use the specified files.
    """

    if diseases and any([circuits, metadatas]):
        # Load form files
        files = [circuits,  metadatas]
        if not all(files):
            click.echo(click.style("You must specify --circuits and --metadatas", fg="red"))
            return        
        for d in sorted(diseases):
            upload_circuit_files(d, files)
    elif diseases:
        # Selected circuits
        for d in sorted(circuits):
            upload_circuit_files(d)
    elif not diseases:
        # Load from folder
        click.echo("🔍 Loading all circuits from default folder...")
        all_files = list(DATA_DIR.glob("circuits_*.tsv"))
        diseases = {re.split(r'[_\.]', f.name)[1] for f in all_files}
        for d in sorted(diseases):
            upload_circuit_files(d)