'use strict';

//Модуль создания данных для похожих объявлений
(function () {

    window.data = {
        map: document.querySelector('.map'),

        NUMBER_OF_ADVERTISEMENTS: 8,

        PIN_SIZE: {
            WIDTH: 50,
            HEIGHT: 70
        },

        typeMap: {
            'palace': 'Дворец',
            'flat': 'Квартира',
            'house': 'Дом',
            'bungalo': 'Бунгало'
        },

        //Функция создания массива похожих объявлений
        makeArrayOfRandomAdvertisements: function () {
            let advertisements = [];
            const avatarNumbers = window.utils.makeShuffleArray( window.utils.getConsistentArray(1, window.data.NUMBER_OF_ADVERTISEMENTS) ); //перетасовываем массив номеров для адресов аватарок
            const titles = window.utils.makeShuffleArray(ADVERTISEMENTS_DATA.OFFER_TITLES); //перетасовываем изначальный массив заголовков предложений
            for (let i = 0; i < window.data.NUMBER_OF_ADVERTISEMENTS; i++) {
                let advertisementObject = {
                    author : {
                        avatar: 'img/avatars/user0' + avatarNumbers[i] + '.png'
                    },
                    offer : {
                        title : titles[i],
                        price : window.utils.getRandomInt(ADVERTISEMENTS_DATA.OFFER_PRICES.MIN, ADVERTISEMENTS_DATA.OFFER_PRICES.MAX),
                        type : ADVERTISEMENTS_DATA.OFFER_TYPES[window.utils.getRandomInt(0, ADVERTISEMENTS_DATA.OFFER_TYPES.length - 1)],
                        rooms : window.utils.getRandomInt(ADVERTISEMENTS_DATA.OFFER_ROOMS.MIN, ADVERTISEMENTS_DATA.OFFER_ROOMS.MAX),
                        checkin : ADVERTISEMENTS_DATA.OFFER_CHECKS[window.utils.getRandomInt(0, ADVERTISEMENTS_DATA.OFFER_CHECKS.length - 1)],
                        checkout : ADVERTISEMENTS_DATA.OFFER_CHECKS[window.utils.getRandomInt(0, ADVERTISEMENTS_DATA.OFFER_CHECKS.length - 1)],
                        features : window.utils.makeCutArray( window.utils.makeShuffleArray(ADVERTISEMENTS_DATA.OFFER_FEATURES) ),
                        description : '',
                        photos : window.utils.makeShuffleArray(ADVERTISEMENTS_DATA.OFFER_PHOTOS)
                    },
                    location : {
                        x : window.utils.getRandomInt(ADVERTISEMENTS_DATA.LOCATION_X.MIN, ADVERTISEMENTS_DATA.LOCATION_X.MAX),
                        y : window.utils.getRandomInt(ADVERTISEMENTS_DATA.LOCATION_Y.MIN, ADVERTISEMENTS_DATA.LOCATION_Y.MAX)
                    }
                };

                advertisementObject.offer.guests = advertisementObject.offer.rooms * ADVERTISEMENTS_DATA.OFFER_GUESTS;//добавляем в каждый объект возможное количество гостей на основе количества комнат
                advertisementObject.offer.address = `${advertisementObject.location.x}, ${advertisementObject.location.y}`;//добавляем в каждый объект адрес на основе данных location.x, location.y

                advertisements.push(advertisementObject);
            }

            return advertisements;
        }
    };

    //Исходные данные
    const ADVERTISEMENTS_DATA = {
        OFFER_TITLES : [
            'Большая уютная квартира',
            'Маленькая неуютная квартира',
            'Огромный прекрасный дворец',
            'Маленький ужасный дворец',
            'Красивый гостевой домик',
            'Некрасивый негостеприимный домик',
            'Уютное бунгало далеко от моря',
            'Неуютное бунгало по колено в воде'
        ],
        OFFER_PRICES : {
            MIN : 1000,
            MAX : 1000000,
        },
        OFFER_TYPES : [
            'palace',
            'flat',
            'house',
            'bungalo'
        ],
        OFFER_ROOMS : {
            MIN : 1,
            MAX : 5
        },
        OFFER_GUESTS : 3,
        OFFER_CHECKS : [
            '12:00',
            '13:00',
            '14:00'
        ],
        OFFER_FEATURES : [
            'wifi',
            'dishwasher',
            'parking',
            'washer',
            'elevator',
            'conditioner'
        ],
        OFFER_PHOTOS : [
            'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
            'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
            'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
        ],
        LOCATION_X : {
            MIN : window.data.PIN_SIZE.WIDTH / 2,
            MAX : window.data.map.offsetWidth - window.data.PIN_SIZE.WIDTH / 2,
        },
        LOCATION_Y : {
            MIN : 130,
            MAX : 630,
        }
    };
})();
