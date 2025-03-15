'use strict';

//Модуль, работающий с формой нашего объявления
(function () {

    const mapPinMain = window.data.map.querySelector('.map__pin--main');
    const adForm = document.querySelector('.ad-form');
    const adFormHeader = adForm.querySelector('.ad-form-header');
    const adFormElement = adForm.querySelectorAll('.ad-form__element');
    const address = adForm.querySelector('#address');
    const title = adForm.querySelector('#title');
    const price = adForm.querySelector('#price');

    adFormHeader.disabled = true;
    adFormElement.forEach((element) => {
        element.disabled = true
    });
    address.defaultValue = Math.round(mapPinMain.offsetLeft - mapPinMain.offsetWidth / 2) + ', ' + Math.round(mapPinMain.offsetTop - mapPinMain.offsetHeight / 2);

    window.form = {
        //Функция активации страницы поиска похожих объявлений
        initMap: function () {
            adFormHeader.disabled = false;
            adFormElement.forEach((element) => {
                element.disabled = false
            });
            window.data.map.classList.remove('map--faded');
            adForm.classList.remove('ad-form--disabled');
        },

        //Функция заполнения поля адреса
        initAddress: function () {
            address.value = (mapPinMain.offsetLeft + Math.round(mapPinMain.offsetWidth / 2)) + ", " + (mapPinMain.offsetTop + mapPinMain.offsetHeight);
        }
    }

    //Функция отправки корректной формы
    let onSubmitSuccess = function (evt) {
        window.backend.save(new FormData(adForm), function (response) {
            document.querySelector('.success').classList.remove('hidden');
            setTimeout(function () {
                document.querySelector('.success').classList.add('hidden');
            }, 2000);
            adForm.reset();
        }, window.data.onLoadError);

        evt.preventDefault();
    }

    //Функция проверки правильности заполнения заголовка объявления
    let validationTitleInput = function () {
        if (title.validity.tooShort) {
            title.setCustomValidity('Значение должно быть не менее 30-и символов');
        } else if (title.validity.tooLong) {
            title.setCustomValidity('Значение должно быть не более 100 символов');
        } else if (title.validity.valueMissing) {
            title.setCustomValidity('Обязательно для заполнения!');
        } else {
            title.setCustomValidity('');
        }
    }

    //Функция проверки правильности заполнения цены за ночь
    let validationPriceInput = function () {
        if (price.validity.rangeUnderflow) {
            price.setCustomValidity('Цена за ночь должна быть не меньше 1 000');
        } else if (price.validity.rangeOverflow) {
            price.setCustomValidity('Цена за ночь должна быть не больше 1 000 000');
        } else if (price.validity.valueMissing) {
            price.setCustomValidity('Обязательно для заполнения!');
        } else {
            price.setCustomValidity('');
        }
    }

    title.addEventListener('invalid', validationTitleInput);
    price.addEventListener('invalid', validationPriceInput);

    adForm.addEventListener('submit', onSubmitSuccess);
})();