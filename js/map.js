'use strict';

const NUMBER_OF_ADVERTISEMENTS = 8;
const PIN_SIZE = {
    WIDTH: 50,
    HEIGHT: 70
}
const pinMainSize = {
    width: 65,
    height: 65
}
const KEY_CODES = {
    ENTER: 13,
    ESC: 27
}
const map = document.querySelector('.map');
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
        MIN : PIN_SIZE.WIDTH / 2,
        MAX : map.offsetWidth - PIN_SIZE.WIDTH / 2,
    },
    LOCATION_Y : {
        MIN : 130,
        MAX : 630,
    }
}
const typeMap = {
    'palace': 'Дворец',
    'flat': 'Квартира',
    'house': 'Дом',
    'bungalo': 'Бунгало'
}
const adForm = document.querySelector('.ad-form');
const adFormHeader = adForm.querySelector('.ad-form-header');
const adFormElement = adForm.querySelectorAll('.ad-form__element');
const mapPinMain = map.querySelector('.map__pin--main');
const address = adForm.querySelector('#address');


adFormHeader.disabled = true;
adFormElement.forEach((element) => {element.disabled = true});
address.defaultValue = Math.round(mapPinMain.offsetLeft - mapPinMain.offsetWidth / 2) + ', ' + Math.round(mapPinMain.offsetTop - mapPinMain.offsetHeight / 2);

//Функция активации страницы поиска похожих объявлений
function initMap() {
    adFormHeader.disabled = false;
    adFormElement.forEach((element) => {element.disabled = false});
    map.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
}

//функция нахождения рандомного целого числа в интервале min/max
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//функция получения упорядоченного массива чисел по возрастанию от start до end
function getConsistentArray(start, end) {
    let array = [];
    for (let i = start; i <= end; i++) {
        array.push(i);
    }

    return array;
}

//функция перетасовывания массива
function makeShuffleArray(array) {
    let newArray = array.slice();
    for (let i = newArray.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }

    return newArray;
}

//функция получения массива случайной длины (в сторону уменьшения) из исходного
function makeCutArray(array) {
    let newArray = array.slice();
    return newArray.slice(0, getRandomInt(1, newArray.length));
}

//Функция создания массива похожих объявлений
function makeArrayOfRandomAdvertisements() {
    let advertisements = [];
    const avatarNumbers = makeShuffleArray( getConsistentArray(1, NUMBER_OF_ADVERTISEMENTS) ); //перетасовываем массив номеров для адресов аватарок
    const titles = makeShuffleArray(ADVERTISEMENTS_DATA.OFFER_TITLES); //перетасовываем изначальный массив заголовков предложений
    for (let i = 0; i < NUMBER_OF_ADVERTISEMENTS; i++) {
        let advertisementObject = {
            author : {
                avatar: 'img/avatars/user0' + avatarNumbers[i] + '.png'
            },
            offer : {
                title : titles[i],
                price : getRandomInt(ADVERTISEMENTS_DATA.OFFER_PRICES.MIN, ADVERTISEMENTS_DATA.OFFER_PRICES.MAX),
                type : ADVERTISEMENTS_DATA.OFFER_TYPES[getRandomInt(0, ADVERTISEMENTS_DATA.OFFER_TYPES.length - 1)],
                rooms : getRandomInt(ADVERTISEMENTS_DATA.OFFER_ROOMS.MIN, ADVERTISEMENTS_DATA.OFFER_ROOMS.MAX),
                checkin : ADVERTISEMENTS_DATA.OFFER_CHECKS[getRandomInt(0, ADVERTISEMENTS_DATA.OFFER_CHECKS.length - 1)],
                checkout : ADVERTISEMENTS_DATA.OFFER_CHECKS[getRandomInt(0, ADVERTISEMENTS_DATA.OFFER_CHECKS.length - 1)],
                features : makeCutArray( makeShuffleArray(ADVERTISEMENTS_DATA.OFFER_FEATURES) ),
                description : '',
                photos : makeShuffleArray(ADVERTISEMENTS_DATA.OFFER_PHOTOS)
            },
            location : {
                x : getRandomInt(ADVERTISEMENTS_DATA.LOCATION_X.MIN, ADVERTISEMENTS_DATA.LOCATION_X.MAX),
                y : getRandomInt(ADVERTISEMENTS_DATA.LOCATION_Y.MIN, ADVERTISEMENTS_DATA.LOCATION_Y.MAX)
            }
        };

        advertisementObject.offer.guests = advertisementObject.offer.rooms * ADVERTISEMENTS_DATA.OFFER_GUESTS;//добавляем в каждый объект возможное количество гостей на основе количества комнат
        advertisementObject.offer.address = `${advertisementObject.location.x}, ${advertisementObject.location.y}`;//добавляем в каждый объект адрес на основе данных location.x, location.y

        advertisements.push(advertisementObject);
    }

    return advertisements;
}

