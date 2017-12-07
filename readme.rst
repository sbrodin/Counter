###################
Application Counter
###################

`Counter <http://counter.stanislas-brodin.fr>`_ est une application de compteur.
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
Demandez une structure de base à cette adresse :
`stanislas.brodin@gmail.com <mailto:stanislas.brodin@gmail.com>`_
en précisant qu'il s'agit de l'application Counter.

*******
License
*******

Please see the `license
agreement <https://github.com/bcit-ci/CodeIgniter/blob/develop/user_guide_src/source/license.rst>`_.

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
    - Ajouter le cas du changement de nom du compteur
    - Ajouter le cas du changement de couleur du compteur
    - Ajouter l'enregistrement de la modification du compteur dans l'historique