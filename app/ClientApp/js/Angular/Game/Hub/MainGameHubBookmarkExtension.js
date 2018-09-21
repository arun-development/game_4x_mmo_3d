Utils.CoreApp.gameAppExtensions.HubBookmark = function (hubService, client, server) {

    // old BookmarkGetList
    /**
     * 
    * @returns {object} signalR deffered => bool see server  PlanshetViewData
     */
    hubService.bookmarkGetPlanshet = function() {
        return server.bookmarkGetPlanshet();
    };

    /**
     * 
     * @param {object} bookmarkOutModel  see Utils.ModelFactory.BookmarkOut   or server    BookmarkOut  
     * @returns {object}  signalR deffered  => object see server  PlanetInfoOut || StarInfoOut || SectorInfoOut
     */   
    hubService.bookmarkAddBookmark = function (bookmarkOutModel) {
        return server.bookmarkAddBookmark(bookmarkOutModel);
    };

    /**
   * 
   * @param {object} bookmarkOutModel  see Utils.ModelFactory.BookmarkOut   or server    BookmarkOut
   * @returns {object}  signalR deffered => bool
   */
    hubService.bookmarkDeleteItem = function (bookmarkOutModel) {
        return server.bookmarkDeleteItem(bookmarkOutModel);
    };

 

}