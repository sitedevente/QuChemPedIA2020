from elasticsearch_dsl import Document

class MoleculeIndex(Document):
    pk = Integer()
    formule = Text()
    inchi = Text()
    nb_heavy_atoms = Text()
    charge = Text()

    class Meta:
        index='molecules'
