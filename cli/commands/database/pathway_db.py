import logging


# Use logger config in __init__.py
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

def insert_meta_node_DB(session, row):
    typeNode = "p:Pathway"
    query = """
        MERGE (%s {id: $id})
        ON CREATE SET p.name = $name, p.section = $section
        ON MATCH SET p.name = $name, p.section = $section
    """ % (typeNode)
    params = { 
                "id": row['id'], 
                "name": row['name'], 
                "section": row['section'], 
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

def insert_node_DB(session, row, index):
    logger.debug(index)
    if "circle" in row['shape'] :
        logger.debug("circle")
    typeNode = "Function" if "func" in row['name'] else "NPathway"  
    abrevNode = "f" if "func" in row['name'] else "np"   
    typeMetabolite = abrevNode + ".shape = $shape," if "circle" in row['shape'] else ""

    query = """
        MERGE (%s:%s { id: $id }) 
        SET %s.name = $name,            
            %s       
            %s.x = toInteger($x),
            %s.y = toInteger($y)            
        """ % (abrevNode, typeNode, abrevNode, typeMetabolite, abrevNode, abrevNode)
    
    params = {
                "id": row['name'], 
                "name": row['label'], 
                "x": row['x'], 
                "y": row['y'],
                "shape":  'metabolite' if row['shape']  == 'circle' else ''
            }
    

    # Add genes
    if not "func" in row['name']:
        # tooltip
        tooltip = str(row['tooltip'])
        tooltip_genes = tooltip.split("<br>")
        map_genes = {}
        for tooltip_gene in tooltip_genes:
            logger.debug(tooltip_gene.find("(") == -1)
            if tooltip_gene.find("(") != -1:
                ini = tooltip_gene.find(">") +1
                end = tooltip_gene.find("</")
                gene_id = tooltip_gene[ini:end]
                ini = tooltip_gene.find("(") + 1
                end = tooltip_gene.find(")")
                gene_name = tooltip_gene[ini:end]
                if (gene_name != ""):
                    map_genes[gene_id] = gene_name                
                
            # replace NAN    
            else:
                ini = tooltip_gene.find("?") +1
                end = tooltip_gene.find(">")
                gene_id = tooltip_gene[ini:end]
                ini = tooltip_gene.find(">") + 1
                end = tooltip_gene.find("</")
                gene_name = tooltip_gene[ini:end]
                map_genes[gene_id] = gene_name            
                if (gene_name != ""):
                    map_genes[gene_id] = gene_name                

        geneList = str(row['genesList'])
        
        # replace NAN
        if geneList.find("nan") != -1 :
            filtered_list = filter(lambda g: not g.isnumeric(),  map_genes.keys())
            first = next(filtered_list, None)
            geneList = geneList.replace("nan", first)

        # Complex
        if " " in row['name']:            
            jdx = 1
            for complex_id in geneList.split('/'):
                logger.debug(complex_id)

                entrez_id = complex_id.replace(";","")
                logger.debug(entrez_id)
                logger.debug(complex_id)
                logger.debug(map_genes)
                if entrez_id.isnumeric():
                    typeNode = 'Gene'
                    location = ''
                else:
                    typeNode = 'Metabolite' 
                    location = """,x: %s, y: %s """ % (row['x'], row["y"])
                
                new_query =  """ 
                            MERGE  (gc%i_%i: %s { 
                            id: "%s",
                            name: "%s"
                            %s 
                        }) """ % (index, jdx, typeNode, entrez_id,map_genes[entrez_id] if entrez_id in map_genes  else entrez_id, location)
                query = query + new_query                

                new_query =  """ MERGE (np)-[:ASSOCIATED_M_WITH {complex:"%s"}]->(gc%i_%i)""" % (geneList, index, jdx)
                query = query + new_query
                
                jdx = jdx + 1
        # Simple    
        else:
            jdx = 1
            for entrez_id in geneList.split(';'):
                logger.debug(map_genes)
                if entrez_id.isnumeric():
                    typeNode = 'Gene'
                    location = ''
                else:
                    typeNode = 'Metabolite' 
                    location = """,x: %s, y: %s """ % (row['x'], row["y"])

                new_query = """ 
                    MERGE  (gs%i_%i:%s { 
                    id: "%s",                    
                    name: "%s"
                    %s
                })
                """ % (index, jdx, typeNode, entrez_id, map_genes[entrez_id] if entrez_id in map_genes  else entrez_id, location)              
                query = query + new_query                
                
                new_query = """MERGE (np)-[:ASSOCIATED_WITH]->(gs%i_%i)""" % (index, jdx)
                query = query + new_query
                
                jdx = jdx + 1
        
    logger.debug(query)
    logger.debug(params)
    session.execute_write(create_nodes, query, params)

def insert_relationDB(session, row, index):
    typeNodeFrom = "Function" if "func" in row['from'] else "NPathway"
    abrevFrom = "f" if "func" in row['from'] else "np"
    typeNodeTo = "Function" if "func" in row['to'] else "NPathway"
    abrevTo = "f" if "func" in row['from'] else "np"
    relationship = row['relation']

    query = (f"MERGE ({abrevFrom}1:{typeNodeFrom} {{id: $id1}}) " 
                 f"MERGE ({abrevFrom}2:{typeNodeTo} {{id: $id2}}) " 
                 f"MERGE ({abrevFrom}1)-[r:{relationship}]->({abrevTo}2) " 
                 )
    params ={
        "id1": row["from"],
        "id2": row["to"]
    }
    logger.debug(query)
    session.run(query, params)