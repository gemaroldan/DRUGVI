from flask import Blueprint, jsonify, request
from services.pathways_service import (
    get_all_pathways,
    get_n_pathways,
    get_effector_genes,
    get_patwhay_effector_gene,
    get_ini_effector_gene,
    get_patwhay_ini_effector_gene,
    get_node_detail,
    get_node_detail_drug
)
from services.service import merge_graph_responses
pathways_api = Blueprint("pathways_api", __name__)

@pathways_api.route("/pathways", methods=["GET"])
def pathways_maps():
    """Get all pathways"""
    try:
        data = get_all_pathways()
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@pathways_api.route("/pathways/<pathway_id>", methods=["GET"])
def pathway(pathway_id):
    """ Get all nodes from one pathway"""
    try:
        data = get_n_pathways(pathway_id)
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@pathways_api.route("/pathways/effectorGenes/<pathway_id>/list", methods=["GET"])
def effector_genes(pathway_id):
    """Get all effectors genes from one pathway"""
    try:
        data = get_effector_genes(pathway_id)
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@pathways_api.route("/pathways/effectorGenes/effectorGeneId/<effector_gene_id>", methods=["GET"])
def patwhay_effector_gene(effector_gene_id):
    """Get patwhay from effector genes from pathway"""
    try:
        data = get_patwhay_effector_gene(effector_gene_id)
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@pathways_api.route("/pathways/iniEffectorGenes/effectorGeneId/<effector_gene_id>/list", methods=["GET"])
def ini_effector_gene(effector_gene_id):
    """Get all initial effector genes from efector gene"""
    try:
        data = get_ini_effector_gene(effector_gene_id)
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@pathways_api.route("/pathways/effectorGenes/iniEffectorGeneId/<ini_effector_gene_id>/effectorGeneId/<effector_gene_id>", methods=["GET"])
def patwhay_ini_effector_gene(ini_effector_gene_id, effector_gene_id ) :
    """Get patwhay from effector genes to ini_effector_gene"""
    try:
        data = get_patwhay_ini_effector_gene(ini_effector_gene_id, effector_gene_id )
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@pathways_api.route("/pathways/nodes/detail/<npathway_id>", methods=["GET"])
def node_detail(npathway_id):
    """Get all info from one node pathway"""
    try:
        data_pathway = get_node_detail(npathway_id)
        data_drug = get_node_detail_drug(npathway_id)
        data = merge_graph_responses(data_pathway, data_drug )
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


