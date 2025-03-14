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

        advertisements: [],

        //Функция создания массива похожих объявлений
        onLoadSuccess: function (data) {
            let shuffleData = window.utils.makeShuffleArray(data);
            for (let i = 0; i < window.data.NUMBER_OF_ADVERTISEMENTS; i++) {
                console.log(shuffleData[i].location.lat);
                let advertisementObject = {
                    author : {
                        avatar: shuffleData[i].author.avatar
                    },
                    offer : {
                        title : shuffleData[i].offer.title,
                        address : shuffleData[i].offer.address,
                        price : shuffleData[i].offer.price,
                        type : shuffleData[i].offer.type,
                        rooms : shuffleData[i].offer.rooms,
                        guests : shuffleData[i].offer.guests,
                        checkin : shuffleData[i].offer.checkin,
                        checkout : shuffleData[i].offer.checkout,
                        features : shuffleData[i].offer.features,
                        description : shuffleData[i].offer.description,
                        photos : shuffleData[i].offer.photos
                    },
                    location : {
                        x : window.utils.getPositionOnMap(shuffleData[i].location.lat, shuffleData[i].location.lng).x,
                        y : window.utils.getPositionOnMap(shuffleData[i].location.lat, shuffleData[i].location.lng).y
                    }
                };

                window.data.advertisements.push(advertisementObject);
            }
        },

        onLoadError: function (errorMessage) {
            const node = document.createElement('div');
            node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
            node.style.position = 'absolute';
            node.style.left = 0;
            node.style.right = 0;
            node.style.fontSize = '30px';

            node.textContent = errorMessage;
            document.body.insertAdjacentElement('afterbegin', node);
        }
    };

    window.backend.download(window.data.onLoadSuccess, window.data.onLoadError);
})();
