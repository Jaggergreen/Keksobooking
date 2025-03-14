'use strict';

//Модуль создания карточки объявления
(function() {
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

    //Функция отрисовки выбранной карточки предложения
    window.card = {
        renderSelectedAdvertisement: function (similarAdvertisementsData){
            let mapCard = document.querySelector('template').content.querySelector('.map__card');
            let selectedAdvertisement = mapCard.cloneNode(true);
            selectedAdvertisement.querySelector('.popup__title').textContent = similarAdvertisementsData.offer.title;
            selectedAdvertisement.querySelector('.popup__text--address').textContent = similarAdvertisementsData.offer.address;
            selectedAdvertisement.querySelector('.popup__text--price').textContent = `${similarAdvertisementsData.offer.price}₽/ночь`;
            selectedAdvertisement.querySelector('.popup__type').textContent = window.data.typeMap[similarAdvertisementsData.offer.type];
            selectedAdvertisement.querySelector('.popup__text--capacity').textContent = `${similarAdvertisementsData.offer.rooms} комнаты для ${similarAdvertisementsData.offer.guests} гостей`;
            selectedAdvertisement.querySelector('.popup__text--time').textContent = `Заезд после ${similarAdvertisementsData.offer.checkin}, выезд до ${similarAdvertisementsData.offer.checkout}`;
            selectedAdvertisement.querySelector('.popup__features').innerHTML = '';
            if (similarAdvertisementsData.offer.features) {
                selectedAdvertisement.querySelector('.popup__features').append(getAdvertisementFeatures(similarAdvertisementsData.offer.features));
            }
            selectedAdvertisement.querySelector('.popup__description').textContent = similarAdvertisementsData.offer.description;
            selectedAdvertisement.querySelector('.popup__photo').remove();
            if (similarAdvertisementsData.offer.photos) {
                selectedAdvertisement.querySelector('.popup__photos').append(getAdvertisementPhotos(similarAdvertisementsData));
            }
            selectedAdvertisement.querySelector('.popup__avatar').src = similarAdvertisementsData.author.avatar;

            document.querySelector('.map__filters-container').before(selectedAdvertisement);
        }
    };
})();
