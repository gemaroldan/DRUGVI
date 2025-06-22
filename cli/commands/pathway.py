import click
from pathlib import Path
import logging

from commands.database.pathway_db import insert_meta_node_DB, insert_node_DB, insert_relationDB
from common.database import get_connection, get_database
from common.files import load_tsv, parse_csv

# Use logger config in __init__.py
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)


DATA_DIR = Path(__file__).parent.parent / "data" / "pathways"


def insert_meta_data(driver, row, database):
    """ Insert metadata into Database """
    with driver.session(database=database) as session:
        insert_meta_node_DB(session, row)
        


def insert_data(driver, df, database):
    """ Insert data into Database """
    with driver.session(database=database) as session:
        for index, row in df.iterrows():
            insert_node_DB(session, row, index)


def insert_relations(driver, df, database):
    """Insert data into Database"""
    with driver.session(database=database) as session:
        for index, row in df.iterrows():   
            insert_relationDB(session, row, index)



def upload_pathway_files(pathway_id, files=None):
    """Uploading a set of files from Pathway to Neo4"""
    if not files:
        nodes = DATA_DIR / f"{pathway_id}_nodes.tsv"
        relations = DATA_DIR / f"{pathway_id}_relations.tsv"
        metadata = DATA_DIR / f"hsa_metadata.tsv"
        files = [nodes, relations, metadata]

    for f in files:
        if not Path(f).exists():
            click.echo(click.style(f"File not found: {f}", fg="red"))
            return

    click.echo(f"👌 Loading {pathway_id}:")
    for f in files:
        click.echo(f"  - {f}")

    try:
        logger.info("Starting the TSV to Neo4j import process")
        driver = get_connection();         

        df_meta = load_tsv(metadata, dtype={"id": str})
       
        df_nodes = load_tsv(nodes)
        df_relations = load_tsv(relations)
        
        row_meta_tmp =  df_meta[df_meta["id"] == pathway_id]
        row_meta = {
            "id" : row_meta_tmp["id"].iloc[0],
            "name" : row_meta_tmp["map"].iloc[0],
            "section" : row_meta_tmp["section"].iloc[0],
        }

        # Insert meta
        insert_meta_data(driver, row_meta, get_database())

        logger.debug("----- NODES -----")    
        # Insert data
        insert_data(driver, df_nodes, get_database())

        logger.debug("----- RELATIONS -----")    
        # Insert relationships
        insert_relations(driver, df_relations, get_database())
        
        # Close the driver connection
        driver.close()
        logger.info("Process completed successfully")
    except Exception as e:
        logger.error(f"Error in the main process: {e}")
        raise  



@click.command(name="load-pathway")
@click.option('--pathways', help='KEGG pathway IDs like hsa04210,hsa04152',     callback=parse_csv)
@click.option('--nodes', type=click.Path(), help="Fle nodes",     callback=parse_csv)
@click.option('--relations', type=click.Path(), help="File relations",     callback=parse_csv)
@click.option('--metadatas', type=click.Path(), help="File metadatas pathways")
def load_pathway(pathways, nodes, relations, metadatas):
    """
    Load pathways from TSV files.

    - No arguments: Load all pathways found in the default folder.
    - With --pathways: Automatically load nodes, relationships, and metadata from standard files.
    - With --pathways + files: Use the specified files.
    """

    if pathways and any([nodes, relations, metadatas]):
        # Load form files
        files = [nodes, relations, metadatas]
        if not all(files):
            click.echo(click.style("You must specify --nodes, --relations and --metadatas", fg="red"))
            return        
        for p in sorted(pathways):
            upload_pathway_files(p, files)
    elif pathways:
        # Selected pathways
        for p in sorted(pathways):
            upload_pathway_files(p)            
    elif not pathways:
        # Load from folder
        click.echo("🔍 Loading all pathways from default folder...")
        all_files = list(DATA_DIR.glob("hsa*_nodes.tsv"))
        pathways = {f.name.split("_")[0] for f in all_files}
        for p in sorted(pathways):
            upload_pathway_files(p)