# Projet QuChemPedia avec Flask

## Préambule

Ce projet ainsi que le tutoriel qui suit a été réalisé avec la version 3.6.9 de Python.
Pour vérifier la version de votre client Python, lancez la commande :

    python3 --version
    Python 3.6.9


## Mise en place du projet en développement

### Création de environnement virtuel et installation du projet
Après avoir cloner le projet Git, rendez vous dans le dossier du projet et créez un nouvel environnement virtuel Python.
```
python3 -m venv quchempedia-env
```

Puis activez ce nouvel environnement en lançant la commande :
```
source env/bin/activate
```


Normalement le command prompt de votre ligne de commande change pour vous afficher l'environnement virtuel que vous utilisez. Il ne vous reste plus qu'a installer les prérequis pour l'application, contenus dans le fichier requirement.txt. Pour cela, lancez la commande :
```
python3 -m pip install -r requirement.txt
```

### Modification des variables d'environnement
Ensuite, il faut modifier certaines variables afin de pouvoir démarrer notre projet en localhost.

Web/js/details.js :

```
API_URL = http://127.0.0.1:5000/
```

Web/js/ajax_request.js :

```
API_URL = http://127.0.0.1:5000/
BASE_URL =  http://127.0.0.1/
```

Api_Consultation/conf/app.conf :

```
ES_URL = "base_elasticsearch:port"
```

Api_Administration/conf/app.conf :

```
ES_URL = "base_elasticsearch:port"
```

Puis exécuter le script > ```deploy.sh``` afin de placer la partie Web dans le serveur localhost d'Apache :

```
./deploy.sh
```

Après avoir fait cela, il faut lancer l'Api de Consultation afin de pouvoir faire des recherches dans la base de données ElasticSearch.
Api_Consultation/ :

```
export FLASK_ENV = development
python3 wsgi.py
```

Si le serveur a bien été lancé, on devrait obtenir ceci :
```
* Serving Flask app "api_administration" (lazy loading)
* Environment: development
* Debug mode: on
* Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)
* Restarting with stat
* Debugger is active!
* Debugger PIN: 174-238-432
```

### Déploiement des pages statiques sur le serveur local Apache
Puis exécuter le script > ```deploy.sh``` afin de placer la partie Web dans le serveur localhost d'Apache :

```
./deploy.sh
```

Le site est donc accessible via :
```
http://127.0.0.1/Web
```

## Génération et accès à la documentation du code

Afin de générer la documentation du code, il faut effectuer la commande suivante à la racine du projet : 

    ./generateDoc.sh

Vous trouverez toute la documentation générée dans le dossier Documentation puis dans les dossiers JSDoc pour les fichiers JavaScript et pyDoc pour les fichiers python.


