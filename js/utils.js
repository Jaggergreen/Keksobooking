'use strict';

//Различные вспомогательные функции
(function () {
    const KEY_CODES = {
        ENTER: 13,
        ESC: 27
    };

    const GEO_COORDS = {
        X: {
            MIN: 35.65,
            MAX: 35.7
        },
        Y: {
            MIN: 139.69,
            MAX: 139.8
        }
    };

    //Диапазон отрисовки меток
    const LOCATION_RANGE_Y = {
        MIN: 130,
        MAX: 630
    };

    window.utils = {
        //Функция определения нажатия ESC
        isEscKeycode: function (evt) {
            return evt.keyCode === KEY_CODES.ESC;
        },

        //Функция нахождения рандомного целого числа в интервале min/max
        getRandomInt: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
        },

        //Функция получения упорядоченного массива чисел по возрастанию от start до end
        getConsistentArray: function (start, end) {
            let array = [];
            for (let i = start; i <= end; i++) {
                array.push(i);
            }

            return array;
        },

        //Функция перетасовывания массива
        makeShuffleArray: function (array) {
            let newArray = array.slice();
            for (let i = newArray.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * (i + 1));
                [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
            }

            return newArray;
        },

        //Функция получения массива случайной длины (в сторону уменьшения) из исходного
        makeCutArray: function (array) {
            let newArray = array.slice();
            return newArray.slice(0, window.utils.getRandomInt(1, newArray.length));
        },

        //Функция высчитывания координат метки, для ее отрисовки на карте (с учетом того, что приходят данные геопозиции)
        getPositionOnMap: function (lat, lng) {
            let pinCoords;
            pinCoords = {
                x: window.data.map.offsetWidth / (GEO_COORDS.X.MAX - GEO_COORDS.X.MIN) * (lat - GEO_COORDS.X.MIN),
                y: (LOCATION_RANGE_Y.MAX - LOCATION_RANGE_Y.MIN) / (GEO_COORDS.Y.MAX - GEO_COORDS.Y.MIN) * (lng - GEO_COORDS.Y.MIN) + LOCATION_RANGE_Y.MIN
            };

            return pinCoords;
        }
    };
})();