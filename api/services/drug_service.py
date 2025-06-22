from common.database import get_connection, get_database
from common.logger_config import logger
from services.service import remove_nodes_duplicates

LIMIT = "LIMIT 10000"


def get_all_drug():
    driver = get_connection()
    drugs = []

    query = f"MATCH (p:Drug) RETURN p {LIMIT}"
    logger.debug(query)

    try:
        with driver.session(database=get_database()) as session:
            result = session.run(query)
            for record in result:
                node = record["d"]
                props = dict(node.items())
                drugs.append({
                    "id": props.get("id"),
                    "name": props.get("name")
                })
        return {"drugs": drugs}
    except Exception as e:
        logger.error(f"Error retrieving drugs: {e}")
        raise
    finally:
        pass



     

   


def search_drugs_gene(genes_ids):
    driver = get_connection()

    query = f"MATCH (n:NPathway) -[r]->(m:NPathway) WHERE n.id STARTS WITH '{genes_ids}' RETURN n, r, m {LIMIT}"

    query = """
            MATCH (g:Gene)-[:ENCODES]->(p:Protein)<-[r]-(d:Drug)
            WHERE g.id IN $gene_ids
            RETURN d.name AS drug_name, p.name AS protein_name, g.name AS gene_name, type(r) AS relation
            """
    logger.debug(query)

    try:
        with driver.session(database=get_database()) as session:
            result = session.run(query)
            nodes = []
            links = []

            for record in result:
                # Extraer los nodos y las relaciones
                n = record["n"]
                m = record["m"]
                r = record["r"]
                
                # Añadir los nodos si no están en la lista
                nodes.append({"id": n.element_id, "labels": list(n.labels), "properties": dict(n.items())})
                nodes.append({"id": m.element_id, "labels": list(m.labels), "properties": dict(m.items())})                            

                # Añadir la relación
                links.append({
                    "source": {
                        "id": n.element_id                        
                    },
                    "target": {
                        "id" : m.element_id
                    },
                    "type": r.type,
                    "properties": dict(r.items())
                })

            logger.debug(nodes[0])
            logger.debug(links[0])
            return {"nodes": remove_nodes_duplicates(nodes), "links": links}
    except Exception as e:
        logger.error(f"Error retrieving pathways: {e}")
        raise
    finally:
        pass    
