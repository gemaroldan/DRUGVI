from common.database import get_connection, get_database
from common.logger_config import logger
from services.service import remove_nodes_duplicates

LIMIT = "LIMIT 10000"


def get_all_pathways():
    driver = get_connection()
    pathways = []

    query = f"MATCH (p:Pathway) RETURN p {LIMIT}"
    logger.debug(query)

    try:
        with driver.session(database=get_database()) as session:
            result = session.run(query)
            for record in result:
                node = record["p"]
                props = dict(node.items())
                pathways.append({
                    "id": props.get("id"),
                    "name": props.get("name")
                })
        return {"pathways": pathways}
    except Exception as e:
        logger.error(f"Error retrieving pathways: {e}")
        raise
    finally:
        pass

def get_pathways_by_ids(patwhays_ids):
    """ Get info about pathways (name)"""
    driver = get_connection()

    query = f"MATCH (p:Pathway) WHERE p.id IN {patwhays_ids} RETURN p {LIMIT}"
    logger.debug(query)
    pathways = []
    try:
        with driver.session(database=get_database()) as session:
            result = session.run(query)
            for record in result:
                n = record["p"]
                properties = dict(n.items())
                pathways.append( {
                    "id": properties.get("id"),
                    "name": properties.get("name"),
                    "section": properties.get("section")
                })
        return pathways
    except Exception as e:
        logger.error(f"Error getting nodes from Neo4j: {e}")
        raise
    finally:
        pass


def get_n_pathways(pathway_id):
    """ Get all nodes from one pathway"""
    driver = get_connection()

    query = f"MATCH (n:NPathway) -[r]->(m:NPathway) WHERE n.id STARTS WITH '{pathway_id}' RETURN n, r, m {LIMIT}"
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


def get_effector_genes(pathway_id):
    """Get all effectors genes from one pathway"""
    driver = get_connection()

    query = f""" MATCH (n:NPathway) WHERE n.id STARTS WITH '{pathway_id}' AND NOT EXISTS 
                {{ MATCH (n)-[r:activation|inhibition]->(m) WHERE NOT m:Function }}
                RETURN DISTINCT n
                {LIMIT}"""
    
    logger.debug(query)
    try:
        with driver.session() as session:
            result = session.run(query)
            nodes = []

            for record in result:
                # Extraer los nodos
                n = record["n"]

                # Añadir los nodos si no están en la lista
                nodes.append({"id": n.element_id, "labels": list(n.labels), "properties": dict(n.items())})

                logger.debug(nodes[0])
            return {"nodes": remove_nodes_duplicates(nodes)}
 
    except Exception as e:
        logger.error(f"Error retrieving pathways: {e}")
        raise
    finally:
        pass



def get_patwhay_effector_gene(effector_gene_Id):
    """Get pathway from effector genes from pathway"""

    driver = get_connection()

    query = f"MATCH path = (n:NPathway {{id: '{effector_gene_Id}'}})<-[r:activation|inhibition*]-(m) RETURN nodes(path) as nodes, relationships(path) as rels {LIMIT}"
    logger.debug(query)

    try:
        with driver.session() as session:
            result = session.run(query)
            list_nodes = []
            links = []

            for record in result:
                # Extraer nodos
                nodes = record["nodes"]
                for n in nodes:
                    if n.element_id:
                        list_nodes.append({"id": n.element_id, "labels": list(n.labels), "properties": dict(n.items())})


                # Extraer relaciones
                rels = record["rels"]
                for rel in rels:
                    rel_props = dict(rel.items())
                    rel_props["type"] = rel.type  # tipo de relación (activation/inhibition)
                    rel_props["source"] = {
                       "id": rel.start_node.element_id  # ID del nodo origen
                    }
                    rel_props["target"] = {
                        "id" : rel.end_node.element_id      # ID del nodo destino
                    }
                    links.append(rel_props)

   
            return {"nodes": remove_nodes_duplicates(list_nodes), "links" : links}
    
    except Exception as e:
        logger.error(f"Error retrieving pathways: {e}")
    finally:
        pass    

    """
    query = f"MATCH path = (n:NPathway {{id: '{effector_gene_Id}'}})<-[:activation|inhibition*]-(related) RETURN path {LIMIT}"   
    logger.debug(query)

    try:
        with driver.session() as session:
            result = session.run(query)
            nodes = []
            
            for record in result:
                path =  record["path"]
                
                if path and path.nodes:
                    for n in path.nodes:
                        # Añadir los nodos si no están en la lista
                        nodes.append({"id": n.element_id, "labels": list(n.labels), "properties": dict(n.items())})

                    logger.debug(nodes[0])

            return {"nodes": remove_nodes_duplicates(nodes)}
    
    except Exception as e:
        logger.error(f"Error retrieving pathways: {e}")
    finally:
        pass    
    """    

