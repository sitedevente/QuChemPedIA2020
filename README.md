# Projet QuChemPedia avec Flask
## Installation
Tout d'abord, il faut installer toutes les dépendances du projet contenu dans le fichier requirement.txt :

    pip3 install requirement.txt

Après cela, il faut exporter la variable d'environnement FLASK_APP, afin d'indiquer à Flask où se trouve l'application. Ici, l'application s'appelle tout simplement api :

    export FLASK_APP=api

Et enfin définir que l'on va lancer le serveur en mode développement :

    export FLASK_ENV=development


## Lancement du serveur
Pour démarrer le serveur, il suffit tout simplement d'exécuter cette commande :

    flask run


Si le serveur a bien été lancé, on devrait obtenir ceci :

    
     * Serving Flask app "api" (lazy loading)
     * Environment: development
     * Debug mode: on
     * Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)
     * Restarting with stat
     * Debugger is active!
     * Debugger PIN: 174-238-432
