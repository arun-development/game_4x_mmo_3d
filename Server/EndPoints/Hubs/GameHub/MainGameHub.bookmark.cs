using System;
using System.Threading.Tasks;
using Server.Core.Interfaces.ForModel;
using Server.Services.OutModel;

namespace Server.EndPoints.Hubs.GameHub
{
    public partial class MainGameHub
    {
        /// <summary>
        /// </summary>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotExist</exception>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotConnected</exception>
        /// <returns></returns>
        public async Task<IPlanshetViewData> BookmarkGetPlanshet()
        {
            return await _contextAction(connection =>
            {
                var cr = _getCurrentUser(connection);
                return _gUserBookmarkService.GetPlanshetViewData(connection, _mapInfoService, cr.UserId);
            });
        }


        /// <summary>
        /// </summary>
        /// <param name="bm"></param>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotExist</exception>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotConnected</exception>
        /// <returns></returns>
        public async Task<object> BookmarkAddBookmark(BookmarkOut bm)
        {
            return await _contextAction(connection =>
            {
                var cr = _getCurrentUser(connection);
                var crPremium = cr.GetPremiumDataModel(connection, _storeService);
                var hasPremium = !crPremium.Finished;
                return
                    _gUserBookmarkService.AddBookmark(connection, bm, cr.UserId, hasPremium, _mapInfoService,
                        _gGeometryPlanetService, _systemService, _gSectorsService);
            });
        }

        /// <summary>
        /// </summary>
        /// <param name="bm"></param>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotExist</exception>
        /// <exception cref="ArgumentNullException">Error.ConnectionUserNotConnected</exception>
        /// <returns></returns>
        public async Task<bool> BookmarkDeleteItem(BookmarkOut bm)
        {
            return await _contextAction(connection =>
            {
                var cr = _getCurrentUser(connection);
                return _gUserBookmarkService.DeleteItem(connection, bm, cr.UserId);
            });
        }
    }
}