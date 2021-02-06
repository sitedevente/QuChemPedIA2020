from flask_cors import CORS
from flask import Flask, json, request, render_template, jsonify
from elasticsearch import Elasticsearch
from elasticsearch_dsl import Search, Q
from elasticsearch_dsl.connections import connections
import werkzeug
import os

try:
    from urllib.parse import unquote  # PY3
except ImportError:
    from urllib import unquote  # PY2

app = Flask(__name__)
CORS(app)

app.config.from_pyfile(os.path.join(".", "config/app.conf"), silent=False)

# Connexion au client Elasticsearch
client = Elasticsearch(app.config.get("ES_URL"))

#  Route to look for a molecule with its formula and its name in Elasticsearch.

@app.route('/api/search')
def search():
    """Route to look for a molecule with its formula and its name in Elasticsearch."""
    # Check if a type , name ,page number and results number were provided in the URL
    # If it's the case , assign them to the variables type and name
    # if not , display an error

    if('q' in request.args and request.args.get('q').strip() and
        'type' in request.args and request.args.get('type').strip() and
            'page' in request.args and 'showresult' in request.args):

        # Display the error message. status code = 404.
        name = request.args.get('q')
        type = request.args.get('type')
        try:
            page = int(request.args.get('page'))
            result = int(request.args.get('showresult'))
            s = Search(using=client, index="molecules", doc_type="molecule")
        except Exception as e:
            return jsonify(
                {'Error': 'Something is wrong please check your URL'}), 404

    else:

        return jsonify(
            {'Error': 'Something is missing please check your URL'}), 404

    name = name.replace("/","\\/")
    name = name.replace("[","\\[")
    name = name.replace("]","\\]")
    if type == "formula":

        # Check if the name provided contains special characters
        # if it's the case ,replace them and create a normal query
        # if not create a query using regular expression

        if name.find('*') != -1 or name.find('_') != -1:
            name = name.lower()
            second_name = name.replace("*", "[1-9]+")
            second_name = second_name.replace("_", "[a-zA-Z1-9]*")
            name = name.replace("_", "")
            name = name.replace("*", "")
            s = s.query({
                "bool": {
                    "should": [
                        {
                            "match_phrase": {
                                "molecule.formula": {
                                    "query": name,
                                    "boost": 100
                                }
                            }
                        },
                        {
                            "query_string": {
                                "query": '/' + second_name + '/',
                                "default_field": "molecule.formula",
                                "boost": 10
                            }
                        }
                    ]
                }
            })
        else:
            s = s.query({
                "bool": {
                    "should": [
                        {
                            "match_phrase": {
                                "molecule.formula": {
                                    "query": name,
                                    "boost": 100
                                }
                            }
                        },
                        {
                            "query_string": {
                                "query": '*' + name + '*',
                                "default_field": "molecule.formula",
                                "boost": 10
                            }
                        }
                    ]
                }
            })

    else:
        s = s.query({
            "bool": {
                "should": [
                    {
                        "match_phrase": {
                            "molecule."+type: {
                                "query": name,
                                "boost": 100
                            }
                        }
                    },
                    {
                        "query_string": {
                            "query": '*' + name + '*',
                            "default_field": "molecule."+type,
                            "boost": 10
                        }
                    }
                ]
            }
        })

    mol = s.execute()

    # Check if the molecule with the the provided name and type exists
    # If it's the case , return the results converted to Json format for later use
    # if not , deisplay an error

    if mol.hits.total.value <= 0:

        # Display the error message. status code = 404.
        return jsonify({'Error': 'Molecule does not exist'}), 404

    first = result * (page - 1)
    if first >= mol.hits.total.value:
        return jsonify({'Error': 'Sorry there is no more molecule !!'}), 404
    if mol.hits.total.value < (first + result - 1):
        last = mol.hits.total.value
    else:
        last = first + result

    s = s[first:last]
    liste = []
    data = {}

    # Execute the query then loop through the result to get only what we need
    for molecules in s.execute():
        
        dict = {
            "id": molecules.meta.id,
            "formula": molecules.molecule.formula,
            "inchi": molecules.molecule.inchi,
            "smi": molecules.molecule.smi,
            "nb_heavy_atoms": molecules.molecule.nb_heavy_atoms,
            "charge": molecules.molecule.charge,
            "multiplicity": molecules.molecule.multiplicity,
        }

        if(hasattr(molecules.comp_details.general, 'basis_set_name')):
            basis_set_name = molecules.comp_details.general.basis_set_name
            dict["basis_set_name"] = basis_set_name

        if(hasattr(molecules.comp_details.general, 'job_type')):
            job_type = json.dumps(
                list(molecules.comp_details.general.job_type))
            dict["job_type"] = job_type

        if(hasattr(molecules.comp_details.general, 'solvent')):
            solvent = molecules.comp_details.general.solvent
            dict["solvent"] = solvent

        if(hasattr(molecules.comp_details.general, 'list_theory')):
            list_theory = json.dumps(
                list(molecules.comp_details.general.list_theory))
            dict["list_theory"] = list_theory

        if(hasattr(molecules.comp_details.general, 'total_molecular_energy')):
            total_molecular_energy = json.dumps(
                list(molecules.comp_details.general.total_molecular_energy))
            dict["total_molecular_energy"] = total_molecular_energy

        liste.append(dict)

    liste = sorted(liste, key=lambda x: len(x[type]))
    data["data"] = liste
    data["total"] = mol.hits.total.value
    response = app.response_class(
        response=json.dumps(data, indent=4),
        mimetype='application/json'
    )

    return response, 200


@app.route('/api/details/<id>')
def details(id):
    """ Route to retrieve a molecule with its ID in Elasticsearch."""

    # Check if an id was provided in the URL
    # If it's the case , assign it to the variable identifiant
    # if not , display an error

    if not(id and id.strip()):

        # Display the error message. status code = 404.
        return jsonify({'Error': 'Please specify an id'}), 404
    else:
        identifiant = id

    # Check if a moleculde with the id provided exists
    # If it's the case ,  return the results converted into the Json format for later use
    # if not ,  throw an exception

    try:
        #
        s = Search(using=client, index="molecules", doc_type="molecule")

        # Create the query
        s = s.query('match_phrase', _id=identifiant)

        # Execute the query to get the data we need
        mol = s.execute()["hits"].to_dict()

        if (mol["total"]["value"] > 0):
            result = {}
            result["id"] = mol["hits"][0]["_id"]
            result["data"] = mol["hits"][0]["_source"]
            response = app.response_class(
                response=json.dumps(result, indent=4),
                mimetype='application/json'
            )

            # Return a dict converted into Json format. status code = 200.
            return response, 200

        else:
            raise Exception

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

if __name__ == "__main__":
    app.run(host='0.0.0.0')
