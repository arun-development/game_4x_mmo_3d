function HomeCarousel() {
    var webP = Modernizr.webp;

    if (!$("#home-carousel").length > 0) {
        return;
    }


    var collectionString = $("#imgCollection").data("collection");
    if (!webP) { 
        collectionString = collectionString.replace(/webp/gi, "jpg");

        console.log(collectionString);
    }
    var collection = collectionString.split(",");

    var slidesBlock = $("#home-carousel").find(".carousel-inner:first");
    var indicatorsBlock = $("#imgNav");


    var attrAlt = " alt=\"";
    var attrTitle = " title=\"";
    var attrBigSlide = " data-index=\"";
    var attrIndicator = " data-target=\"#home-carousel\" data-slide-to=\"";
    var attrSrc = " src=\"";
    var attrGroup = " data-group=\"";
    var closeAttr = "\" ";


    function correctGroupIndex(index, min, max) {
        return (index < min) ? min :
        (max < index) ? max : index;
    }

    function getGroupCollection(baseCollection) {
        var objecCollection = [];
        var counterGroup = 0;
        var count = 6;
        for (var m = 0; m < baseCollection.length; m++) {
            if (m === 0) {
                count = 6;
            }

            if (!objecCollection[counterGroup]) {
                objecCollection[counterGroup] = [];
            }

            var item = baseCollection[m];
            item.dataGroup = attrGroup + counterGroup + closeAttr;

            objecCollection[counterGroup].push(item);

            count--;

            if (count === 0) {
                counterGroup++;
                count = 6;
            }
        }

        return objecCollection;
    }

    function getItemCollection(itemsCollection) {
        var itemCollection = [];
        for (var i = 0; i < itemsCollection.length; i++) {


            var url = itemsCollection[i];
            var fileName = getFileName(url, 4);
            var minFileUrl = getMinFile(url);

            itemCollection[i] = {
                alt: attrAlt + fileName + closeAttr,
                title: attrTitle + fileName + closeAttr,
                targetImage: attrSrc + url + closeAttr,
                indicatorImage: attrSrc + minFileUrl + closeAttr,
                dataBigSlide: attrBigSlide + i + closeAttr,
                dataIndicator: attrIndicator + i + closeAttr,
                dataGroup: null
            };
        }
        return itemCollection;
    }

    function bigSlideTemplate(params) {
        var template = "<div class=\"item\"" + params["dataBigSlide"] + params["dataGroup"] + "><img " + params["targetImage"] + params["alt"] + params["title"] + "></div>";

        //    template = $("<div/>", {
        //        "class": "item",
        //        params[]:

        //});
        return template;
    }

    function indicatorTemplate(params) {
        var template = "<div class=\"transition col-xs-2 col-md-2\"" + params["dataIndicator"] + params["dataGroup"] + " style=\"left:0%;\"><a class=\"thumbnail\"><img " + params["indicatorImage"] + params["alt"] + params["title"] + "></a></div>";

        return template;
    }

    function creteView(group) {
        function buildHtml(_group, handler) {
            var view = "";

            for (var i = 0; i < _group.length; i++) {
                var params = group[i];

                view += handler(params);
            }
            return view;
        };

        var bigSliders = buildHtml(group, bigSlideTemplate);
        var indicators = buildHtml(group, indicatorTemplate);

        slidesBlock.append(bigSliders);
        indicatorsBlock.append(indicators);
    }

    function existsGroup(group) {
        var items = slidesBlock.find('[data-group=' + group + ']');

        if (0 < items.length) {
            return true;
        }

        return false;
    }

    function existsNextIndex(index) {
        var items = slidesBlock.find('[data-index=' + index + ']');

        if (0 < items.length) {
            return true;
        }

        return false;
    }

    function animateDirection(targetGroupIndex) {
        var rateOffset = 1 / 6;
        var collectionOffset = targetGroupIndex * 600 * rateOffset;
        $("[data-slide-to]").css("left", "-" + collectionOffset + "%");

    }

    var itemCollection = getItemCollection(collection);
    var workCollection = getGroupCollection(itemCollection);

    (function() {
        if ($("#home_scroller")) {
            creteView(workCollection[0]);
            $("[data-index=0]").addClass("active");
            $("[data-slide-to=0]").addClass("active");
        }

    })();


    $("#home-carousel").find(".left").on("click", function() {
        var currIndex = $("#home-carousel").find(".active[data-index]").data("index");

        if (0 === currIndex) {
            return false;
        }
    });

    var isLastElem = false;

    $("#home-carousel").on("slide.bs.carousel", function(event, state) {
        var direction = 0;

        switch (event.direction) {
        case 'left':
            direction = 1;
            break;

        case 'right':
            direction = -1;
            break;

        default:
            direction = 0;
        }

        var currSlide = event.relatedTarget;
        var currIndex = $(currSlide).data("index");
        var currGroup = $(currSlide).data("group");


        $("[data-slide-to]").removeClass("active");
        $("[data-slide-to=" + currIndex + "]").addClass("active");

        var nextGroup = correctGroupIndex((currGroup + direction), 0, (workCollection.length - 1));

        var currGroupCount = workCollection[currGroup].length;
        var firstIndex = (currGroup * currGroupCount);
        var lastIndex = (currGroup * currGroupCount) + (currGroupCount - 1);

        if (!existsGroup(nextGroup)) {
            creteView(workCollection[nextGroup]);
        }

        if ((currIndex === firstIndex || currIndex === lastIndex)) {
            animateDirection(nextGroup);
        }

        if (!existsNextIndex(currIndex + 1)) {
            isLastElem = true;

        } else if (direction > 0 && isLastElem) {
            animateDirection(0);
            isLastElem = false;
        }
    });
}; 

function getFileName(url, prefixCount) {
    var pos = url.lastIndexOf('/');

    if (pos === -1) {
        return '';
    }

    var fileName = url.slice(pos + 1 + prefixCount, -4);

    fileName = fileName.toLowerCase().replace(/\b[a-zа-я]/g, function(letter) {
        return letter.toUpperCase();
    });

    return fileName;
}

function getMinFile(url) {
    var pos = url.lastIndexOf('/');

    if (pos === -1) {
        return "";
    } 
    var dir = url.slice(0, pos);
    var fileName = url.slice(pos + 1);  
    return dir + "/min/" + fileName;
};  