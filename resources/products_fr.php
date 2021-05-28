<?php
return [ 
    1 => [
        "type" => "kit",
        "name" => "Kit ballon solaire",
        "front-pic" => "/public/content/products/kit-ballon-solaire/front.png",
        "back-pic" => "/public/content/products/kit-ballon-solaire/back.png",
        "description" => "Un kit complet pour construire un ballon solaire et deux mini-stations météo afin de pouvoir faire des mesures comparatives.",
        "sold-out" => false,
        "price" => 250.00, //the normal price of product without VAT
        "sale" => 0.00, //the price of product in sale without VAT
        "pictures" => [
            "/public/content/products/kit-ballon-solaire/1.jpg",
            "/public/content/products/kit-ballon-solaire/2.jpg",
        ],
        "content-img" => "/public/content/products/kit-ballon-solaire/content-ballon.png",
        "content" => [
            [
                "name" => "Deux kits électroniques Météo",
                "description" => " Carte Arduino, capteurs, carte SD et connectique nécessaire au montage. Contenu détaillé <a href='/shop?id=2#product-exploded'>ici</a>.",
                "position" => ["42%","62%"]
            ],
            [
                "name" => "Polyéthylène noir 30 m x 1 m",
                "description" => "",
                "position" => ["55%","15%"]
            ],
            [
                "name" => "Deux poignées avec 50m de corde",
                "description" => "",
                "position" => ["44%","80%"]
            ],
            [
                "name" => "Une paire de ciseaux",
                "description" => "",
                "position" => ["22%","65%"]
            ],
            [
                "name" => "Deux rouleaux adhésifs",
                "description" => "",
                "position" => ["25%","34%"]
            ],
            [
                "name" => "Un patron de fuseau",
                "description" => "",
                "position" => ["70%","70%"]
            ],
            [
                "name" => "Guide d'utilisation",
                "description" => "Disponible en téléchargement <a href='/public/content/user_data/resources/0ee4dd0c39fd2e544d526ebb99778d33.pdf'>ici</a>",
                "position" => ["60%","42%"]
            ]
        ],
        "faq" => [
            [
                "question" => "Combien de temps faut-il envisager pour la construction du ballon ?",
                "answer" => "La construction du ballon en elle-même dure 4h environ, avec les élèves répartis en différents ateliers 
                (construction de l’enveloppe du ballon, aménagement de la nacelle et branchement et test de l’électronique 
                embarquée).</br>L’idéal est de prendre le temps d’expliquer des points du programme grâce au kit, donc on peut 
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
                "answer" => "Le vol est très dépendant de la météo (voir question suivante). Si les conditions sont bonnes, le ballon décolle très rapidement, une séance d’une heure suffit à gonfler le ballon, le faire voler et récupérer les données.
                </br></br>Il faut compter une autre séance pour extraire les données et tracer les courbes sur Excel."
            ],
            [
                "question" => "Quelles conditions météorologiques sont nécessaire pour l’envol du ballon ? Quelles saisons ?",
                "answer" => "Le vol nécessite un jour sans vent et avec du soleil. Eclairé directement par le soleil, le ballon décolle très rapidement (5min environ). Un ciel légèrement nuageux conviendra à condition d’attendre un “trou de soleil”.
                </br></br>En revanche, le vent est un vrai problème, car le ballon peut se déchirer en cas de rafale au-delà de 10km/h. Le vent est en général plus faible en matinée car les vents dits “thermiques” ne sont pas levés, l’idéal est donc un vol entre 9h et 12h.
                </br></br>La variable qui importe est la différence de température entre l’intérieur et l’extérieur du ballon, la température ambiante n’influence pas (au premier ordre), donc la saison n’importe pas. Vous trouverez un prédicteur de condition de vol ici."
            ],
            [
                "question" => "Quelle hauteur peut atteindre le ballon, faut-il prévoir une autorisation spécifique ?",
                "answer" => "Le ballon doit être tenu attaché par deux cordes de 50m (inclues dans le kit), ce qui permet de faire voler le ballon jusqu’à 50m. La réglementation autorise le vol captif jusqu’à 50m sans autorisation spécifique.
                </br></br>Pour répondre à la question “que se passe-t-il si on lâche les cordes ?”, nous avons tenté un vol libre (sans cordes) depuis Paris. Le ballon est monté à 8500m d’altitude est a capturé une vidéo que nous supposons à couper le souffle, mais nous n’avons pas pu récupérer le ballon et la caméra car le traceur GPS n’a pas fonctionné correctement.
                </br>Nous allons retenter l’expérience prochainement, vous pourrez donc montrer la vidéo à vos élèves, ainsi que les courbes de pression, température et pollution en fonction de l’altitude."
            ],
            [
                "question" => "Quelle est la durée de vie du ballon ? Nombre potentiel d'utilisation ? Fragilité ?",
                "answer" => "Le ballon peut voler indéfiniment une fois construit, en revanche, on ne peut le déconstruire puis le reconstruire. Il est très fragile, mais très simple à réparer à l’aide de scotch. Une fois dégonflé il rentre dans un sac à dos d’étudiant, le transport n’est donc pas un problème.
                </br></br>L’idéal est d’utiliser un kit par classe pour que les élèves voient toutes les étapes de la construction et s’approprient l’expérience."
            ],
            [
                "question" => "La prise en main du logiciel électronique est-elle rapide ? Durée approximative pour s'initier ?",
                "answer" => "Le montage électronique est basé sur la technologie Arduino, qui a été pensée pour sa simplicité. Avec les livrets descriptifs que nous avons rédigés, vous pourrez suivre pas à pas les étapes.
                </br>Quelqu’un n’ayant jamais touché d’électronique réussira à tout prendre en main en moins de 2h (branchements inclus)."
            ],
            [
                "question" => "Quel sont les paramètres mesurés ? Varient-ils au cours du vol ?",
                "answer" =>  "Le montage mesure la pollution, la température, la pression et l’altitude. On voit nettement les écarts de pression et d’altitude, en revanche la baisse de température est moins significative. La pollution (taux de CO2) varie en fonction de l’endroit où se déroule le vol, mais peut être intéressante.
                </br>Dans tous les cas, il est intéressant d’observer les variations en classe (lorsqu’on souffle sur les capteurs on voit très nettement la variation de température et taux de CO2). "
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
    ],
    2 => [
        "type" => "kit",
        "name" => "Kit électronique Météo",
        "front-pic" => "/public/content/products/kit-meteo/front.jpg",
        "back-pic" => "/public/content/products/kit-meteo/back.png",
        "description" => "Kit électronique permettant la création d'une station météorologique mesurant la température, la pression, l'altitude et le niveau de CO2.
        </br>Les données peuvent être stockées sur une carte SD (fournie), transmises à un ordinateur si la station y est connectée ou encore envoyées à une autre carte distante à l'aide d'un module Xbee (non fourni).
        </br>Le kit électronique Météo est déjà inclus en deux exemplaires dans le kit Ballon solaire. Il peut être intéressant d'ajouter des kits Météo si vous souhaitez accentuer la partie programmation et diviser un groupe en plusieurs petites équipes.",
        "sold-out" => false,
        "price" => 75, //the normal price of product without VAT
        "sale" => 0.00, //the price of product in sale without VAT
        "pictures" => [
            "/public/content/products/kit-meteo/1.jpg",
            "/public/content/products/kit-meteo/2.jpg",
            "/public/content/products/kit-meteo/3.jpg",
            "/public/content/products/kit-meteo/4.jpg",
        ],
        "content-img" => "/public/content/products/kit-meteo/exploded.jpg",
        "content" => [
            [
                "name" => "Une carte Arduino Uno Rev3 avec câble USB",
                "description" => "",
                "position" => ["40%","25%"]
            ],
            [
                "name" => "Capteurs de température, pression, altitude, pollution et luminosité",
                "description" => "1 capteur BMP280, 1 capteur MQ135 et 2 photorésistances.",
                "position" => ["60%","80%"]
            ],
            [
                "name" => "Une carte microSD 128MB avec lecteur Arduino et adaptateur USB",
                "description" => "",
                "position" => ["50%","70%"]
            ],
            [
                "name" => "Douze diodes",
                "description" => "Couleurs rouge, vert et jaune.",
                "position" => ["33%","74%"]
            ],
            [
                "name" => "Six boutons poussoir",
                "description" => "",
                "position" => ["48%","84%"]
            ],
            [
                "name" => "Quarante résistances",
                "description" => "Dix 220 Ohm, dix 1K Ohm, dix 10K Ohm et dix 100K Ohm.",
                "position" => ["35%","52%"]
            ],
            [
                "name" => "Une breadboard et quarante câbles",
                "description" => "Permet de connecter les composants sans soudure. Vingt câbles mâle-mâle, dix mâle-femelle et dix femelle-femelle.",
                "position" => ["41%","41%"]
            ],
            [
                "name" => "Une pile 9V et son connecteur",
                "description" => "",
                "position" => ["81%","70%"]
            ]
        ],
        "faq" => [
        ]
    ],
    3 => [
        "type" => "kit",
        "name" => "Recharge Ballon solaire",
        "front-pic" => "/public/content/products/recharge-ballon/front.png",
        "back-pic" => "/public/content/products/recharge-ballon/back.png",
        "description" => "Cette recharge permet de reconduire l'activité Ballon solaire depuis le début. En effet, le ballon solaire peut voler de nombreuses fois consécutives mais ne peut être déconstruit. La recharge contient donc le nécessaire de construction d'un nouveau ballon.",
        "sold-out" => false,
        "price" => 133.33, //the normal price of product without VAT
        "sale" => 0.00, //the price of product in sale without VAT
        "pictures" => [
            "/public/content/products/recharge-ballon/1.png",
            "/public/content/products/recharge-ballon/2.png"
        ],
        "content-img" => "/public/content/products/recharge-ballon/content-recharge.png",
        "content" => [
            [
                "name" => "Polyéthylène noir 30 m x 1 m",
                "description" => "",
                "position" => ["55%","15%"]
            ],
            [
                "name" => "Deux poignées avec 50m de corde",
                "description" => "",
                "position" => ["44%","80%"]
            ],
            [
                "name" => "Une paire de ciseaux",
                "description" => "",
                "position" => ["22%","65%"]
            ],
            [
                "name" => "Deux rouleaux adhésifs",
                "description" => "",
                "position" => ["25%","34%"]
            ],
            [
                "name" => "Un patron de fuseau",
                "description" => "",
                "position" => ["70%","70%"]
            ],
            [
                "name" => "Guide d'utilisation",
                "description" => "Disponible en téléchargement <a href='/public/content/user_data/resources/0ee4dd0c39fd2e544d526ebb99778d33.pdf'>ici</a>",
                "position" => ["60%","42%"]
            ]
        ],
        "faq" => [
        ]
    ],
    4 => [
        "type" => "kit",
        "name" => "Arduino Uno Rev3",
        "front-pic" => "/public/content/products/arduino-cables/front.jpg",
        "back-pic" => "/public/content/products/arduino-cables/back.jpg",
        "description" => "Carte Arduino Uno Rev3 avec un câble de connexion Arduino - USB ordinateur.",
        "sold-out" => false,
        "price" => 20, //the normal price of product without VAT
        "sale" => 0.00, //the price of product in sale without VAT
        "pictures" => [
            "/public/content/products/arduino-cables/1.jpg",
            "/public/content/products/arduino-cables/2.jpg",
        ],
        "content-img" => "",
        "content" => [
        ],
        "faq" => [

        ]
    ],
    5 => [
        "type" => "module",
        "name" => "Module Photo",
        "front-pic" => "/public/content/products/camera/front.png",
        "back-pic" => "/public/content/products/camera/back.png",
        "description" => "Une caméra à rajouter dans la nacelle pour pouvoir faire des belles photos aériennes.  Elle permet aussi de prendre des vidéos avec une carte électronique plus puissante mais si vous êtes équipés d'une caméra \"grand angle\" ou \"fisheye\" type GoPro, cela reste la meilleure solution !",
        "sold-out" => false,
        "price" => 25, //the normal price of product without VAT
        "sale" => 0.00, //the price of product in sale without VAT
        "pictures" => [
            "/public/content/products/camera/1.png",
            "/public/content/products/camera/2.png",
            "/public/content/products/camera/4.png",
        ],
        "content-img" => "",
        "content" => [
        ],
        "faq" => [
        ]
    ],
    6 => [
        "type" => "module",
        "name" => "Module Particules Fines",
        "front-pic" => "/public/content/products/particules/front.png",
        "back-pic" => "/public/content/products/particules/back.png",
        "description" => "Capteur de particules fines avec câbles de connexion pour approfondir l'activité sur la qualité de l'air. Plus pertinent au sol qu'en l'air ce capteur doit rester stable et longtemps en fonctionnement pour donner des mesures intéressantes.",
        "sold-out" => false,
        "price" => 16.67, //the normal price of product without VAT
        "sale" => 0.00, //the price of product in sale without VAT
        "pictures" => [
            "/public/content/products/particules/1.png",
            "/public/content/products/particules/2.png"
        ],
        "content-img" => "",
        "content" => [
        ],
        "faq" => [
        ]
    ],
    7 => [
        "type" => "module",
        "name" => "Module communication Radio",
        "front-pic" => "/public/content/products/radio/front.png",
        "back-pic" => "/public/content/products/radio/back.png",
        "description" => "Module qui permet de transmettre des données d'une carte à une autre.<br/>En vol, cela permet notamment d'avoir les données en direct depuis le sol.",
        "sold-out" => false,
        "price" => 12.50, //the normal price of product without VAT
        "sale" => 0.00, //the price of product in sale without VAT
        "pictures" => [
            "/public/content/products/radio/1.png"
        ],
        "content-img" => "",
        "content" => [
        ],
        "faq" => [
        ]
    ],
];