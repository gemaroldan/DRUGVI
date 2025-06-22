import click

from commands.pathway import load_pathway
from commands.circuit import load_circuit
from commands.drug import load_drug
from commands.gene import load_genes


@click.group()
def cli():
    """DrugVi CLI – Tools for loading data into Neo4j"""
    pass

cli.add_command(load_pathway)
cli.add_command(load_circuit)
cli.add_command(load_drug)
cli.add_command(load_genes)

if __name__ == "__main__":
    cli()