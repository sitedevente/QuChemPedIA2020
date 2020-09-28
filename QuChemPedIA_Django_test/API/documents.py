from django_elasticsearch_dsl import Document, Index
from API.models import Molecule,MoleculeLong


posts = Index('molecules')


@posts.doc_type
class PostDocument(Document):
    class Django:
        model = Molecule

        fields = [
            'formule',
            'inchi',
            'nb_heavy_atoms',
            'charge',
        ]

@posts.doc_type
class PostDocumentLong(Document):
    class Django:
        model = MoleculeLong

        fields = [
            'formula',
            'inchi',
            'nb_heavy_atoms',
            'charge',
            'total_molecular_energy',
            'basis_set_name',
        ]
