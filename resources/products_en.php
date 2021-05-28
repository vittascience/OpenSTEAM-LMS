<?php
return [
    1 => [
        "type" => "kit",
        "name" => "Solar balloon kit",
        "front-pic" => "/public/content/products/kit-ballon-solaire/front.png",
        "back-pic" => "/public/content/products/kit-ballon-solaire/back.png",
        "description" => "A complete kit to construct a solar balloon and two mini-weather stations in order to make comparative measurements.",
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
                "name" => "Two electronic weather kits",
                "description" => "Arduino board, sensors, SD card, connectors necessary for assembly. Detailed list of contents : <a href='/shop?id=2#product-exploded'>here</a>.",
                "position" => ["42%","62%"]
            ],
            [
                "name" => "Black Polyethylene 30 m x 1 m",
                "description" => "",
                "position" => ["55%","15%"]
            ],
            [
                "name" => "Two handles with 50m of rope",
                "description" => "",
                "position" => ["44%","80%"]
            ],
            [
                "name" => "A pair of scissors",
                "description" => "",
                "position" => ["22%","65%"]
            ],
            [
                "name" => "Two adhesive rolls",
                "description" => "",
                "position" => ["25%","34%"]
            ],
            [
                "name" => "A spindle",
                "description" => "",
                "position" => ["70%","70%"]
            ],
            [
                "name" => "User manual",
                "description" => "Available online <a href='/public/content/user_data/resources/0ee4dd0c39fd2e544d526ebb99778d33.pdf'>here</a>",
                "position" => ["60%","42%"]
            ]
        ],
        "faq" => [
            [
                "question" => "How much time should we anticipate for balloon construction?",
                "answer" => "With students divided up into different building stations (construction of the balloon’s envelope, the balloon’s basket, and connecting and test the on-board electronics,) the construction of the balloon itself takes about 4 hours
                </br>The most ideal is to take time to explain all the points of the program using the kit, so it’s best to count on a little more time. The project is very adaptable, for example, for the electronic component, you can give it to the students  already assembled, let them make the connections, or let them modify the board’s code with fill-in-the-blank code."
            ],
            [
                "question" => "What does the kit contain?",
                "answer" => "The kit contains all the necessary components to build a solar balloon measuring 4 meters in diameter as well as the electronic mini-weather station that will be placed in the balloon’s basket."
            ],
            [
                "question" => "How much time should one anticipate to fly the balloon and take measurements?",
                "answer" => "The flight is highly dependant on the weather (see next question). If there are good conditions, the balloon will take off  quickly and an hour will be adequate to inflate the balloon, fly it, and recover its data.
                </br></br>Another session should be anticipated to extract the data and graph it in Excel."
            ],
            [
                "question" => "What weather conditions are needed to fly the balloon? What seasons",
                "answer" => "The flight requires a sunny day without wind. When it is lit directly by the sun, the balloon will take off quickly (within about 5 minutes). A slightly cloudy sky can also work if you wait for a “sun hole”.
                </br></br>On the other hand, wind is a real problem because the balloon can be torn from gusts of wind greater than 10km\h. Wind is generally weakest in the morning because so-called “thermal winds” are not high, thereby making ideal flight time between 9am and 12pm.
                </br></br>The variable that matters is the difference in temperature between the inside and the outside of the balloon. The ambient temperature does not make a big different, so the season does not matter. You will find a flight condition predictor here."
            ],
            [
                "question" => "How high can the balloon go, is specific authorization needed?",
                "answer" => "The balloon must be held in place by two 50m ropes (included in the kit), which allow the balloon to fly up to 50m. Regulation authorises captive flights up to 50m without specific authorisation.
                </br></br>To answer the question: \"What happens if we let go of the ropes?\", we tried a free flight (without ropes) from Paris. The balloon reached an altitude of 8500m and took what we suppose must have been a breathtaking video, but unfortunately we couldn’t retrieve the balloon and camera because the GPS tracker didn’t function correctly. 
                </br>We’re going to try the experiment again soon so you can show the video, along with the pressure, temperature, and pollution levels in relation to altitude to your students."
            ],
            [
                "question" => "What is the lifespan of the balloon? Number of potential uses? Fragility?",
                "answer" => "Once the balloon is constructed, it be flown an indefinite number of times. It cannot, though, be deconstructed, then constructed again. It is fragile, but quite easy to repair with tape. Once deflated, it can go in a student’s backpack, so transporting it is not a problem.
                </br></br>The best to use one kit per class so students can see all the steps of construction and learn from the experience."
            ],
            [
                "question" => "Can one quickly learn the electronic software? About how long does it take?",
                "answer" => "The electronic component is based on Arduino technology, that was created with simplicity in mind. The instruction manual we wrote contains step-be-step instructions. 
                </br>Someone completely unfamiliar with this type of electronics would take about 2 hours (including connections). "
            ],
            [
                "question" => "What are the measured parameters? Do they vary during the course of the flight?",
                "answer" =>  "The electronic component measures pollution, temperature, pressure, and altitude. We can clearly see changes in the pressure and altitude, while the lowering of temperature is less significant. Pollution (CO2 level) varies according to where the flight is launched from, which also can be interesting to see. 
                </br>In any case, it is interesting to see class variations (when one blows on the sensors, one can clearly see variations in temperature and CO2 levels."
            ],
            [
                "question" => "What can we do with the acquired data?",
                "answer" => "The data can be used to show the physical properties of the atmosphere (pressure and temperature variation in relation to altitude), the detection of pollutants (CO2 by blowing on it, butane with a lighter…). It can also initiate students to computer coding as well as other educational opportunities that we haven’t thought of yet."
            ],
            [
                "question" => "What is the electronic component’s level of autonomy?",
                "answer" => "The sensors make regular recordings during a desired period of time, the only limit is its battery, which has a lifespan of about 10 hours."
            ]
        ]
    ],
    2 => [
        "type" => "kit",
        "name" => "Electronic weather kit",
        "front-pic" => "/public/content/products/kit-meteo/front.jpg",
        "back-pic" => "/public/content/products/kit-meteo/back.png",
        "description" => "The electronic kit allows the creation of a weather station that measures temperature, pressure, altitude, and CO2 levels. 
        </br>The data can be stored on an SD card (included), transferred to a computer if the station is connected to it, or even sent to another card via distance with the assistance of an Xbee module (not included). 
        </br>Two copies of the electronic weather kit are included in the solar balloon kit. It could be good to add additional weather kits if you wish to focus on the programming component of the activity by dividing a group into multiple small teams.",
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
                "name" => "An Arduino Uno Rev3 with a USB cable",
                "description" => "",
                "position" => ["40%","25%"]
            ],
            [
                "name" => "Temperature, pressure, altitude, pollution, and light sensors",
                "description" => "1 BMP280 sensor, 1 MQ135 sensor, and 2 photoresistors",
                "position" => ["60%","80%"]
            ],
            [
                "name" => "A microSD 128MB card with an Arduino reader and a USB adapter",
                "description" => "",
                "position" => ["50%","70%"]
            ],
            [
                "name" => "Twelve diodes",
                "description" => "Red, green, and yellow",
                "position" => ["33%","74%"]
            ],
            [
                "name" => "Six push buttons",
                "description" => "",
                "position" => ["48%","84%"]
            ],
            [
                "name" => "Forty resistors",
                "description" => "Ten 220 Ohm, ten 1K Ohm, ten 10K Ohm and ten 100K Ohm.",
                "position" => ["35%","52%"]
            ],
            [
                "name" => "A breadboard and forty cables",
                "description" => "Used to connect seamless components. Twenty male-male cables, ten male-female cables, and ten female-female cables.",
                "position" => ["41%","41%"]
            ],
            [
                "name" => "A 9V battery and its connector",
                "description" => "",
                "position" => ["81%","70%"]
            ]
        ],
        "faq" => [
        ]
    ],
    3 => [
        "type" => "kit",
        "name" => "Solar balloon refill",
        "front-pic" => "/public/content/products/recharge-ballon/front.png",
        "back-pic" => "/public/content/products/recharge-ballon/back.png",
        "description" => "This refill makes it possible to do the solar balloon activity again from the beginning. The solar balloon can fly numerous consecutive times but cannot be deconstructed. The refill therefore contains all the necessary components to construct a new balloon.",
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
                "name" => "Black polyethylene 30 m x 1 m",
                "description" => "",
                "position" => ["55%","15%"]
            ],
            [
                "name" => "Two handles with 50m of rope",
                "description" => "",
                "position" => ["44%","80%"]
            ],
            [
                "name" => "A pair of scissors",
                "description" => "",
                "position" => ["22%","65%"]
            ],
            [
                "name" => "Two rolls of tape",
                "description" => "",
                "position" => ["25%","34%"]
            ],
            [
                "name" => "Spindle",
                "description" => "",
                "position" => ["70%","70%"]
            ],
            [
                "name" => "User manual",
                "description" => "Available as download <a href='/public/content/user_data/resources/0ee4dd0c39fd2e544d526ebb99778d33.pdf'>here</a>",
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
        "description" => "Arduino Uno Rev3 Board with an Arduino-USB connecting computer cable.",
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
        "name" => "Camera Module",
        "front-pic" => "/public/content/products/camera/front.png",
        "back-pic" => "/public/content/products/camera/back.png",
        "description" => "A camera can be added to the balloon’s basket to take beautiful aerial photos. If you are equipped with a “wide angle” or “fisheye” type GoPro camera, this is the best option!",
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
        "name" => "Fine Particles Module",
        "front-pic" => "/public/content/products/particules/front.png",
        "back-pic" => "/public/content/products/particules/back.png",
        "description" => "Fine particles sensor with connecting cables to expand the activity on air quality. More pertinent on the ground than when in the air, this sensor must remain stable for a long period of time to offer interesting measurements. ",
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
        "name" => "Communication Radio Module",
        "front-pic" => "/public/content/products/radio/front.png",
        "back-pic" => "/public/content/products/radio/back.png",
        "description" => "This module allows you to emmit and receive data from a board to another.</br>During flight, you can have the data in real time from the ground.",
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