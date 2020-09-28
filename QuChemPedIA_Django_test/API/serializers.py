from testRest.models import Molecule
from rest_framework_elasticsearch.es_serializer import ElasticModelSerializer

class MoleculeSerializers(ElasticModelSerializer):
    formule = serializers.CharField(max_length=200)
    inchi = serializers.CharField(max_length=200)
    nb_heavy_atoms = serializers.CharField(max_length=200)
    charge = serializers.CharField(max_length=200)
