'use strict';

const NUMBER_OF_ADVERTISEMENTS = 8;
const PIN_SIZE = {
    WIDTH: 50,
    HEIGHT: 70
}
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
        MIN : 300,
        MAX : 1200
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
        mapPinElement.style.top = similarAdvertisementsData[i].location.y + 'px'; //кривое условие задачи, если делать как просят с изменением координаты метки, то метка может улететь в небеса
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
    for (let i = 0; i < similarAdvertisementsData[0].offer.photos.length; i++) {
        let photoElement = advertisementPhotos.cloneNode(true);
        photoElement.src = similarAdvertisementsData[0].offer.photos[i];

        photosFragment.append(photoElement);
    }

    return photosFragment;
}

//Функция определения удобств в данном предложении
/*function getAdvertisementFeatures(features, startAdvertisement) {
    //Выбираем удобства, которые нужно удалить из разметки
    let advertisementFeatures = ADVERTISEMENTS_DATA.OFFER_FEATURES.slice();
    for (let i = advertisementFeatures.length - 1; i >= 0; i--) {
        for (let j = features.length - 1; j >= 0; j--) {
            if (advertisementFeatures[i] === features[j]) {
                advertisementFeatures.splice(i, 1);
            }
        }
    }

    //Формируем нужное название класса для поиска
    for (let i = 0; i < advertisementFeatures.length; i++) {
        advertisementFeatures[i] = '.popup__feature--' + advertisementFeatures[i];
    }

    for (let i = 0; i < advertisementFeatures.length; i++) {
        startAdvertisement.querySelector(advertisementFeatures[i]).remove();
    }

    return startAdvertisement;
}*/

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
    startAdvertisement.querySelector('.popup__title').textContent = similarAdvertisementsData[0].offer.title;
    startAdvertisement.querySelector('.popup__text--address').textContent = similarAdvertisementsData[0].offer.address; //с адресом что-то не то
    startAdvertisement.querySelector('.popup__text--price').textContent = `${similarAdvertisementsData[0].offer.price}₽/ночь`;
    startAdvertisement.querySelector('.popup__type').textContent = typeMap[similarAdvertisementsData[0].offer.type];
    startAdvertisement.querySelector('.popup__text--capacity').textContent = `${similarAdvertisementsData[0].offer.rooms} комнаты для ${similarAdvertisementsData[0].offer.guests} гостей`;
    startAdvertisement.querySelector('.popup__text--time').textContent = `Заезд после ${similarAdvertisementsData[0].offer.checkin}, выезд до ${similarAdvertisementsData[0].offer.checkout}`;
    startAdvertisement.querySelector('.popup__features').innerHTML = '';
    startAdvertisement.querySelector('.popup__features').append(getAdvertisementFeatures(similarAdvertisementsData[0].offer.features));
    startAdvertisement.querySelector('.popup__description').textContent = similarAdvertisementsData[0].offer.description;//по заданию описание пустое
    startAdvertisement.querySelector('.popup__photo').remove();
    startAdvertisement.querySelector('.popup__photos').append( getAdvertisementPhotos(similarAdvertisementsData) );
    startAdvertisement.querySelector('.popup__avatar').src = similarAdvertisementsData[0].author.avatar;

    document.querySelector('.map__filters-container').before(startAdvertisement);
}

//Главная функция, собирающая все отрисовки
function renderSimilarAdvertisements(similarAdvertisementsData) {
    renderMapPins( getPinsOnMap(similarAdvertisementsData) );

    renderStartAdvertisement(similarAdvertisementsData);

}

//Временное решение показа DOM элемента
let map = document.querySelector('.map');
map.classList.remove('map--faded');

renderSimilarAdvertisements( makeArrayOfRandomAdvertisements() );


