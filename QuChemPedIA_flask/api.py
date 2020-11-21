from flask import Flask, json, request, render_template, jsonify
from elasticsearch import Elasticsearch
from elasticsearch_dsl import Search, Q
from elasticsearch_dsl.connections import connections
import werkzeug

#es = Elasticsearch(['https://yvwwd7r6g7:lue555jb9h@quchempedia-9079321169.eu-central-1.bonsaisearch.net:433'])
# Connexion au client Elasticsearch
client = Elasticsearch(
    'https://yvwwd7r6g7:lue555jb9h@quchempedia-9079321169.eu-central-1.bonsaisearch.net')

app = Flask(__name__)


#  Route to look for a molecule with its formula and its name in Elasticsearch.
@app.route('/API/recherche/<type>/<name>')
def recherche(type, name):

    # Check if a type and a name were provided in the URL
    # If it's the case , assign them to the variables type and name
    # if not , deisplay an error

    if(not (type and type.strip()) or not (name and name.strip())):

        # Display the error message. status code = 404.
        return jsonify(
            {'Error': 'Something is missing please check your URL'}), 404
    else:
        type = type
        name = name
        s = Search(using=client, index="molecules", doc_type="molecule")

    if type == "formula":

        # Check if the name provided contains special characters
        # if it's the case ,replace them and create a normal query
        # if not create a query using regular expression
        if name.find('*') != -1 or name.find('_') != -1:
            name = name.replace("*", "[1-9]+")
            name = name.replace("_", "[a-zA-Z1-9]*")
            s = s.query({"regexp": {"molecule.formula": name}})

        else:
            s = s.query(
                {"regexp": {"molecule.formula": '[a-zA-Z0-9]*' + name + '[a-zA-Z0-9]*'}})
    else:
        s = s.query({"match_phrase": {"molecule." + type: name}})

    liste = []
    data = {}

    # Check if the molecule with the the provided name and type exists
    # If it's the case , return the results converted to Json format for later use
    # if not , deisplay an error

    mol = s.execute()
    if mol.hits.total.value <= 0:

        # Display the error message. status code = 404.
        return jsonify({'Error': 'Molecule does not exist'}), 404

    # Execute the query then loop through the result to get only what we need
    for molecules in s.execute():
        dict = {
            "id": molecules.meta.id,
            "formula": molecules.molecule.formula,
            "inchi": molecules.molecule.inchi,
            "smi": molecules.molecule.smi,
            "nb_heavy_atoms": molecules.molecule.nb_heavy_atoms,
            "charge": molecules.molecule.charge,
            "total_molecular_energy": molecules.results.wavefunction.total_molecular_energy,
            "multiplicity": molecules.molecule.multiplicity,
        }
        liste.append(dict)
    liste = sorted(liste, key=lambda x: len(x[type]))
    data["data"] = liste
    response = app.response_class(
        response=json.dumps(data, indent=4),
        mimetype='application/json'
    )
    return response, 200

# Route to retrieve a molecule with its ID in Elasticsearch.


@app.route('/API/detail/<id>')
def detail(id):

    # Check if an id was provided in the URL
    # If it's the case , assign it to the variable identifiant
    # if not , display an error
    if(not (id and not id.isspace())):

        # Display the error message. status code = 404.
        return jsonify({'Error': 'Please specify an id '}), 404
    else:
        identifiant = id

    # Check if a moleculde with the id provided exists
    # If it's the case ,  return the results converted into the Json format for later use
    # if not ,  throw an exception

    try:
        #
        s = Search(using=client, index="molecules", doc_type="molecule")

        # Create the query
        s = s.query('match', _id=identifiant)

        # Execute the query to get the data we need
        mol = s.execute()[0].to_dict()
        response = app.response_class(
            response=json.dumps(mol, indent=4),
            mimetype='application/json'
        )

        # Return a dictionary converted into Json format. status code = 200.
        return response, 200
    except Exception as e:

        # Return an error message. status code = 404.
        return jsonify({'Error': 'Molecule with id = \'' +
                        identifiant + '\' does not exists!'}), 404


# Error 404 handler.
@app.errorhandler(werkzeug.exceptions.NotFound)
def not_found(e):
    """ Page not found."""
    return jsonify({'Error': 'Resource not found please check your url!'}), 404

# Error 400 handler.
@app.errorhandler(werkzeug.exceptions.BadRequest)
def bad_request():
    """ Bad request. """
    return jsonify(
        {'Error': 'Sorry, the server cannot handle your request'}), 400

# Error 500 handler.
@app.errorhandler(werkzeug.exceptions.InternalServerError)
def server_error():
    """ Internal server error. """
    return jsonify({'Error': 'Sorry , an internal server error occurred'}), 500
