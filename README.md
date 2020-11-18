# Projet QuChemPedia avec Flask

## Création de environnement virtuel et installation du projet

Après avoir cloner le projet Git, rendez vous dans le dossier du projet et créez un nouvel environnement virtuel Python.

    python3 -m venv quchempedia-env

Puis activez ce nouvel environnement en lançant la commande :

    source env/bin/activate 

Normalement le command prompt de votre ligne de commande change pour vous afficher l'environnement virtuel que vous utilisez.
Il ne vous reste plus qu'a installer les prérequis pour l'application, contenus dans le fichier requirement.txt. Pour cela, lancez la commande :

    python3 -m pip install -r requirement.txt


## Installation
Une fois l'environnement virtuel créé et les dépendances installées, il faut exporter la variable d'environnement FLASK_APP, afin d'indiquer à Flask où se trouve l'application. 
Ici, l'application s'appelle api_administration :

    export FLASK_APP=api_administration

Et enfin définir que l'on va lancer le serveur en mode développement :

    export FLASK_ENV=development


## Lancement du serveur
Pour démarrer le serveur, il suffit tout simplement d'exécuter cette commande :

    flask run


Si le serveur a bien été lancé, on devrait obtenir ceci :

    
     * Serving Flask app "api_administration" (lazy loading)
     * Environment: development
     * Debug mode: on
     * Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)
     * Restarting with stat
     * Debugger is active!
     * Debugger PIN: 174-238-432
