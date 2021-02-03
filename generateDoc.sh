#!/bin/sh

# Generation de la documentation JS #
cd ./QuChemPedIA/js/
./generateDocJS.sh
cd ../..

# Generation de la documentation de l'api d'administration #
cd ./Api_Administration
./generateDocPY.sh

# Generation de la documentation de l'api de consultation #
cd ../Api_Consultation
./generateDocPY.sh

# La documentation se situe maintenant dans le dossier Documentation#