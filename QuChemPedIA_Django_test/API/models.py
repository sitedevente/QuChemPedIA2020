from django.db import models

# Create your models here.
class Molecule(models.Model):
    formule = models.CharField(max_length=50,default='')
    inchi = models.CharField(max_length=50,default='')
    nb_heavy_atoms = models.CharField(max_length=50,default='')
    charge = models.CharField(max_length=50,default='')

class MoleculeLong(models.Model):
    formula = models.CharField(max_length=50,default='')
    inchi = models.CharField(max_length=50,default='')
    nb_heavy_atoms = models.CharField(max_length=50,default='')
    charge = models.CharField(max_length=50,default='')
    total_molecular_energy = models.CharField(max_length=50,default='')
    basis_set_name = models.CharField(max_length=50,default='')
