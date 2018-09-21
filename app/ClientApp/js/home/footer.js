function changeFooterPosition() {
    var bodyHeight = getBodyHeight();
    var windowHeight = getWindowHeight();
    if ('fixed' === $('#footer').css('position')) {
        bodyHeight = bodyHeight + getFooterHeight();
    }

    if (bodyHeight < windowHeight) {
        $('#footer').addClass('down_footer');

    } else {
        $('#footer').removeClass('down_footer');
    }
}

function getBodyHeight() {
    return document.body.offsetHeight;
}

function getWindowHeight() {
    return document.documentElement.clientHeight;
}

function getFooterHeight() {
    return document.getElementById('footer').clientHeight;
}
