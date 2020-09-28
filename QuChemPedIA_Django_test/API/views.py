from django.shortcuts import render
from django.http import HttpResponse
from API.documents import PostDocument,PostDocumentLong
import json
from django.core import serializers
from django.http import JsonResponse
import uuid
from elasticsearch import Elasticsearch, exceptions
# Create your views here.

headers = {
    "Content-Type": "application/json"
}

def index(request):
    return HttpResponse("Hello, world. You're at the polls index.")


## API de recherche
def search(request):
    type =request.GET.get('type')
    q = request.GET.get('q')
    liste = []
    if type=='formule':
        ## requete sur la base elasticsearch
        posts2 = PostDocumentLong.search().query({"regexp":{"molecule.formula":'[a-zA-Z0-9]*'+q+'[a-zA-Z0-9]*'}})


        for molecules in posts2:
            job_type = json.dumps(list(molecules.comp_details.general.job_type))
            list_theory = json.dumps(list(molecules.comp_details.general.list_theory))
            if(hasattr(molecules.comp_details.general,'basis_set_name')):
                basis_set_name=molecules.comp_details.general.basis_set_name
            else:
                basis_set_name="Pas de nom"

            if(hasattr(molecules.comp_details.general,'solvent')):
                solvent=molecules.comp_details.general.solvent
            else:
                solvent="Pas de solvent"
            dict = {
                "id":molecules.meta.id,
                "formule":molecules.molecule.formula,
                "inchi":molecules.molecule.inchi,
                "nb_heavy_atoms":molecules.molecule.nb_heavy_atoms,
                "charge":molecules.molecule.charge,
                "total_molecular_energy":molecules.results.wavefunction.total_molecular_energy,
                "basis_set_name":basis_set_name,
                "job_type":job_type,
                "multiplicity":molecules.molecule.multiplicity,
                "list_theory":list_theory,
                "solvent":solvent,
            }
            liste.append(dict)
        liste = json.dumps(liste,indent=4)
    elif type=='inchi':
        posts2 = PostDocumentLong.search().query({"regexp":{"molecule.inchi":'[a-z0-9]*'+q+'[a-z0-9]*'}})


        for molecules in posts2:
            job_type = json.dumps(list(molecules.comp_details.general.job_type))
            list_theory = json.dumps(list(molecules.comp_details.general.list_theory))
            solvent = molecules.comp_details.general.solvent
            if(hasattr(molecules.comp_details.general,'basis_set_name')):
                basis_set_name=molecules.comp_details.general.basis_set_name
            else:
                basis_set_name="Pas de nom"
            dict = {
                "id":molecules.meta.id,
                "formule":molecules.molecule.formula,
                "inchi":molecules.molecule.inchi,
                "nb_heavy_atoms":molecules.molecule.nb_heavy_atoms,
                "charge":molecules.molecule.charge,
                "total_molecular_energy":molecules.results.wavefunction.total_molecular_energy,
                "basis_set_name":basis_set_name,
                "job_type":job_type,
                "multiplicity":molecules.molecule.multiplicity,
                "list_theory":list_theory,
                "solvent":solvent,
            }
            liste.append(dict)
    else:
        posts = ''
    return HttpResponse(liste, content_type='application/json')


def detail(request):
    id = request.GET.get('id')

    if id:
        posts = PostDocument.search().query("match",_id=id)

    else:
        posts = ''



    lol = {}
    return HttpResponse(lol, content_type='application/json')
