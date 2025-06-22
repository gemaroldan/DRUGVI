import logging

from commands.database.common_db import clean_param, get_list


# Use logger config in __init__.py
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
  

def update_node_DB_ensemble(session, row, i):
    query = """
    MATCH (g:Gene {hgnc_id: $hgnc_id})
    SET      
        g.seq_region_name = $seq_region_name,
        g.seq_region_start = $seq_region_start,
        g.seq_region_end = $seq_region_end,
        g.transcript_stable_id = $transcript_stable_id        
    """
        # g.ensemble_id = $ensemble_id,
        #g.symbol = $symbol,
        #g.name = $display_label,
        #g.synonyms = $synonyms

    params = {
        "hgnc_id": clean_param(row["dbprimary_acc"]),
        #"ensemble_id": clean_param(row["gene_stable_id"]),
        "seq_region_name": clean_param(row["seq_region_name"]),
        "seq_region_start": clean_param(row["seq_region_start"]),
        "seq_region_end": clean_param(row["seq_region_end"]),
        "transcript_stable_id": clean_param(row["transcript_stable_id"])
        #"symbol": clean_param(row["symbol"]),
        #"display_label": clean_param(row["display_label"]),
        #"synonyms": get_list(row["synonyms"])
    }

    logger.debug(query)
    logger.debug(params)     
    session.run(query, params)


def update_node_DB_hgnc(session, row, i):
    query = """
    MATCH (g:Gene {id: $entrez_id})
    SET g.hgnc_id = $hgnc_id,
        g.ensemble_id = $ensemble_id,
        g.symbol = $symbol,
        g.name = $display_label,
        g.label = $label,
        g.synonyms = $synonyms,
        g.uniprot_id = $uniprot_id,
        g.pubmed_id = $pubmed_id,
        g.omim_id = $omim_id,
        g.orphanet_id = $orphanet_id
    """

    params = {
        "hgnc_id": clean_param(row["hgnc_id"]),
        "ensemble_id": clean_param(row["ensembl_gene_id"]),
        "symbol": clean_param(row["symbol"]),
        "display_label": clean_param(row["symbol"]),
        "synonyms": get_list(row["alias_symbol"], "|"),
        "label": clean_param(row["name"]),
        "entrez_id": str(clean_param(row["entrez_id"])),
        "uniprot_id": clean_param(row["uniprot_ids"]),
        "pubmed_id": get_list(row["pubmed_id"], "|"),
        "omim_id": clean_param(row["omim_id"]),
        "orphanet_id": clean_param(row["orphanet"])
    }

    logger.debug(query)
    logger.debug(params)     
    session.run(query, params)