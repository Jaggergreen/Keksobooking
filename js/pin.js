'use strict';

//Модуль создания меток
(function () {
    window.pin = {
        //Функция генерации меток на карте
        getPinsOnMap: function (similarAdvertisementsData) {
            console.log(similarAdvertisementsData);
            let mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');
            let mapPinFragment = new DocumentFragment();
            for (let i = 0; i < window.data.NUMBER_OF_ADVERTISEMENTS; i++) {
                let mapPinElement = mapPinTemplate.cloneNode(true);
                mapPinElement.style.left = similarAdvertisementsData[i].location.x - window.data.PIN_SIZE.WIDTH / 2 + 'px';
                mapPinElement.style.top = similarAdvertisementsData[i].location.y - window.data.PIN_SIZE.HEIGHT + 'px';
                mapPinElement.querySelector('img').src = similarAdvertisementsData[i].author.avatar;
                mapPinElement.querySelector('img').alt = similarAdvertisementsData[i].offer.title;

                mapPinFragment.append(mapPinElement);
                console.log(mapPinElement);
            }

            return mapPinFragment;
        },

        //Функция отрисовки меток на карте
        renderMapPins: function (element) {
            let mapPins = document.querySelector('.map__pins');
            mapPins.append(element);
        }
    };
})();