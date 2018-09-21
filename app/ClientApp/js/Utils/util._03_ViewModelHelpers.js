//ViewModelHelpers
Utils.ViewModelHelper = {
    ImageViewHelper: {
        /**
         * @param {string} pathOrCss 
         * @param {string || null} title 
         * @param {string || null} alt 
         * @param {bool || false} isImage 
         * @returns {object} ImageView
         */
        Img: function (pathOrCss, title, alt, isImage) {
            if (!pathOrCss) {
                pathOrCss = "";
            }
            var image = Utils.ModelFactory.ImageView();
            image.ImagePathOrCss = pathOrCss;
            image.IsImage = (isImage);

            if (!title) {
                image.Title = title;
            }
            if (!alt) {
                image.Alt = alt;
            }

            return image;

        }

    }
};