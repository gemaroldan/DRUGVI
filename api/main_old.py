from flask import Flask, jsonify, request
from neo4j import GraphDatabase
import os
import logging

app = Flask(__name__)

# Configuración de Neo4j desde variables de entorno
NEO4J_URI = os.getenv("NEO4J_URI", "bolt://neo4j:7687")
NEO4J_USER = os.getenv("NEO4J_USER", "neo4j")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD", "password")

driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))

# Logger básico
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@app.route("/health", methods=["GET"])
def health_check():
    routes = []
    with app.test_request_context():
        for rule in app.url_map.iter_rules():
            methods = ','.join(rule.methods)
            routes.append(f"{rule.endpoint}: {rule.rule} [{methods}]")
    return jsonify({"status": "ok", "routes" : routes}), 200

@app.route("/query", methods=["POST"])
def run_query():
    data = request.get_json()
    cypher = data.get("cypher")
    if not cypher:
        return jsonify({"error": "No cypher query provided"}), 400

    try:
        with driver.session() as session:
            result = session.run(cypher)
            records = [record.data() for record in result]
        return jsonify({"results": records}), 200
    except Exception as e:
        logger.error(f"Error running query: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
