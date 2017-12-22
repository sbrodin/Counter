###################
Application Counter
###################

`Counter <https://counter.stanislas-brodin.fr>`_ est une application de compteur.
Il est possible de créer des compteurs, d'en supprimer, de les personnaliser (nom, couleur)
et, évidemment, de les incrémenter et décrémenter.
Un historique des modifications est également en place, afin de permettre d'obtenir des
statistiques concernant les différents compteurs en place.

*******************
Server Requirements
*******************

PHP version 5.3 ou plus récent est recommandé.

************
Installation
************

Copiez tous les fichiers.
Ensuite copiez le fichier _connexion_data.php vers connexion_data.php.
Changez la configuration du fichier connexion_data.php pour correspondre
à la configuration de votre serveur et à votre base de données.
Créez un répertoire "user" à la racine.
Demandez une structure de base à cette adresse :
`stanislas.brodin@gmail.com <mailto:stanislas.brodin@gmail.com>`_
en précisant qu'il s'agit de l'application Counter.

*******
License
*******

Please see the `license agreement <https://github.com/sbrodin/Counter/blob/master/license.txt>`_.

**********
Ressources
**********

Cette application a été développée en utilisant les technologies suivantes :
    - PHP 5.3
    - HTML 5
    - CSS 3
    - MySQL 5.5
    - Vanilla JS

****
TODO
****

Liste des éléments restants à faire :
    - Stats d'un compteur
        - Récupération
        - Affichage (chartjs)
    - Affichage des messages d'erreur et de succès
    - Affichage sur smartphone
    - Ajouter un "form" pour gérer le "submit" de changement de nom de compteur
    - Edition du compteur
        - Changement de couleur d'écriture ?
