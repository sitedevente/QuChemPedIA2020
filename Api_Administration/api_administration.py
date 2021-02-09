import os
import shutil
import json

import flask
from flask import Flask, jsonify, request

import elasticsearch
from elasticsearch import Elasticsearch

import elasticsearch.exceptions

from elasticsearch_dsl import Search, Q
from elasticsearch_dsl.connections import connections

# Define root path for log files
root_path_log_files = '/mnt/data_dir/'


app = Flask(__name__)

app.config.from_pyfile(os.path.join(".", "config/app.conf"), silent=False)

# Connexion au client Elasticsearch
elasticClient = Elasticsearch(app.config.get("ES_URL"))



@app.errorhandler(404)
def resource_not_found(e):
    """ Error 404 handler. """
    return jsonify({'error': 'Wrong url, resource not found!'}), 404



@app.route('/api/search/<formula>', methods=['GET'])
def search_molecule(formula):
    """ Route to search a molecule with its formula in Elasticsearch. """
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


 
@app.route('/api/details/<id_mol>', methods=['GET'])
def details_molecule(id_mol):
    """ Route to retrieve a molecule with its ID in Elasticsearch. """
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



@app.route('/api/add', methods=['POST'])
def add_molecule():
    """ Route to add a new molecule in Elasticsearch. """
    # Define the files given in the POST request.
    files = request.files

    # Check if the Json is given in the POST request.
    if 'mol_json' not in files:
        # Return the error message, e.g. status code = 400.
        return jsonify(
            {'error': 'You must provide a body for the molecule!'}), 400

    body = files["mol_json"].read().decode("utf-8")

    # Check if the log file is absent from the POST request.
    if 'mol_log' not in files:
        body_json = json.loads(body)

        # Reverse split on the right Json line in order
        # to get the source path and the file name.
        log_file_path = body_json['metadata']['log_file'].rsplit("/", 1)

        # Generate the modified Json with the new path.
        body_json['metadata']['log_file'] = log_file_path[1]
        body = json.dumps(body_json)

    # Try the INDEX request on the Elasticsearch client.
    # index and doc_type are specific at the molecules documents.
    results = elasticClient.index(
        index='molecules', doc_type='molecule', body=body)

    # Check if the log file is absent from the POST request.
    try:
        if 'mol_log' in files:
            # Define the log file name and data from the POST request.
            log_file_data = files["mol_log"].read().decode("utf-8")
            log_file_name = files["mol_log"].filename

            # Call the function for the log file creation with log file.
            add_log_file_from_param(results["_id"],
                                    log_file_name, log_file_data)
        else:
            # Call the function for the log file creation with log file source
            # path.
            add_log_file_from_json(results["_id"], log_file_path)
    except Exception as err:
        # If an error is raised, we delete the molecule and print the error
        # message, e.g. status code 500.
        elasticClient.delete(
            index='molecules', doc_type='molecule', id=results["_id"])
        return jsonify(
            {'error': 'An error occured during the log file creation! ## ' + str(err)}), 500

    # Return the results formatted in Json, e.g. status code = 201.
    return jsonify(results), 201



@app.route('/api/delete/<id_mol>', methods=['DELETE'])
def delete_molecule(id_mol):
    """ Route to delete a molecule with its ID in Elasticsearch. """
    try:
        # Try the GET request on the Elasticsearch client.
        # index and doc_type are specific at the molecules documents.
        results = elasticClient.get(
            index='molecules', doc_type='molecule', id=id_mol)

        log_file_name = results['_source']['metadata']['log_file']

        # Try the DELETE request on the Elasticsearch client.
        # index and doc_type are specific at the molecules documents.
        results = elasticClient.delete(
            index='molecules', doc_type='molecule', id=id_mol)

        # Call the function to delete the molecule log file.
        delete_log_file(id_mol, log_file_name)

        # Return the results formatted in Json, e.g. status code = 200.
        return jsonify(results), 200
    except elasticsearch.exceptions.NotFoundError:
        # Return the error message, e.g. status code = 404.
        return jsonify({'error': 'Molecule with id = \'' +
                        id_mol + '\' does not exists!'}), 404



def add_log_file_from_param(id_mol, log_file_name, log_file_data):
    """ Function for the creation of the log file when a new molecule is added
    to the database and when the log file is given in the POST request. """
    # Define the root path for log files.
    log_path = ''

    # Parse the molecule id and define the path of the log file.
    for char in id_mol:
        log_path += char
        log_path += '/'

    path = root_path_log_files + log_path

    # Create directories for the log file.
    os.makedirs(path)

    # Create the log file with the data.
    try:
        log_file = open(path + log_file_name, "x")
        for line in log_file_data:
            log_file.write(line)
    except OSError as err:
        # Delete the path created just before and raise an error if
        # the file creation failed.
        delete_empty_path(path)
        raise err



def add_log_file_from_json(id_mol, log_file_src):
    """ Function for the creation of the log file when a new molecule is added
    to the database and when the log file is not given in the POST request. """
    # Define the root path for log files.
    log_path = ''

    # Parse the molecule id and define the path of the log file.
    for char in id_mol:
        log_path += char
        log_path += '/'

    path = root_path_log_files + log_path

    # Create directories for the log file.
    os.makedirs(path)

    # Create the log file.
    try:
        log_file = open(path + log_file_src[1], "x")
        shutil.copyfile(
            log_file_src[0] +
            '/' +
            log_file_src[1],
            path +
            log_file_src[1])
    except OSError as err:
        # Delete the file and path created just before and raise an error if
        # the file creation or the file copy failed.
        os.remove(path + log_file_src[1])
        delete_empty_path(path)
        raise err



def delete_log_file(id_mol, log_file_name):
    """ Function for the suppression of the log file when a molecule
    is deleted from the database. """
    # Define the root path for log files.
    log_path = ''

    # Parse the molecule id and define the path of the log file.
    for char in id_mol:
        log_path += char
        log_path += '/'

    path = root_path_log_files + log_path
    log_file_path = path + log_file_name

    # Delete the existing log file and empty directories.
    if os.path.exists(log_file_path):
        os.remove(log_file_path)
        delete_empty_path(path[:-1])



def delete_empty_path(path):
    """ Function for the suppresion of empty folders. """
    # Delete the directory if is empty and call the function recursively.
    if len(os.listdir(path)) == 0:
        print(path)
        os.rmdir(path)
        delete_empty_path(path[:-2])

if __name__ == "__main__":
    app.run(host='0.0.0.0')
