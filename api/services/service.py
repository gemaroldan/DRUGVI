
from common.database import get_connection, get_database
from common.logger_config import logger

LIMIT = "LIMIT 10000"

def remove_nodes_duplicates(nodes):
    if nodes:
        unique_nodes = {node['id']: node for node in nodes}
        return list(unique_nodes.values())
    else:
        return [] 


def merge_graph_responses(*graphs):
    all_nodes = []
    all_links = []

    for graph in graphs:
        if not graph:
            continue
        all_nodes.extend(graph.get("nodes", []))
        all_links.extend(graph.get("links", []))

    # Deduplicar nodos por ID
    unique_nodes = {node['id']: node for node in all_nodes}.values()

    # Deduplicar links por claves simples (asumiendo que source y target son strings o tienen 'id')
    def extract_id(obj):
        return obj if isinstance(obj, str) else obj.get('id')

    unique_links = {
        (
            extract_id(link['source']),
            extract_id(link['target']),
            link.get('type')
        ): link
        for link in all_links
    }.values()

    return {
        "nodes": list(unique_nodes),
        "links": list(unique_links)
    }