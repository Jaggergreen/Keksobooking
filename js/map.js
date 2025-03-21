'use strict';

(function() {

    //Диапазон отрисовки меток
    const LOCATION_RANGE_Y = {
        MIN: 130,
        MAX: 630
    };

    const mapPinMain = window.data.map.querySelector('.map__pin--main')

    //Функция открытия карточки метки
    const mapPinOpen = function (similarAdvertisementsData) {
        const mapCard = window.data.map.querySelector('.map__card');
        if (mapCard) {
            mapCard.remove();
        }
        window.card.renderSelectedAdvertisement(similarAdvertisementsData);
        const popupClose = window.data.map.querySelector('.popup__close');

        popupClose.addEventListener('click', mapPinClose);
        document.addEventListener('keydown', onMapCardESCPress);
    }

    //Функция закрытия карточки метки
    const mapPinClose = function () {
        const mapCard = window.data.map.querySelector('.map__card');
        mapCard.remove();

        document.removeEventListener('keydown', onMapCardESCPress);
    }

    //Функция обработки нажатия на кнопку ESC
    const onMapCardESCPress = function (evt) {
        if (window.utils.isEscKeycode(evt)) {
            mapPinClose();
        }
    }

    //Функция перемещения пользовательской метки на карте
    mapPinMain.addEventListener('mousedown', function (evt) {
        evt.preventDefault();

        //Вычисляем координаты за которые мы схватили метку
        let cursorShiftX = evt.clientX - mapPinMain.getBoundingClientRect().left;
        let cursorShiftY = mapPinMain.offsetHeight - (evt.clientY - mapPinMain.getBoundingClientRect().top);

        const startCoords = {
            x: evt.pageX,
            y: evt.pageY
        };

        //Функция движения мышки с главным маркером
        const onMapPinMainMouseMove = function (moveEvt) {
            moveEvt.preventDefault();

            const shift = {
                x: startCoords.x - moveEvt.pageX,
                y: startCoords.y - moveEvt.pageY
            }

            if (moveEvt.pageX - cursorShiftX >= window.data.map.offsetLeft && moveEvt.pageX + (mapPinMain.offsetWidth - cursorShiftX) <= (window.data.map.offsetWidth + window.data.map.offsetLeft)) {
                startCoords.x = moveEvt.pageX;
                mapPinMain.style.left = (mapPinMain.offsetLeft - shift.x) + 'px';
            }

            if (moveEvt.pageY + cursorShiftY >= LOCATION_RANGE_Y.MIN && moveEvt.pageY + cursorShiftY <= LOCATION_RANGE_Y.MAX) {
                startCoords.y = moveEvt.pageY;
                mapPinMain.style.top = (mapPinMain.offsetTop - shift.y) + 'px';
            }

            window.form.initAddress();
        }

        //Функция отпускания метки
        const onMapPinMainMouseUp = function (upEvt) {
            upEvt.preventDefault();

            window.form.initMap();
            window.form.initAddress();
            renderSimilarAdvertisements( window.data.advertisements );

            document.removeEventListener('mousemove', onMapPinMainMouseMove);
            document.removeEventListener('mouseup', onMapPinMainMouseUp);
        }

        document.addEventListener('mousemove', onMapPinMainMouseMove);
        document.addEventListener('mouseup', onMapPinMainMouseUp);
    })

    //Главная функция, собирающая все отрисовки
    function renderSimilarAdvertisements(similarAdvertisementsData) {
        let mapPinCollection = window.data.map.querySelectorAll('.map__pin:not(.map__pin--main)');

        if (window.data.map.querySelector('.map__pin:not(.map__pin--main)')) {
            for (let j = mapPinCollection.length - 1; j >= 0; j--) {
                mapPinCollection[j].remove();
            }
        }

        window.pin.renderMapPins(window.pin.getPinsOnMap(similarAdvertisementsData));

        mapPinCollection = window.data.map.querySelectorAll('.map__pin:not(.map__pin--main)');

        for (let i = 0; i < mapPinCollection.length; i++) {
            mapPinCollection[i].addEventListener('click', function (evt) {
                evt.preventDefault();
                mapPinOpen(similarAdvertisementsData[i]);
            });
        }
    }
})();


