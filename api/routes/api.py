from flask import Flask, jsonify
import os

REACT_APP_API_URL = os.getenv("REACT_APP_API_URL", "http://localhost:5000")

def register_routes(app: Flask):
    @app.route("/", methods=["GET"])
    def health_check():
        routes = []
        with app.test_request_context():
            for rule in app.url_map.iter_rules():
                methods = ','.join(sorted(rule.methods - {"HEAD", "OPTIONS"}))  # Quitar métodos automáticos
                info_route = {
                    "endpoint": rule.endpoint,  # sin llaves para no crear set
                    "methods": methods,
                    "example": f"{REACT_APP_API_URL}{rule.rule}"
                }
                routes.append(info_route)
        return jsonify({"response": "Drug viewer API", "routes": routes}), 200


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