//Функция генерации меток на карте
function getPinsOnMap(similarAdvertisementsData) {
    console.log(similarAdvertisementsData);
    let mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');
    let mapPinFragment = new DocumentFragment();
    for (let i = 0; i < NUMBER_OF_ADVERTISEMENTS; i++) {
        let mapPinElement = mapPinTemplate.cloneNode(true);
        mapPinElement.style.left = similarAdvertisementsData[i].location.x - PIN_SIZE.WIDTH / 2 + 'px';
        mapPinElement.style.top = similarAdvertisementsData[i].location.y - PIN_SIZE.HEIGHT + 'px'; //кривое условие задачи, если делать как просят с изменением координаты метки, то метка может улететь в небеса
        mapPinElement.querySelector('img').src = similarAdvertisementsData[i].author.avatar;
        mapPinElement.querySelector('img').alt = similarAdvertisementsData[i].offer.title;

        mapPinFragment.append(mapPinElement);
    }

    return mapPinFragment;
}

//Функция отрисовки меток на карте
function renderMapPins(element) {
    let mapPins = document.querySelector('.map__pins');
    mapPins.append(element);
}

//Функция добавления фотографий в карточку объявления
function getAdvertisementPhotos(similarAdvertisementsData) {
    let advertisementPhotos = document.querySelector('template').content.querySelector('.popup__photo');
    let photosFragment = new DocumentFragment();
    for (let i = 0; i < similarAdvertisementsData.offer.photos.length; i++) {
        let photoElement = advertisementPhotos.cloneNode(true);
        photoElement.src = similarAdvertisementsData.offer.photos[i];

        photosFragment.append(photoElement);
    }

    return photosFragment;
}

//Упрощенная функция определения удобств в данном предложении
function getAdvertisementFeatures(features) {
    let featureFragment = new DocumentFragment();
    for (let i = 0; i < features.length; i++) {
        let popupFeature = document.createElement('li');
        popupFeature.classList.add('popup__feature');
        popupFeature.classList.add(`popup__feature--${features[i]}`);
        featureFragment.append(popupFeature);
    }

    return featureFragment;
}

//Функция отрисовки выбранной карточки предложения (по условию задания - первой карточки)
function renderStartAdvertisement(similarAdvertisementsData) {
    let mapCard = document.querySelector('template').content.querySelector('.map__card');
    let startAdvertisement = mapCard.cloneNode(true);
    startAdvertisement.querySelector('.popup__title').textContent = similarAdvertisementsData.offer.title;
    startAdvertisement.querySelector('.popup__text--address').textContent = similarAdvertisementsData.offer.address; //с адресом что-то не то
    startAdvertisement.querySelector('.popup__text--price').textContent = `${similarAdvertisementsData.offer.price}₽/ночь`;
    startAdvertisement.querySelector('.popup__type').textContent = typeMap[similarAdvertisementsData.offer.type];
    startAdvertisement.querySelector('.popup__text--capacity').textContent = `${similarAdvertisementsData.offer.rooms} комнаты для ${similarAdvertisementsData.offer.guests} гостей`;
    startAdvertisement.querySelector('.popup__text--time').textContent = `Заезд после ${similarAdvertisementsData.offer.checkin}, выезд до ${similarAdvertisementsData.offer.checkout}`;
    startAdvertisement.querySelector('.popup__features').innerHTML = '';
    startAdvertisement.querySelector('.popup__features').append(getAdvertisementFeatures(similarAdvertisementsData.offer.features));
    startAdvertisement.querySelector('.popup__description').textContent = similarAdvertisementsData.offer.description;//по заданию описание пустое
    startAdvertisement.querySelector('.popup__photo').remove();
    startAdvertisement.querySelector('.popup__photos').append( getAdvertisementPhotos(similarAdvertisementsData) );
    startAdvertisement.querySelector('.popup__avatar').src = similarAdvertisementsData.author.avatar;

    document.querySelector('.map__filters-container').before(startAdvertisement);
}

