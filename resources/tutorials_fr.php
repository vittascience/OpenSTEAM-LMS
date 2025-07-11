<?php
return [
    0 => [
        "title" => "Introduction aux API",
        "picture" => "/public/content/user_data/tuto_img/link-solid.svg",
        "parts" => [
            [
                "title" => "Une API, qu'est-ce que c'est ?",
                "content" => "<p>Une API, en français \"interface de programmation applicative\", est une interface simplifiée permettant à des logiciels de communiquer entre eux.<br/>
                Par exemple, le système d'API permet  d'afficher les données météorologiques du site <a href=\"https://openweathermap.org/\">OpenWeatherMap</a> sur <a href=\"https://vittascience.com/weather\">la page Météo</a> de Vittascience. Pour comprendre comment cela fonctionne, il faut imaginer que lorsque vous cliquez sur la carte, un événement se déclenche et appelle l'API de OpenWeatherMap, qui répond en retour un ensemble de données météorologiques correspondant à la localisation cliquée.<br/>
                L'interface de programmation de Vittascience permet de mettre en place une API très simplement. Avec celle-ci, il est possible de partager les données acquises par les capteurs, par exemple pour les afficher sur un site internet tiers.</p>"
            ],
            [
                "title" => "Programmer ma première API",
                "content" => "<p>L'API Vittascience requiert une clé par utilisateur, qui assure la confidentialité des données et permet d'éviter les abus. Il faut donc commencer par se connecter à votre compte Vittascience.</br>
                Notre API envoie de nouvelles données toutes les 10 secondes, via l'outil \"Graphique\".
                De ce fait, pour obtenir des données de l'API, il faut utiliser le bloc \"Traceur Série\".<br/><br/>

                Commençons par un programme simple qui affiche le temps en secondes depuis le transfert vers la carte électronique.<br/>
                Transférer le programme ci-dessous vers la carte, puis aller dans le \"Mode Graphique\" en bas à droite. Sur ce mode, cliquer sur le bouton exporter et aller dans l'onglet API.</br> 
                Si vous êtes connecté, vous allez obtenir un lien de cette forme :<br/>
                <center><b>https://vittascience.com/api/?apiKey=cKzpBK862HpjsRvo4Qd2POJZss6OpE5Q</b></center>
                </br>Ce lien contient votre clé personnelle servant à obtenir les données de votre projet. <br/>
               Copier ce lien, puis cocher la case \"Activer l'API sur ce projet\".</p>
                <iframe width='800' height='500' frameborder='0' style='border:1px #d6d6d6 solid;' src=\"https://vittascience.com/code?frameid=ym6svtpod4&embed=1&id=42\" title=\"Tutoriel API - Programme d'exemple pour comprendre les API\"></iframe>"
            ],
            [
                "title" => "Récupérer les données",
                "content" => "<p>Une fois l'API activée, les données sont envoyées sur le serveur de Vittascience et deviennent accessibles à l'aide de votre clé d'API. Ces données restent privées et ne sont en aucun cas accessible par un tier.</br></br>
                Ouvrir un nouvel onglet dans le navigateur et coller le lien contenant la clé.</br>
                Le fichier de sortie contient plusieurs éléments au format JSON :
                <br/><ul><li>Une clé 'success' qui indique le succès ou non de la récupération des données (true/false)</li>
                <li>Une clé 'data' qui contient l'ensemble des données reçues par rapport au projet.</li>
                <li>une clé 'lastUpdate' qui donne la date des informations reçues.</li>
                <li>une clé 'error' qui, en cas de problème lors de la récupération des données, fournit un message d'erreur expliquant la raison.</li>
                </ul></br>
                Vous pouvez ainsi visualiser les données sur votre ordinateur, mais également sur votre téléphone ou n'importe quel appareil connecté à internet !</br>
                A l'heure actuelle, il n'y a pas d'options avancées pour l'API, ni de gestion de multi-projets.
                <br/>Vous pouvez faire autant d'appel à cette API que vous le souhaitez, mais les données n'étant rafraîchies que toutes les 10 secondes, il n'est pas utile d'y faire appel plus souvent.</br></br>
                En cas de perte ou d'utilisation frauduleuse de votre clé d'API, vous pouvez en regénérer une dans l'onglet \"Mes programmes\" de votre compte. L'ancienne clé sera immédiatement désactivée sur l'ensemble de vos projets.
                </p>"
            ],
            [
                "title" => "À vous de jouer !",
                "content" => "<p>Vous savez maintenant comment fonctionne l'API et comment récupérer les données.</br> À vous de créer un programme pour partager les données que vous souhaitez !</p>
                <iframe width='800' height='500' frameborder='0' style='border:1px #d6d6d6 solid;' src=\"https://vittascience.com/code?frameid=s6oq6xfhpf8&embed=1&id=43\" title=\"Tutoriel API - Exercice pratique pour créer votre première API\"></iframe>"
            ],
        ],
        "author" => "Marchal Maxence",
        "date" => "Lundi 27 Septembre à 15h05"
    ]
];

?>