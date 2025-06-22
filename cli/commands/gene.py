import click
from pathlib import Path
import logging
import re
import pandas as pd

from commands.database.gene_db import update_node_DB_hgnc, update_node_DB_ensemble
from common.database import get_connection, get_database
from common.files import load_tsv

# Use logger config in __init__.py
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)


DATA_DIR = Path(__file__).parent.parent / "data" / "genes"

DATABASE_HGNC = "HGNC"
DATABASE_ENSEMBLE = "ENSEMBLE"

# Use logger config in __init__.py
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

def update_data(driver, df_nodes_genes, database, typeDatabase):
    """ Update data into Database """
    with driver.session(database=database) as session:
        for i, row in df_nodes_genes.iterrows(): 
            logger.debug(f"Insert data: {i}")
            if typeDatabase == DATABASE_HGNC:                
                update_node_DB_hgnc(session, df_nodes_genes.iloc[i],i)
            else:
                if not pd.isna(row["dbprimary_acc"]):
                    update_node_DB_ensemble(session, df_nodes_genes.iloc[i],i)
                         


def upload_gene_files():
    """Uploading a set of files from genes to Neo4"""
    
    # Search names
    patterns = {
        DATABASE_HGNC: "hgnc_complete_set_2025-06-03.txt",
        DATABASE_ENSEMBLE: "genes_ensemble.tsv"        
    }

    click.echo(f"👌 Loading genes:")

    try:
        logger.info("Starting the TSV to Neo4j import process")
        driver = get_connection()
        
        for database, pattern in patterns.items():
            matches = list(DATA_DIR.glob(pattern))
            if not matches:
                click.echo(click.style(f"No matching file found for {database}: {pattern}", fg="red"))
                continue

            file_path = matches[0]

            if not file_path.exists():
                click.echo(click.style(f"File not found: {file_path}", fg="red"))
                continue

            click.echo(f"👌 Loading genes from {file_path.name}:")
            df_genes = load_tsv(file_path)

            logger.debug(f"----- NODES {database} -----")
            
            update_data(driver, df_genes, get_database(), database)

        # Close the driver connection
        driver.close()
        logger.info("Process completed successfully")

    except Exception as e:
        logger.error(f"Error in the main process: {e}")
        raise  


@click.command(name="load-gene")
def load_genes():
    """ Load drugs from TSV file. """

    # Load from folder
    click.echo("🔍 Update all genes from default folder...")

    upload_gene_files()