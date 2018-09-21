Utils.CoreApp.gameApp.service("statisticHelper", [
    function () {
        "use strict";


        function clickableModel(onClick, onHovered) {
            var m = {
                onHover: onHovered||null,
                hasOnclick:  false,
                _onClick: onClick || null
            };

            Object.defineProperty(m, "onClick", {
                get: function () { return m._onClick },
                set: function (val) {
                    if (val) {
                        m._onClick = val;
                        m.hasOnclick = true;
                        if (!m.onHover) {
                            m.onHover = function ($event) { EM.Audio.GameSounds.defaultHover.play(); }
                        }
                    } else {
                        m.hasOnclick = false; 
                        m._onClick = null; 
                        m.onHover = null; 
                    }
                }
            });
            return m;
        }

        function imgModel(onClick, onHovered) {
            var model = clickableModel(onClick, onHovered);
            model.title = "";
            model.style = "";
            model.css = "";
            model.isImg = false;
            model.isBgImage = false;
            model.url = "";
            model.alt = "";
            model.hasContent = false;
            model.templateUrl = null;
            model.setTemplate = function (templateUrl) {
                model.hasContent = true;
                model.templateUrl = templateUrl;
            };


            return model;
        }

        /**
         * измеряет ширину и высоту исходного изображения  (в px) изменяет backgroundSize  в % отношении так,
         *  чтобы наименьшая сторона стала 100%, сохраняет пропорции. но центрирует и обрезает края,
         *  если пропорции отличаются более чем в 2 раза назначает backgroundSize по умолчанию  - "contain", или если передан defaultBgs
         * расчет ведется исходя из того что целевая фигура- квадрат
         * пропрция считаяется исходя из ширины/высоту img.width/img.height
         * @param {object} styleModel 
         * @param {string} url 
         * @param {string||null} defaultBgs присваивает по умолчанию значение backgroundSize  если не нулл  и если пропорции <0.5||>2;  default : "contain" 
         * @returns {void} null
         */
        this.resizePictire = function (styleModel, url, defaultBgs) {
            var img = new Image();
            img.src = url;
            img.onload = function (e) {
                var x = img.width;
                var y = img.height;
                var srcProportion = x / y;

                function dispose() {
                    img = null;
                }
                if (srcProportion === 1) return dispose();
                if (srcProportion > 2 || srcProportion < 0.5) {
                    styleModel.backgroundSize =defaultBgs|| "contain";
                    return dispose();
                }
                var k = (x < y) ? y / x : x / y;
                styleModel.backgroundSize = k * 100 + "%";
                return dispose();
            };
        }
 

        /**
        * Создает модель для  тега  img в StatisticModel.image
        * @param {string} url 
        * @param {string||null} alt 
        * @param {string||null} title 
        * @param {string||null} css 
        * @param {string||null} style 
        * @param {bool||null} hasOnclick default false
        * @param {function||null} onClick default null
        * @returns {object} модель image для  StatisticModel.image  как для тега  img
        */
        this.createImg = function (url, alt, title, css, style, onClick, onHovered) {
            var model = imgModel(onClick, onHovered);
            model.isImg = true;
            model.url = url;
            model.alt = alt;
            model.title = title;
            model.css = css;
            model.style = style;
            return model;
        };

        /**
        * Создает модель для  назначения background-image контейнеру для спрайта в модели  StatisticModel.image
        * @param {string} css 
        * @param {string||null} title 
        * @param {string||null} style 
        * @param {bool||null} hasOnclick default false
        * @param {function||null} onClick default null
        * @returns {object} модель image для  StatisticModel.image
        */
        this.createBgImage = function (css, title, style, onClick, templateUrl, onHovered) {
            var model = imgModel(onClick, onHovered);
            model.isBgImage = true;
            model.css = css;
            model.title = title;
            model.style = style;
            model.setTemplate(templateUrl);
            
            return model;
        }

        /**
         * создает экземляр модели для директивы statistic
         * @param {array} statsItems [StatItemModel,StatItemModel,StatItemModel,StatItemModel]
         * @param {object} imageModel   (imgModel)
         * @returns {object} statisticModel
         */
        this.createStatisticModel = function (statsItems, imageModel) {
            return {
                stats: statsItems,
                image: imageModel
            };
        };
        /**
         * Создает эллемет статистики для директывы statistic, является элементом масива stats в модели statisticModel
         * @param {string} key отображаемое имя свойства
         * @param {string} val отображаемое значение свойства 
         * @param {string||null} advancedCss стили или стиль для контейнера свойства
         * @param {string||null} advancedCssKey стили или стиль для контейнера имени свойства (дочерный эллемет)
         * @param {string||null} advancedCssVal стили или стиль для контейнера значения свойства (дочерный эллемет)
         * @param {bool||null} hasOnclick default false задает параметр будет ли контейнер кликабельным или нет
         * @param {function||null} onClick default null фцнкция которая должна отработать если есть клик
         * @returns {object} StatItem   (StatisticModel.stats[StatItem])
         */
        this.createStatItemModel = function (key, val, advancedCss, advancedCssKey, advancedCssVal, onClick, onHover) {
            var model = clickableModel(onClick, onHover);
            model.key = key;
            model.val = val;
            model.advancedCss = advancedCss;
            model.advancedCssKey = advancedCssKey;
            model.advancedCssVal = advancedCssVal;
            return model;
        }

    }
]);