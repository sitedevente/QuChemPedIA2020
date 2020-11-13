import os

import flask
from flask import Flask, jsonify, request

import elasticsearch
from elasticsearch import Elasticsearch

import elasticsearch.exceptions

from elasticsearch_dsl import Search, Q
from elasticsearch_dsl.connections import connections


# Elasticsearch client connection
elasticClient = Elasticsearch(
    'https://yvwwd7r6g7:lue555jb9h@quchempedia-9079321169.eu-central-1.bonsaisearch.net')

app = Flask(__name__)


# Error 404 handler.
@app.errorhandler(404)
def resource_not_found(e):
    return jsonify({'error': 'Wrong url, resource not found!'}), 404


#  Route to search a molecule with its formula in Elasticsearch.
@app.route('/api/search/<formula>', methods=['GET'])
def search_molecule(formula):

    # Define the body for the request on the Elasticsearch client.
    body = {
        "query": {
            "match_phrase": {
                "molecule.formula": formula
            }
        }
    }

    # Try the GET request on the Elasticsearch client.
    # index is specific at the molecules documents.
    results = elasticClient.search(index='molecules', body=body)

    # Return the results formatted in Json, e.g. status code = 200.
    return jsonify(results['hits']['hits']), 200


# Route to retrieve a molecule with its ID in Elasticsearch.
@app.route('/api/details/<id_mol>', methods=['GET'])
def details_molecule(id_mol):

    try:
        # Try the GET request on the Elasticsearch client.
        # index and doc_type are specific at the molecules documents.
        results = elasticClient.get(
            index='molecules', doc_type='molecule', id=id_mol)

        # Return the results formatted in Json, e.g. status code = 200.
        return jsonify(results), 200
    except elasticsearch.exceptions.NotFoundError:
        # Return the error message, e.g. status code = 404.
        return jsonify({'error': 'Molecule with id = \'' +
                        id_mol + '\' does not exists!'}), 404


# Route to add a new molecule in Elasticsearch.
@app.route('/api/add', methods=['POST'])
def add_molecule():

    # Define the body with the Json contained in the POST request.
    body = request.json

    if (body is None):
        # Return the error message, e.g. status code = 400.
        return jsonify(
            {'error': 'You must provide a body for the molecule!'}), 400

    # Try the INDEX request on the Elasticsearch client.
    # index and doc_type are specific at the molecules documents.
    results = elasticClient.index(
        index='molecules', doc_type='molecule', body=body)

    # Call the function for the log file creation
    add_log_file(results["_id"])

    # Return the results formatted in Json, e.g. status code = 201.
    return jsonify(results), 201


# Route to delete a molecule with its ID in Elasticsearch.
@app.route('/api/delete/<id_mol>', methods=['DELETE'])
def delete_molecule(id_mol):

    try:
        # Try the DELETE request on the Elasticsearch client.
        # index and doc_type are specific at the molecules documents.
        results = elasticClient.delete(
            index='molecules', doc_type='molecule', id=id_mol)

        # Call the function to delete the molecule log file.
        delete_log_file(id_mol)

        # Return the results formatted in Json, e.g. status code = 200.
        return jsonify(results), 200
    except elasticsearch.exceptions.NotFoundError:
        # Return the error message, e.g. status code = 404.
        return jsonify({'error': 'Molecule with id = \'' +
                        id_mol + '\' does not exists!'}), 404


# Function for the creation of the log file when a new molecule
# is added to the database.
def add_log_file(id_mol):

    # Define the root path for log files.
    root_path = 'data_dir/'
    log_path = ''

    # Parse the molecule id and define the path of the log file.
    for char in id_mol:
        log_path += char
        log_path += '/'

    root_path += log_path

    # Create directories for the log file.
    os.makedirs(root_path)

    # Create the log file.
    log_file = open(root_path + "data.log", "x")
    log_file.write(id_mol)


# Function for the suppression of the log file when a molecule
# is deleted from the database.
def delete_log_file(id_mol):

    # Define the root path for log files.
    root_path = 'data_dir/'
    log_path = ''

    # Parse the molecule id and define the path of the log file.
    for char in id_mol:
        log_path += char
        log_path += '/'

    root_path += log_path
    log_file_path = root_path + 'data.log'

    # Delete the existing log file and empty directories.
    if os.path.exists(log_file_path):
        os.remove(log_file_path)
        delete_empty_path(root_path[:-1])


# Function for the suppresion of empty folders.
def delete_empty_path(path):

    # Delete the directory if is empty and call the function recursively.
    if len(os.listdir(path)) == 0:
        os.rmdir(path)
        delete_empty_path(path[:-2])
