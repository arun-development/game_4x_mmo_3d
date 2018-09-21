Utils.CoreApp.gameApp.service("dropableElementHelper", ["$timeout", function ($timeout) {
    function DropableElement() {
        var openDelay = Utils.Time.DROP_ELEMENT_ANIMATION;
        var st = {
            compileContent: false,
            isOpened: false,
            guid: _.uniqueId("a_setting")
        };

        function close(onDone) {
            st.isOpened = false;
            if (onDone instanceof Function) {
                $timeout(function () {
                    onDone();
                }, openDelay, false);
            }

        }

        function open(onDone) {
            st.compileContent = true;
            if (DropableElement.lastOpenedElement && DropableElement.lastOpenedElement.isOpened) {
                DropableElement.lastOpenedElement.close(function () {
                    st.isOpened = true;
                    DropableElement.lastOpenedElement = st;
                    if (onDone instanceof Function) onDone();
                });
            } else {
                st.isOpened = true;
                DropableElement.lastOpenedElement = st;
                if (onDone instanceof Function) {
                    $timeout(function () {
                        onDone();
                    }, openDelay, false);
                }
            }


        }

        st.open = open;
        st.close = close;
        st.toggle = function (onDone) {
            st.isOpened ? st.close(onDone) : st.open(onDone);
        };

        return st;
    }
    DropableElement.lastOpenedElement = null;

    this.create = function () {
        return new DropableElement();
    };
}]);