def get_ini_effector_gene(effector_gene_id):
    """Get all initial effector genes from efector gene"""
    driver = get_connection()

    query = f""" MATCH (end:NPathway {{id: '{effector_gene_id}'}}) 
                WHERE NOT (end)-[:activation|inhibition]->(:NPathway)
                WITH end
                MATCH (start:NPathway)
                WHERE NOT ()-[:activation|inhibition]->(start)
                WITH start, end
                MATCH path = (start)-[:activation|inhibition*]->(end)
                RETURN DISTINCT start                
                {LIMIT}"""
    
    logger.debug(query)
    try:
        with driver.session() as session:
            result = session.run(query)
            nodes = []

            for record in result:
                # Extraer los nodos
                n = record["start"]

                # Añadir los nodos si no están en la lista
                nodes.append({"id": n.element_id, "labels": list(n.labels), "properties": dict(n.items())})

                logger.debug(nodes[0])
            return {"nodes": remove_nodes_duplicates(nodes)}
 
    except Exception as e:
        logger.error(f"Error retrieving pathways: {e}")
    finally:
        pass


def get_patwhay_ini_effector_gene(ini_effector_gene_id, effector_gene_id ):
    """Get patwhay from effector genes to ini_effector_gene"""
    driver = get_connection()

    query = f""" MATCH (start:NPathway {{id: '{ini_effector_gene_id}'}}), (end:NPathway {{id: '{effector_gene_id}'}})
                 MATCH path = (start)-[:activation|inhibition*]->(end)
                 RETURN path
                {LIMIT}"""
    
    logger.debug(query)
    try:
        with driver.session() as session:
            result = session.run(query)
            nodes = []

            for record in result:
                # Extraer los nodos
                n = record["path"]
                
                for n in n.nodes:

                    # Añadir los nodos si no están en la lista
                    nodes.append({"id": n.element_id, "labels": list(n.labels), "properties": dict(n.items())})

                    logger.debug(nodes[0])
                
            return {"nodes": remove_nodes_duplicates(nodes)}
 
    except Exception as e:
        logger.error(f"Error retrieving pathways: {e}")
    finally:
        pass



def get_node_detail(pathway_id):
    driver = get_connection()

    query = f"MATCH (n:NPathway {{id: '{pathway_id}'}})-[r]-(related) RETURN n, r, related {LIMIT}"
    logger.debug(query)
        
    try:
        with driver.session() as session:
            result = session.run(query)
            nodes = []
            links = []

            for record in result:
                # Extraer los nodos y las relaciones
                n = record["n"]
                r = record["r"]
                related = record["related"]
                
                # Añadir los nodos si no están en la lista
                nodes.append({"id": n.element_id, "labels": list(n.labels), "properties": dict(n.items())})
                
                # Añadir los nodos relacionados si no están en la lista
                nodes.append({"id": related.element_id, "labels": list(related.labels), "properties": dict(related.items())})

                # Añadir la relación
                links.append({
                    "source": {
                        "id": n.element_id                      
                    },
                    "target": {
                        "id" : related.element_id
                    },
                    "type": r.type,
                    "properties": dict(r.items())
                })


            logger.debug(nodes[0])
            logger.debug(links[0])
            return {"nodes": remove_nodes_duplicates(nodes), "links": links}
 
    except Exception as e:
        logger.error(f"Error getting nodes from Neo4j: {e}")
    finally:
        pass


def get_node_detail_drug(pathway_id):
    driver = get_connection()

    # Add info Drug and Protein
    query = f"""
            MATCH (n:NPathway {{id: '{pathway_id}'}})-[*1..2]-(g:Gene)
            MATCH (g)-[:ENCODES]->(prot:Protein)
            OPTIONAL MATCH (drug:Drug)-[r]->(prot)
            RETURN DISTINCT n, g, prot, r, drug {LIMIT}
        """

    logger.debug(query)

    try:
        with driver.session() as session:
            result = session.run(query)
            nodes = []
            links = []

            for record in result:
                # Extraer los nodos y las relaciones
                n = record["n"]
                r = record["r"]
                g = record["g"]
                prot = record["prot"]
                drug = record["drug"]
                
                # Añadir los nodos si no están en la lista
                nodes.append({"id": prot.element_id, "labels": list(prot.labels), "properties": dict(prot.items())})

                nodes.append({"id": drug.element_id, "labels": list(drug.labels), "properties": dict(drug.items())})
                
                
                # Añadir la relación
                links.append({
                    "source": {
                        "id": prot.element_id                      
                    },
                    "target": {
                        "id" : drug.element_id
                    },
                    "type": r.type,
                    "properties": dict(r.items())
                })

                links.append({
                    "source": {
                        "id": g.element_id                      
                    },
                    "target": {
                        "id" : prot.element_id
                    },
                    "type": "ENCODES",
                    "properties": dict(r.items())
                })

            logger.debug(nodes[0])
            logger.debug(links[0])
            return {"nodes": remove_nodes_duplicates(nodes), "links": links}
 
    except Exception as e:
        logger.error(f"Error getting nodes from Neo4j: {e}")
    finally:
        pass



  