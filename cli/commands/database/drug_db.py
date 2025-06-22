import logging


# Use logger config in __init__.py
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

def insert_node_batch_DB(session, batch):
    try:
        session.write_transaction(_create_drug_batch_DB, batch)
    #    session.execute_write(_create_drug_batch_DB, batch)
    except Exception as e:
        logger.error(f"Failed to create nodes: {e}")


def _create_drug_batch_DB(session, batch):
    for drug in batch:
        drugbank_id = drug.main_drugbank_id
        if not drugbank_id:
            continue

        for target in drug.targets:
            for polypeptide in target.polypeptide:

                # Obtener hgnc_id para saber si el gen existe
                hgnc_id_gene = get_hgnc_id(polypeptide.external_ids)
                if hgnc_id_gene is None:
                    continue

                # Verificar si el nodo Gene existe
                check_gene_query = """
                    MATCH (g:Gene {hgnc_id: $hgnc_id})
                    RETURN g LIMIT 1
                """
                result = session.run(check_gene_query, {"hgnc_id": hgnc_id_gene})
                if not result.peek():
                    logger.debug(f"Gene with hgnc_id {hgnc_id_gene} not found. Skipping drug {drugbank_id}.")
                    continue  # Gene no existe → no crear Drug ni Protein

                # Crear nodo Protein
                query_protein = """
                    MERGE (p:Protein {id: $uniprot_id})
                    ON CREATE SET
                        p.name = $uniprot_name,
                        p.source = $source,
                        p.general_function = $function,
                        p.external_ids = $external_ids
                    ON MATCH SET
                        p.name = coalesce(p.name, $uniprot_name),
                        p.source = coalesce(p.source, $source),
                        p.general_function = coalesce(p.general_function, $function),
                        p.external_ids = coalesce(p.external_ids, $external_ids)
                """
                params_protein = {
                    "uniprot_id": polypeptide.id,
                    "uniprot_name": target.name,
                    "source": polypeptide.source,
                    "function": polypeptide.general_function,
                    "external_ids": polypeptide.external_ids
                }
                session.run(query_protein, params_protein)

                # Crear nodo Drug
                query_drug = """
                    MERGE (d:Drug {id: $drugbank_id})
                    ON CREATE SET 
                        d.name = $drug_name,
                        d.synonyms = $synonyms
                    ON MATCH SET 
                        d.name = coalesce(d.name, $drug_name),
                        d.synonyms = coalesce(d.synonyms, $synonyms)
                """
                params_drug = {
                    "drugbank_id": drugbank_id,
                    "drug_name": drug.name,
                    "synonyms": drug.synonyms
                }
                session.run(query_drug, params_drug)

                # Crear relación Gene → Protein
                gene_relation_query = """
                    MATCH (g:Gene {hgnc_id: $hgnc_id})
                    MATCH (p:Protein {id: $uniprot_id})
                    MERGE (g)-[:ENCODES]->(p)
                """
                session.run(gene_relation_query, {
                    "hgnc_id": hgnc_id_gene,
                    "uniprot_id": polypeptide.id
                })

                # Crear relaciones Drug → Protein por acción
                for action in target.actions:
                    action_upper = action.upper().replace("-", "_")
                    relation_query = f"""
                        MATCH (d:Drug {{id: $drugbank_id}})
                        MATCH (p:Protein {{id: $uniprot_id}})
                        MERGE (d)-[:{action_upper}]->(p)
                    """
                    params = {
                        "drugbank_id": drugbank_id,
                        "uniprot_id": polypeptide.id
                    }
                    session.run(relation_query, params)



def _create_drug_batch_DB_delete(session, batch):
    for drug in batch:
        drugbank_id = drug.main_drugbank_id
        if not drugbank_id:
            continue
        
        # id => Drugbank
        query = """           
                MERGE (d:Drug {id: $drugbank_id})
                ON CREATE SET 
                    d.id = $drugbank_id,   
                    d.name = $drug_name,
                    d.synonyms = $synonyms
                ON MATCH SET 
                    d.name = coalesce(d.name, $drug_name),
                    d.synonyms = coalesce(d.synonyms, $synonyms)                  
                            """
        params =  {
                                "drugbank_id": drugbank_id,
                                "drug_name": drug.name,
                                "synonyms": drug.synonyms
                            }
        
        logger.debug(query)
        logger.debug(params)
        session.run(query, params)


        for target in drug.targets:
            for polypeptide in target.polypeptide:
                # Create node Protein
                # id => Uniprod
                query = """
                    MERGE (p:Protein {id: $uniprot_id})
                    SET p.id = $uniprot_id,   
                        p.name = coalesce(p.name, $uniprot_name),
                        p.source = $source,
                        p.general_function = $function,
                        p.external_ids = $external_ids
                    """
                params = {
                        "uniprot_id": polypeptide.id,
                        "uniprot_name": target.name,
                        "source": polypeptide.source,
                        "function": polypeptide.general_function,                        
                        "external_ids": polypeptide.external_ids
                    }

                logger.debug(query)
                logger.debug(params)
                session.run(query, params)

                # Create relation by action
                for action in target.actions:
                    action_upper = action.upper().replace("-", "_")
                    relation_query = f"""
                        MATCH (d:Drug {{id: $drugbank_id}})
                        MATCH (p:Protein {{id: $uniprot_id}})
                        MERGE (d)-[r:{action_upper}]->(p)                        
                    """
                    # SET r.organism = $organism,
                    # r.target_name = $target_name
                    params = {
                            "drugbank_id": drugbank_id,
                            "uniprot_id": polypeptide.id
                            #,
                            #"organism": target.organism,
                            #"target_name": target.name
                    }
                    
                    logger.debug(relation_query)
                    logger.debug(params)                    
                    session.run(relation_query, params)

                # Create relation by gene
                hgnc_id_gene =  get_hgnc_id(polypeptide.external_ids)
                if hgnc_id_gene != None:
                    gene_relation_query = f"""                        
                            MERGE (g:Gene {{hgnc_id: $hgnc_id}})
                            WITH g
                            MATCH (p:Protein {{uniprot_id: $uniprot_id}})
                            MERGE (g)-[r:ENCODES]->(p)
                        """
                    params = {
                            "hgnc_id": hgnc_id_gene,
                            "uniprot_id": polypeptide.id
                    }
                    
                    logger.debug(gene_relation_query)
                    logger.debug(params)
                    session.run(gene_relation_query, params)

                
def get_hgnc_id(external_ids):
    for ext_id in external_ids:
        if ext_id.startswith("HGNC:"):
            return ext_id
    return None   