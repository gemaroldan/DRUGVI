import logging


# Use logger config in __init__.py
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

def insert_meta_node_DB(session, row):
    typeNode = "DiseaseMap"  
    abrev =  "dm"

    query = """
        MERGE (%s:%s {id: $id})
        ON CREATE SET %s.name = $name, %s.label = $label
        ON MATCH SET %s.name = $name, %s.label = $label
    """ % (abrev, typeNode, abrev, abrev, abrev, abrev)

    params = { 
                "id": row['idOrpha'], 
                "name": row['name'], 
                "label": row['label'], 
            }

    logger.debug(query)
    logger.debug(params)    
    session.execute_write(create_nodes, query, params)    




def create_nodes(tx, query, params):
    try:
        tx.run(query, params)
        logger.debug(f"Ran query: {query} with params: {params}")
    except Exception as e:
        logger.error(f"Failed to create nodes: {e}")


def insert_relations_DB(session, originId, destinationId, index):
    typeNodeFrom =  "DiseaseMap"
    abrevFrom =  "dm"
    typeNodeTo =  "Circuit"
    abrevTo = "c"
    relationship = "INVOLVES"

    query = ( f"MERGE ({abrevFrom}:{typeNodeFrom} {{id: $id1}}) " 
                 f"MERGE ({abrevTo}:{typeNodeTo} {{id: $id2}}) " 
                 f"MERGE ({abrevFrom})-[r:{relationship}]->({abrevTo}) " 
                 )
    params ={
        "id1": originId,
        "id2": destinationId
    }
    logger.debug(query)
    logger.debug(params)
    logger.debug(f"Type of id1: {type(params['id1'])}, Value: {params['id1']}")
    logger.debug(f"Type of id2: {type(params['id2'])}, Value: {params['id2']}")
    session.run(query, params)