//Функция открытия карточки метки
const mapPinOpen = function (similarAdvertisementsData, i) {
    const mapCard = map.querySelector('.map__card');
    if (mapCard) {
        mapCard.remove();
    }
    renderStartAdvertisement(similarAdvertisementsData[i]);
    const popupClose = map.querySelector('.popup__close');

    popupClose.addEventListener('click', mapPinClose);
    document.addEventListener('keydown', onMapCardESCPress);
}

//Функция закрытия карточки метки
const mapPinClose = function () {
    const mapCard = map.querySelector('.map__card');
    mapCard.remove();

    document.removeEventListener('keydown', onMapCardESCPress);
}

//Функция обработки нажатия на кнопку ESC
const onMapCardESCPress = function (evt) {
    if (evt.keyCode === KEY_CODES.ESC) {
        mapPinClose();
    }
}

//Функция перемещения пользовательской метки на карте
mapPinMain.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    //Вычисляем координаты за которые мы схватили метку
    let cursorShiftX = evt.clientX - mapPinMain.getBoundingClientRect().left;
    let cursorShiftY = pinMainSize.height - (evt.clientY - mapPinMain.getBoundingClientRect().top);

    const startCoords = {
        x: evt.pageX,
        y: evt.pageY
    }

    //Функция вычисления координат кончика метки
    function getPinMainCoords() {
        const pinCoords = {
            x: mapPinMain.offsetLeft + Math.round(mapPinMain.offsetWidth / 2),
            y: mapPinMain.offsetTop + pinMainSize.height,
        }

        return pinCoords;
    }

    //Функция заполнения поля адреса
    function initAddress() {
        address.value = getPinMainCoords().x + ", " + getPinMainCoords().y;
    }

    const onMapPinMainMouseMove = function (moveEvt) {
        moveEvt.preventDefault();

        const shift = {
            x: startCoords.x - moveEvt.pageX,
            y: startCoords.y - moveEvt.pageY
        }

        if (moveEvt.pageX - cursorShiftX >= map.offsetLeft && moveEvt.pageX + (pinMainSize.width - cursorShiftX) <= (map.offsetWidth + map.offsetLeft)) {
            startCoords.x = moveEvt.pageX;
            mapPinMain.style.left = (mapPinMain.offsetLeft - shift.x) + 'px';
        }

        if (moveEvt.pageY + cursorShiftY >= ADVERTISEMENTS_DATA.LOCATION_Y.MIN && moveEvt.pageY + cursorShiftY <= ADVERTISEMENTS_DATA.LOCATION_Y.MAX) {
            startCoords.y = moveEvt.pageY;
            mapPinMain.style.top = (mapPinMain.offsetTop - shift.y) + 'px';
        }

        initAddress();
    }

    const onMapPinMainMouseUp = function (upEvt) {
        upEvt.preventDefault();
        //console.log(startCoords.x);
        //console.log(startCoords.y);

        initMap();
        initAddress();
        renderSimilarAdvertisements( makeArrayOfRandomAdvertisements() );

        document.removeEventListener('mousemove', onMapPinMainMouseMove);
        document.removeEventListener('mouseup', onMapPinMainMouseUp);
    }

    document.addEventListener('mousemove', onMapPinMainMouseMove);
    document.addEventListener('mouseup', onMapPinMainMouseUp);
})

//Главная функция, собирающая все отрисовки
function renderSimilarAdvertisements(similarAdvertisementsData) {
    let mapPinCollection = map.querySelectorAll('.map__pin:not(.map__pin--main)');

    console.log(mapPinMain.offsetWidth, mapPinMain.offsetHeight);
    console.log(mapPinMain.getBoundingClientRect().width, mapPinMain.getBoundingClientRect().height);
    if (map.querySelector('.map__pin:not(.map__pin--main)')) {
        for (let j = mapPinCollection.length - 1; j >= 0; j--) {
            mapPinCollection[j].remove();
        }
    }

    renderMapPins( getPinsOnMap(similarAdvertisementsData) );

    mapPinCollection = map.querySelectorAll('.map__pin:not(.map__pin--main)');

    for (let i = 0; i < mapPinCollection.length; i++) {
        console.log(mapPinCollection[i].offsetWidth, mapPinCollection[i].offsetHeight);
        console.log(mapPinCollection[i].getBoundingClientRect().width, mapPinCollection[i].getBoundingClientRect().height);
        mapPinCollection[i].addEventListener('click', function (evt) {
            evt.preventDefault();
            mapPinOpen(similarAdvertisementsData, i);
        });
    }
}


