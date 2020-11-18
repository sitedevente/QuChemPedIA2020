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
@app.route('/API/recherche')
def recherche():

    query = request.args.get('q')
    type  = request.args.get('type')
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
    return response

    # Route pour le détail d'une molécule


@app.route('/API/detail')
def detail():


    identifiant = request.args['id']


    s   = Search(using = client, index = "molecules", doc_type = "molecule")
    s   = s.query('match', _id=identifiant)
    mol = s.execute()[0].to_dict()

    response = app.response_class(
        response = json.dumps(mol, indent=4),
        mimetype = 'application/json'
    )

    return response
