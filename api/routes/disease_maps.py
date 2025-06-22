from flask import Blueprint, jsonify
from services.disease_maps_service import (
    get_all_disease_maps,
    get_disease_map
)
disease_maps_api = Blueprint("disease_maps_api", __name__)

@disease_maps_api.route("/diseases-maps", methods=["GET"])
def disease_maps():
    try:
        data = get_all_disease_maps()
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    


@disease_maps_api.route("/diseases-maps/<disease_map_id>", methods=["GET"])
def disease_map(disease_map_id):
    try:
        data = get_disease_map(disease_map_id)
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500    