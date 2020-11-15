from flask import Flask,json, request, render_template
from elasticsearch import Elasticsearch
from elasticsearch_dsl import Search, Q
from elasticsearch_dsl.connections import connections



#es = Elasticsearch(['https://yvwwd7r6g7:lue555jb9h@quchempedia-9079321169.eu-central-1.bonsaisearch.net:433'])
#Connexion au client Elasticsearch
client = Elasticsearch('https://yvwwd7r6g7:lue555jb9h@quchempedia-9079321169.eu-central-1.bonsaisearch.net')

app = Flask(__name__)


#Route pour la recherche de molécule
@app.route('/API/recherche')
def recherche():
    query = request.args.get('q')
    type = request.args.get('type')
    liste = []


    s = Search(using=client, index="molecules", doc_type="molecule")
    s = s.query({"regexp":{"molecule.formula":'[a-zA-Z0-9]*'+query+'[a-zA-Z0-9]*'}})
    #s = s.query('regexp',formula='[a-z0-9]'+query+'[a-z0-9]*')

    for molecules in s.execute():
        dict = {
            "id":molecules.meta.id,
            "formule":molecules.molecule.formula,
            "inchi":molecules.molecule.inchi,
            "nb_heavy_atoms":molecules.molecule.nb_heavy_atoms,
            "charge":molecules.molecule.charge,
            "total_molecular_energy":molecules.results.wavefunction.total_molecular_energy,
            "multiplicity":molecules.molecule.multiplicity,
        }
        liste.append(dict)

    response = app.response_class(
        response=json.dumps(liste,indent=4),
        mimetype='application/json'
    )
    return response

#Route pour le détail d'une molécule
@app.route('/API/detail')
def detail():
    identifiant = request.args.get('id')
    s = Search(using=client, index="molecules", doc_type="molecule")
    s = s.query({"match":{"_id":identifiant}})
    #s = s.query('match',id=identifiant)
    mol = s.execute()[0].to_dict()
    response = app.response_class(
        response=json.dumps(mol,indent=4),
        mimetype='application/json'
    )
    return response


