'use strict';

(function () {

    const URL = 'https://32.javascript.htmlacademy.pro/keksobooking';
    const dataURL = 'https://32.javascript.htmlacademy.pro/keksobooking/data'

    window.backend = {
        download: function (onLoad, onError) {
            let xhr = new XMLHttpRequest();
            xhr.responseType = 'json';

            xhr.addEventListener('load', function () {
               if (xhr.status === 200) {
                   onLoad(xhr.response);
               } else {
                   onError('Статус ответа сервера: ' + xhr.status + ' ' + xhr.statusText);
               }
            });

            xhr.addEventListener('error', function () {
                onError('Произошла ошибка соединения');
            });

            xhr.addEventListener('timeout', function () {
                onError('Время ожидания вышло! Запрос не успел выполниться за ' + xhr.timeout + 'мс');
            });

            xhr.timeout = 10000;


            xhr.open('GET', dataURL);
            xhr.send();
        },

        save: function (data, onLoad, onError) {
            let xhr = new XMLHttpRequest();
            xhr.responseType = 'json';

            xhr.addEventListener('load', function () {
                if (xhr.status === 200) {
                    onLoad(xhr.response);
                } else {
                    onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
                }
            });

            xhr.open('POST', URL);
            xhr.send(data);
        }
    }
})();