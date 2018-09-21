function HomeResaizer() {
    var winWidth = $(window).width();
    var minWinWidth = 1199;

    function resizeTextContainer(addAttr) {
        var raceSelector = $("#race").find(".row");
        var targetName = "[data-type=text]";
        var items = raceSelector.children();
        var maxHeight = 0;

        items.each(function() {
            var height = $(this).find(targetName).height();

            if (maxHeight < height) {
                maxHeight = height;
            }
        });

        if (addAttr) {
            items.find(targetName).css("height", maxHeight);
        }    
        else {
            items.find(targetName).removeAttr("style");
        }
    }

    if (winWidth > minWinWidth) {
        resizeTextContainer(true);
    }


    $(window).on("resize", function (event) {
       winWidth = event.target.innerWidth;
      (winWidth > minWinWidth)?resizeTextContainer(true):  resizeTextContainer(false);        
    });
    resizeTextContainer(false);


}