from importlib.resources.readers import remove_duplicates
from common.database import get_connection, get_database
from common.logger_config import logger
from services.pathways_service import get_pathways_by_ids, get_patwhay_effector_gene, get_patwhay_ini_effector_gene
from services.service import merge_graph_responses, remove_nodes_duplicates

LIMIT = "LIMIT 10000"

def get_all_disease_maps():   
    """ Get all diseaseMaps"""
    driver = get_connection()
    disease_maps = []

    query = f"MATCH (dm:DiseaseMap) RETURN dm {LIMIT}"
    logger.debug(query)
    
    try:
        logger.debug(driver)
        logger.debug(get_database())
        with driver.session(database=get_database()) as session:
            logger.debug("Before") 
            result = session.run(query)
            logger.debug(result)
            for record in result:
                n = record["dm"]
                properties = dict(n.items())
                disease_maps.append({
                    "id": properties.get("id"),
                    "name": properties.get("name")
                })
        return {"diseases_maps": disease_maps}
    except Exception as e:
        logger.error(f"Error getting nodes from Neo4j: {e}")
        raise
    finally:
        pass


def disease_map_transform(data):
    result = {}

    for item in data:
        partes = item['id'].split('.')
        key = partes[1] if len(partes) > 1 else None
        id_completo = item['id']

        if key:
            if key not in result:
                result[key] = {
                    'circuits': [id_completo],
                    'subpathways': {}
                }
            else:
                if id_completo not in result[key]['circuits']:
                    result[key]['circuits'].append(id_completo)
    return result



def get_disease_map_by_id(disease_map_id):
    """ Get diseaseMap by id"""
    driver = get_connection()

    query = f"MATCH (dm:DiseaseMap) WHERE dm.id = '{disease_map_id}' RETURN dm {LIMIT}"
    logger.debug(query)
    
    try:
        with driver.session(database=get_database()) as session:
            result = session.run(query)
            for record in result:
                n = record["dm"]
                properties = dict(n.items())
                return {
                    "id": properties.get("id"),
                    "name": properties.get("name")
                }
        return {}     
    except Exception as e:
        logger.error(f"Error getting nodes from Neo4j: {e}")
        raise
    finally:
        pass


def get_disease_map(disease_map_id):
    """Get all subpathways from one diseaseMap"""
    circuits_ids = get_disease_map_subpathways(disease_map_id)

    # Get name 
    disease_map = get_disease_map_by_id(disease_map_id)
    disease_map = {
        'id': disease_map_id,
        'name':  disease_map['name'] if 'name' in disease_map else ''
    }

    pathways_circuits = disease_map_transform(circuits_ids)

    list_pathways_ids = []
    for key, data in pathways_circuits.items(): 
        
        subpathways_disease_map = {}
        list_pathways_ids.append(key);

        for circuit_id in data['circuits']:
            # From name circuit get list de n-pathways
            list_n_pathways = get_all_n_pathways_id(circuit_id)
            
            # Get subptahways
            for n_pathway in list_n_pathways:
                # subpatwhay from n_patwhay to inicial
                subpathways_from_npathway_to_ini = get_patwhay_effector_gene(n_pathway)

                # subpatwhay from n_patwhay to end
                subpathways_from_npathway_to_end = get_subpathways_from_npathway_to_end(n_pathway)       
                subpathways = merge_graph_responses(subpathways_from_npathway_to_ini, subpathways_from_npathway_to_end)

                subpathways_disease_map=merge_graph_responses(subpathways_disease_map, subpathways)

        pathways_circuits[key]["subpathways"] = subpathways_disease_map
    
    # Get name form pathways
    pathways = get_pathways_by_ids(list_pathways_ids)        
    for key, data in pathways_circuits.items(): 
        pathways_circuits[key]["name"] =  next((p["name"] for p in pathways if p["id"] == key), None)

    disease_map["diseaseCircuits"] = pathways_circuits
    return disease_map 



