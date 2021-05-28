<?php
return [
    1 => [
        "name" => "Ballon solaire",
        "main-picture" => "main-ballon.jpg",
        "content-picture" => "content-ballon.png",
        "description" => "La construction du ballon en elle-même dure 4h environ, avec les élèves répartis en différents ateliers (construction de 
l’enveloppe du ballon, aménagement de la nacelle et branchement et test de l’électronique embarquée). L’idéal est de 
prendre le temps d’expliquer des points du programme grâce au kit, donc on peut compter un peu plus de temps. Tout 
ceci est très adaptable, par exemple pour l’électronique vous pouvez donner le montage tout fait aux élèves, les laisser 
faire les branchements ou encore les laisser modifier le code de la carte avec un code à trou.",
        "content-header" => "Le kit Ballon solaire contient: ",
        "content" => [
            [
                "name" => "2 montages électroniques",
                "description" => "Carte Arduino, capteurs et l'ensemble du cablage nécessaire pour le montage.",
                "position" => ["42%","62%"]
            ],
            [
                "name" => "Polyéthylène noir 30 m x 1 m",
                "description" => "",
                "position" => ["55%","15%"]
            ],
            [
                "name" => "2 poignées avec 50m de corde",
                "description" => "",
                "position" => ["44%","80%"]
            ],
            [
                "name" => "Une paire de ciseaux",
                "description" => "",
                "position" => ["22%","65%"]
            ],
            [
                "name" => "2 rouleaux adhésifs",
                "description" => "",
                "position" => ["25%","34%"]
            ],
            [
                "name" => "Un patron de fuseau",
                "description" => "",
                "position" => ["70%","70%"]
            ]
        ],
        "faq" => [
            [
                "question" => "Combien de temps faut-il envisager pour la construction du ballon ?",
                "answer" => "La construction du ballon en elle-même dure 4h environ, avec les élèves répartis en différents ateliers 
                    (construction de l’enveloppe du ballon, aménagement de la nacelle et branchement et test de l’électronique 
                    embarquée). L’idéal est de prendre le temps d’expliquer des points du programme grâce au kit, donc on peut 
                    compter un peu plus de temps. Tout ceci est très adaptable, par exemple pour l’électronique vous pouvez donner 
                    le montage tout fait aux élèves, les laisser faire les branchements ou encore les laisser modifier le code de la 
                    carte avec un code à trou."
            ],
            [
                "question" => "Que contient le kit ?",
                "answer" => "Le kit contient tous les éléments nécessaires à la construction d’un ballon solaire de 4 mètres de diamètre, ainsi qu’à l’assemblage d’une mini station-météo électronique, qui sera embarquée dans la nacelle du ballon. "
            ],
            [
                "question" => "Combien de temps faut-il prévoir pour l'envol de la montgolfière et la prise de mesures ?",
                "answer" => "Le vol est très dépendant de la météo (voir question suivante). Si les conditions sont bonnes, le ballon décolle très rapidement, une séance d’une heure suffit à gonfler le ballon, le faire voler et récupérer les données. Il faut compter une autre séance pour extraire les données et tracer les courbes sur Excel."
            ],
            [
                "question" => "Quelles conditions météorologiques sont nécessaire pour l’envol du ballon ? Quelles saisons ?",
                "answer" => "Le vol nécessite un jour sans vent et avec du soleil. Eclairé directement par le soleil, le ballon décolle très rapidement (5min environ). Un ciel légèrement nuageux conviendra à condition d’attendre un “trou de soleil”. En revanche, le vent est un vrai problème, car le ballon peut se déchirer en cas de rafale au-delà de 10km/h. Le vent est en général plus faible en matinée car les vents dits “thermiques” ne sont pas levés, l’idéal est donc un vol entre 9h et 12h. La variable qui importe est la différence de température entre l’intérieur et l’extérieur du ballon, la température ambiante n’influence pas (au premier ordre), donc la saison n’importe pas. Vous trouverez un prédicteur de condition de vol ici."
            ],
            [
                "question" => "Quelle hauteur peut atteindre le ballon, faut-il prévoir une autorisation spécifique ?",
                "answer" => "Le ballon doit être tenu attaché par deux cordes de 50m (inclues dans le kit), ce qui permet de faire voler le ballon jusqu’à 50m. La réglementation autorise le vol captif jusqu’à 50m sans autorisation spécifique. Pour répondre à la question “que se passe-t-il si on lâche les cordes ?”, nous avons tenté un vol libre (sans cordes) depuis Paris. Le ballon est monté à 8500m d’altitude est a capturé une vidéo que nous supposons à couper le souffle, mais nous n’avons pas pu récupérer le ballon et la caméra car le traceur GPS n’a pas fonctionné correctement. Nous allons retenter l’expérience prochainement, vous pourrez donc montrer la vidéo à vos élèves, ainsi que les courbes de pression, température et pollution en fonction de l’altitude."
            ],
            [
                "question" => "Quelle est la durée de vie du ballon ? Nombre potentiel d'utilisation ? Fragilité ?",
                "answer" => "Le ballon peut voler indéfiniment une fois construit, en revanche, on ne peut le déconstruire puis le reconstruire. Il est très fragile, mais très simple à réparer à l’aide de scotch. Une fois dégonflé il rentre dans un sac à dos d’étudiant, le transport n’est donc pas un problème. L’idéal est d’utiliser un kit par classe pour que les élèves voient toutes les étapes de la construction et s’approprient l’expérience."
            ],
            [
                "question" => "La prise en main du logiciel électronique est-elle rapide ? Durée approximative pour s'initier ?",
                "answer" => "Le montage électronique est basé sur la technologie Arduino, qui a été pensée pour sa simplicité. Avec les livrets descriptifs que nous avons rédigés, vous pourrez suivre pas à pas les étapes. Quelqu’un n’ayant jamais touché d’électronique réussira à tout prendre en main en moins de 2h (branchements inclus)."
            ],
            [
                "question" => "Quel sont les paramètres mesurés ? Varient-ils au cours du vol ?",
                "answer" =>  "Le montage mesure la pollution, la température, la pression et l’altitude. On voit nettement les écarts de pression et d’altitude, en revanche la baisse de température est moins significative. La pollution (taux de CO2) varie en fonction de l’endroit où se déroule le vol, mais peut être intéressante. Dans tous les cas, il est intéressant d’observer les variations en classe (lorsqu’on souffle sur les capteurs on voit très nettement la variation de température et taux de CO2). "
            ],
            [
                "question" => "Quelles exploitations peut-on faire des données acquises ?",
                "answer" => "Les données peuvent servir à illustrer la physique de l’atmosphère (variation de la pression et de la température en fonction de l’altitude), la détection des polluants (CO2 en soufflant dessus, butane avec un briquet…), l’initiation au codage informatique, ainsi que d’autres exploitations auxquelles nous n’avons pas pensé."
            ],
            [
                "question" => "Quelle est l'autonomie du montage électrique ?",
                "answer" => "Les capteurs font des relevés réguliers pendant le temps désiré, la seule limite étant la pile, qui permet plusieurs dizaines d’heures d’autonomie. "
            ]
        ]
    ]
];