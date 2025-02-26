'use strict';

//Различные вспомогательные функции
(function () {
    const KEY_CODES = {
        ENTER: 13,
        ESC: 27
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
        }
    };
})();