def get_subpathways_from_npathway_to_end(n_pathway):
    driver = get_connection()
    subpathways = []

    # Only complete paths to the end, i.e., those that truly "terminate" there (without further activation/inhibition)
    query = f"MATCH path = (start:NPathway {{id: '{n_pathway}'}})-[:activation|inhibition*]->(end) WHERE NOT (end)-[:activation|inhibition]->() RETURN path {LIMIT}"

    # TODO: regardless of whether the destination nodes remain connected to others
    # query2 = f"MATCH path = (n:NPathway {id: '{n_pathway}'})-[:activation|inhibition*]->(related) RETURN path {LIMIT}"
    
    logger.debug(f"Query: {query} | Params: {{'n_pathway': '{n_pathway}'}}")

    try:
        with driver.session(database=get_database()) as session:
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


def get_disease_map_subpathways(disease_map_id):
    """ Get all from circuit n-patwhays from one diseaseMap"""
    driver = get_connection()
    subpathways = []

    query = f"MATCH (n:DiseaseMap )-[r]->(c:Circuit) WHERE n.id = '{disease_map_id}'  RETURN n, r, c {LIMIT}"
    
    logger.debug(f"Query: {query} | Params: {{'disease_map_id': '{disease_map_id}'}}")

    try:
        with driver.session(database=get_database()) as session:
            result = session.run(query, disease_map_id=disease_map_id)
            for record in result:
                node = record["c"]
                props = dict(node.items())
                subpathways.append({
                    "id": props.get("id"),                   
                })
        return subpathways
    except Exception as e:
        logger.error(f"Error retrieving subpathways: {e}")
        raise
    finally:
        pass


def get_all_n_pathways_id(circuit_id):
    """Get list nodes replace by N"""
    #return [node["properties"]["id"].replace("P", "N", 1) for node in circuits["p_pathways"]]
    # TODO more than one
    if not circuit_id.startswith("P.hsa"):
        return [circuit_id]

    # Remove 'P.hsa' and split the rest by dots
    parts = circuit_id.replace("P.hsa", "").split(".")

    if not parts:
        return []

    # Join the first part (e.g. 04110) with dashes and spaces
    main = parts[0]
    rest = parts[1:]

    transformed = f"N-hsa{main}"
    if rest:
        transformed += "-" + rest[0]
    if len(rest) > 1:
        transformed += " " + " ".join(rest[1:])

    return [transformed]



def get_subpathways_disease_map(list_n_pathways):
    driver = get_connection()

    query = f"""  WITH {list_n_pathways} AS list
            MATCH (n:NPathway)-[r]-(m:NPathway)
            where n.id in list return n,r, m  LIMIT 1000
            """

    logger.debug(query)
    nodes = []
    links = []
    try:
        with driver.session() as session:
            result = session.run(query)
            i = 0
            for record in result:
                # Extraer los nodos y las relaciones
                n = record["n"]
                m = record["m"]
                rs = record["r"]
                i = i+1
                logger.debug(i)

                # Añadir los nodos si no están en la lista
                nodes.append({"id": n.element_id, "labels": list(n.labels), "properties": dict(n.items())})
                nodes.append({"id": m.element_id, "labels": list(m.labels), "properties": dict(m.items())})                            
                logger.debug(n._properties["id"])
                logger.debug(m._properties["id"])

                # Añadir la relación
                links.append({
                    "source": {
                        "id": n.element_id                      
                    },
                    "target": {
                        "id" : rs.element_id
                    },
                    "type": rs.type,
                    "properties": dict(rs.items())
                })

            #logger.debug(nodes[0])
            #logger.debug(links[0])
            return {"nodes": remove_duplicates(nodes), "links": links}     

    except Exception as e:
        logger.error(f"Error getting nodes from Neo4j: {e}")
    finally:
        # neo4j_config.close()
        pass

