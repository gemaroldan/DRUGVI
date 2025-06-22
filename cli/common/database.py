import logging
from neo4j import GraphDatabase
import os

# Load var from .env
from dotenv import load_dotenv

# Usar el logger configurado en __init__.py
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

def get_database():
    return os.getenv("NEO4J_DATABASE", "neo4j")

def get_connection():        
    uri = os.getenv("NEO4J_URI")
    user = os.getenv("NEO4J_USER")
    password = os.getenv("NEO4J_PASSWORD")
    database = os.getenv("NEO4J_DATABASE", "neo4j")

    # Connect to Neo4j
    if user == None:
        driver = connect_neo4j_without(uri)
    else:    
        driver = connect_neo4j(uri, user, password)
    return driver    


# Connect to Neo4j without authentication
def connect_neo4j_without(uri):
    try:
        driver = GraphDatabase.driver(uri)
        logger.info(f"Connected to Neo4j at {uri}")
        return driver
    except Exception as e:
        logger.error(f"Failed to connect to Neo4j: {e}")
        raise

# Connect to Neo4j
def connect_neo4j(uri, user, password):
    print(uri, user, "***")

    driver = GraphDatabase.driver(uri, auth=(user, password))    
    return driver