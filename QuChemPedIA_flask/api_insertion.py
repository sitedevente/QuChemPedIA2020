import flask
from flask import Flask, jsonify, request
from elasticsearch import Elasticsearch
from elasticsearch_dsl import Search, Q
from elasticsearch_dsl.connections import connections


#Connexion au client Elasticsearch
elasticClient = Elasticsearch('https://yvwwd7r6g7:lue555jb9h@quchempedia-9079321169.eu-central-1.bonsaisearch.net')

app = Flask(__name__)

# Route pour la recherche par formule
@app.route('/api/search/<formula>', methods=['GET'])
def search_molecule(formula):

	body = {
        "query": {
            "match_phrase": {
                "molecule.formula": formula
            }
        }
    }

	results = elasticClient.search(index='molecules', doc_type='molecule', body=body)
	return jsonify(results['hits']['hits'])


# Route pour retrouver une molécule avec son ID
@app.route('/api/details/<id_mol>', methods=['GET'])
def details_molecule(id_mol):

	results = elasticClient.get(index='molecules', doc_type='molecule', id=id_mol)
	return jsonify(results)


# Route pour l'ajout d'une molécule
@app.route('/api/add', methods=['POST'])
def add_molecule():

	body = request.json

	results = elasticClient.index(index='molecules', doc_type='molecule', body=body)
	return jsonify(results)


#Route pour la suppression d'une molécule
@app.route('/api/delete/<id_mol>', methods=['DELETE'])
def delete_molecule(id_mol):

	results = elasticClient.delete(index='molecules', doc_type='molecule', id=id_mol)
	return jsonify(results)


