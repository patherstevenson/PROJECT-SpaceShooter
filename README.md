# Project SpaceShooter

## Sommaire :

* [1. Générer les fichiers](#1-générer-les-fichiers)
* [2. Lancer le jeu](#2-lancer-le-jeu)
* [3. Modifier le projet](#3-modifier-le-projet)
* [4. Etat du projet](#4-etat-du-projet)
* [5. Contraintes d'écriture du code](#5-contraintes-décriture-du-code)
* [6. Sujet du projet](#6-sujet-du-projet)

## 1. Générer les fichiers

Pour générer les fichiers nécessaire au lancement du jeu veuillez suivre les instructions suivantes dans cet ordre :

    - Cloner le projet en local grâce à git clone

    - Placez-vous à la racine du projet => dossier tp-starship

    - Utilisez la commande suivante pour installer les modules :
        
        $ npm install

    - Utilisez la commande suivante pour créer le dossier dist/ et construire le bundle

## 2. Lancer le jeu

Une fois les fichiers générés vous pouvez accéder au jeu en ouvrant le fichier dist/index.html sur votre navigateur web. Si tout s'est bien déroulé vous devriez voir en consultant la console (Ctrl+Shift+K) le message suivant : 

    "le bundle a été généré"

## 3. Modifier le projet

Pour toute modification du projet vous pouvez utiliser Webpack pour construire le bundle et visualiser vos ajouts et modifications en démarrant le serveur de développement grâce à la commande : 
    
    $ npm run dev-server

Toujours en étant à la racine du projet. Ainsi les modifications seront directement ajoutées après sauvegarde des fichiers concernés et seront visibles depuis le fichier dist/index.html. 

Sinon après modification vous pouvez simplement utiliser la commande : 

    $ npm run build
    
et voir les modifications. Mais cela est plus fastidieux.

N'oubliez pas d'exécuter la commande :

    $ npm run build
    
après l'arrêt du serveur de développement pour mettre à jour le dossier dist/.

## 4. Etat du projet

__vendredi 16 avril :__

    - Prise de connaissance du sujet et du travail demandé

    - Mise en place de la structure du projet

    - Code des classes Mobile, Starship et Game pour permettre l'affichage simple du vaisseau
    
__lundi 19 avril :__

    - Mise en place du script main.js pour créer le jeu et exécuter la fonction d'animation à l'ouverture de la page

    - Création d'une classe MoveState pour gérer les états de déplacements du joueur
    
    - Ajout des méthodes stopMoving, moveUp, moveDown et move à la classe Starship

    - Ajout des méthodes keyUpActionHandler et keyDownActionHandler pour la gestion des déplacements du joueur au clavier 

    - Ajout de l'exécution de la méthode move de l'objet Starship dans la méthode moveAndDraw de la classe Game

    - Ajout des EventListener dans main.js pour lier les événements clavier nécessaire à l'objet window

__mardi 20 avril :__

    - Code de la classe Saucer et de sa méthode move
    
    - Ajout d'une méthode addSaucer à la classe Game pour permettre l'ajout d'une soucoupe lors d'un clic sur le bouton dédié à cela

    - Création de la classe Shoot ainsi que sa méthode move

    - Ajout de la création d'un Shoot avec la touche espace

    - Ajout des méthodes setter et getter pour le vertical_step de Saucer

    - Ajout des méthodes ____collisionWith et collisionWith dans la classe Shoot

    - Ajout des méthodes setFalling et isFalling de la classe Saucer

__mercredi 21 avril :__

    - Mise à jour du score à chaque collision entre un tir et un Saucer

    - Mise à jour du score quand un Saucer sort de la limite gauche du canvas

    - Ajout des méthodes flotteSaucerON et flotteSaucerOFF ainsi qu'un attribut  pour setInterval pour la gestion du bouton flotteSoucoupes

    - Ajout de la gestion onclick sur le bouton flotteSoucoupes

__Ajouts hors du cahier des charges :__

    - Modification du css et de l'index.html pour obtenir un panneau style retro console avec une police style 8 bits

    - Ajout d'une classe BossShip dans mobile pour instancier un boss avec un motant de 200hp et différentes méthodes pour lui permettre de tirer et suivre les mouvements du joueurs. Un Shoot du joueur subit par le boss correspond à 5 points de dégâts. Ainsi le joueur doit toucher 40 fois le boss pour le tuer.

    - Ajout d'une cadence de tir au boss avec un déplacement des Shoot plus élevé pour un boss pour avoir une certaine difficulté

    - Ajout de points de dégâts sur les Shoot pour permettre au joueur de faire descendre la vie du boss à chaque collision d'un tir du joueur sur le boss

    - Ajout des collisions entre le joueur (starship) et les Saucers. Un saucer qui touche le joueur (starship) est considéré comme neutralisé donc il passe en setFailling

    - Ajout d'un système de points vie du joueur. Chaque collision entre un tir ennemi ou avec un saucer qui fonce dans le joueur fait permettre un point de vie donc un coeur sur l'interface joueur. La boucle de gameplay s'arrête seulement si le joueur meurt donc quand il n'a plus de points de vie alors une image Game Over est affiché avec un timeout programmé pour stop les movements et draw.

    - Ajout d'un bouton pour faire apparaître un boss directement

    - A chaque fois que le joueur tue 25 Saucers il fait apparaître un boss. Le joueur est prévenu de l'arrivé proche d'un boss tous les 20 Saucers tués par le biais d'un son (boss_inc.wav). Cela permet d'augmenter la difficulté car avec le bouton flotteSaucers actif le temps de tué un boss on a pratiquement tué 25 saucers alors un enchaînement rapide de boss se fait. Le but du joueur étant de faire le plus gros score. C'est pourquoi l'arrêt du jeu est effectué que lors d'un gameover

    - Si le joueur tue un boss il gagne 5000 points et regagne toute sa vie c'est-à-dire qu'il repasse à 3 hp soit 3 coeurs sur l'interface

    - Ajout de différent son jeu retro pour une meilleure immersion. Ainsi nous avons donc ajouter une classe Sound et GetSound dans un fichier sound.js pour permettre une gestion simple des sons. Nous avons notamment ajouter la recherche des fichiers wav/mp3 dans le webpack.config.js grâce au module file-loader.

    - Ajout de la gestion du son en fond (backgroud.wav) en fonction du navigateur car chrome refuse l'autoplay des balises audio

    - Ajout d'un bouton MUSIC pour lancer ou couper le son de fond (background.wav)

    - Les ajouts ont eu pour conséquences notamment que nous avons dû faire une fonction  __collisionWith dans la classe Mobile pour savoir la collision entre deux objets Mobiles et ainsi la définition de méthode collisionWithSaucer, collisionWithStarship, collisionWithBoss ou encore moveBoss pour Shoot pour permettre le bon fonctionnement et la clareté du code.

Source des fichiers sons : [freesound.org](https://freesound.org/)

    

## 5. Contraintes d'écriture du code

Veuillez respecter les contraintes suivantes lors de l'écriture de votre code :

    - Utiliser const quand c'est possible, sinon let, pour toutes les définitions de variables

    - Définir chaque classe dans un fichier à part et utilisez la gestion des modules ES6

    - Définir des valeurs par défaut des paramètres des fonctions/méthodes quand cela a un sens 
    
    - Ne pas utiliser de boucles for/while pour itérer sur les tableaux mais utiliser les méthodes  fonctionnelles  adaptées (forEach, some, etc.)

    - Utiliser les arrow function pour toutes les fonctions autres que des méthodes

    - Utiliser la syntaxe class pour définir les types objets

    - Si l'occasion se présente utiliser les opérateurs rest et spreads

## 6. Sujet du projet

Vous pouvez retrouver le sujet du projet en cliquant sur [ce lien](https://www.fil.univ-lille1.fr/~routier/enseignement/licence/js-s4/tdtp/starship.html)
