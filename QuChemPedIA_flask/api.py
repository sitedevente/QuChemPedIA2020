from flask import Flask, json, request,render_template,jsonify
from elasticsearch import Elasticsearch
from elasticsearch_dsl import Search, Q
from elasticsearch_dsl.connections import connections
import werkzeug

#es = Elasticsearch(['https://yvwwd7r6g7:lue555jb9h@quchempedia-9079321169.eu-central-1.bonsaisearch.net:433'])
# Connexion au client Elasticsearch
client = Elasticsearch(
    'https://yvwwd7r6g7:lue555jb9h@quchempedia-9079321169.eu-central-1.bonsaisearch.net')

app = Flask(__name__)


# Route pour la recherche de molécule
@app.route('/API/recherche/<type>/<name>')
def recherche(type,name):

    if(not (type and type.strip()) or not (name and name.strip())):
        return jsonify({'Error': 'Something is missing please check your URL'}),404
        # return ""+query
    else:
        type  = type
        query = name
        s = Search(using = client, index = "molecules", doc_type = "molecule")

    if type == "formula" :
        if query.find('*') != -1 or query.find('_') != -1:

            query = query.replace("*", "[1-9]+")
            query = query.replace("_", "[a-zA-Z1-9]*")
            s     = s.query({"regexp": {"molecule.formula": query}})

        else:
            s = s.query( {"regexp": {"molecule.formula": '[a-zA-Z0-9]*' + query + '[a-zA-Z0-9]*'}})
        #query = query.replace("?","[1-9]+")
    else :
        s = s.query({"match_phrase": {"molecule."+type: query}})

    liste = []

    #s = s.query('regexp',formula='[a-z0-9]'+query+'[a-z0-9]*')
    mol = s.execute()
    if mol.hits.total.value <= 0:
        return jsonify({'Error': 'Molecule does not exist'}), 404
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
    response = app.response_class(
        response = json.dumps(liste, indent=4),
        mimetype = 'application/json'
    )
    return response,200

    # Route pour le détail d'une molécule


@app.route('/API/detail/<id>')
def detail(id):


    if(not (id and not id.isspace())):
        return jsonify({'Error': 'Please specify an id '}),404
    else:
        identifiant = id

    try:
        s   = Search(using = client, index = "molecules", doc_type = "molecule")
        s   = s.query('match', _id=identifiant)
        mol = s.execute()[0].to_dict()
        response = app.response_class(
            response = json.dumps(mol, indent=4),
            mimetype = 'application/json'
        )

        return response ,200
    except Exception as e:
        return jsonify({'Error': 'Molecule with id = \'' + identifiant + '\' does not exists!'}),404



@app.errorhandler(werkzeug.exceptions.NotFound)
def not_found(e):
    # Page not found.
    return jsonify({'Error': 'Resource not found please check your url!'}), 404

@app.errorhandler(werkzeug.exceptions.BadRequest)
def bad_request():
    # Bad request
    return jsonify({'Error': 'Sorry, the server cannot handle your request'}), 400


@app.errorhandler(werkzeug.exceptions.InternalServerError)
def server_error():
    # Internal server error
    return jsonify({'Error': 'Sorry , an internal server error occurred'}), 500
