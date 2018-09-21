using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Server.Core.Interfaces.ForModel;
using Server.Core.Interfaces.World;
using Server.Core.StaticData;
using Server.DataLayer;
using Server.Services.AdvancedService;
using Server.Services.OutModel;

namespace Server.Services.UserService
{
    public partial class GUserBookmarkService
    {
 
 
        #region Sync

        public object AddBookmark(IDbConnection connection, BookmarkOut bm, int currentUserId, bool hasPremium,
            IMapInfoService mapInfoService, IGGeometryPlanetService geometryPlanetService, ISystemService systemService, IGSectorsService gSectorsService)
        {
            _saveNewBookmark(connection, bm, currentUserId, hasPremium, geometryPlanetService, systemService, gSectorsService);
            if (bm.IsFull) return GetPlanshetViewData(connection, mapInfoService, currentUserId);

            if (string.Equals(BookmarkOut.Planet, bm.TypeName, StringComparison.CurrentCultureIgnoreCase))
            {
                var item = GetUserBookmark(connection, currentUserId, bm.TypeId, bm.ObjectId);
                var outData = mapInfoService.GetPlanetOutData(connection, item, currentUserId);
                if (outData == null) throw new Exception(Error.NoData);
                return outData;
            }

            if (string.Equals(BookmarkOut.Star, bm.TypeName, StringComparison.CurrentCultureIgnoreCase))
            {
                var item = GetUserBookmark(connection, currentUserId, bm.TypeId, bm.ObjectId);
                var outData = mapInfoService.GetSystemOutData(connection, item);
                if (outData == null) throw new Exception(Error.InputDataIncorrect);
                return outData;
            }

            if (string.Equals(BookmarkOut.Sector, bm.TypeName, StringComparison.CurrentCultureIgnoreCase))
            {
                var item = GetUserBookmark(connection, currentUserId, bm.TypeId, bm.ObjectId);
                var outData = mapInfoService.GetSectorOutData(connection, item);
                if (outData == null) throw new Exception(Error.NoData);
                return outData;
            }
            throw new NotImplementedException();
        }

        private bool _isFull(IDbConnection connection, int currentUserId, bool hasPremium)
        {
            var maxBookmarkCount = hasPremium ? GameMathStats.PremiumBookmarkLimit : GameMathStats.BaseBookmarkLimit;
            var bookmarks = GetUserBookmarks(connection, currentUserId);
            var isFull = (bookmarks.Count >= maxBookmarkCount);
            return isFull;
        }

        private void _saveNewBookmark(IDbConnection connection, BookmarkOut bm, int currentUserId, bool hasPremium, IGGeometryPlanetService geometryPlanetService, ISystemService systemService, IGSectorsService gSectorsService)
        {
            var hasData = false;
            if (_isFull(connection, currentUserId, hasPremium)) throw new Exception(Error.BookMarkLimitDone);

            if (string.Equals(BookmarkOut.Planet, bm.TypeName, StringComparison.CurrentCultureIgnoreCase))
            {
                var planetTypeId =   geometryPlanetService.GetPlanetType(connection, bm.ObjectId);
                if (planetTypeId == 0) throw new Exception(Error.InputDataIncorrect);
                hasData =
                (GetUserBookmark(connection, currentUserId, planetTypeId, bm.ObjectId) !=
                 null);
                bm.TypeId = planetTypeId;
            }

            else if (string.Equals(BookmarkOut.Star, bm.TypeName, StringComparison.CurrentCultureIgnoreCase))
            {
                var starTypeId = systemService.GetDetailSystemBySystemId(connection, bm.ObjectId, i => i.TypeId);

                if (starTypeId == 0) throw new Exception(Error.InputDataIncorrect);
                hasData = (GetUserBookmark(connection, currentUserId, starTypeId, bm.ObjectId) != null);
                bm.TypeId = starTypeId;
            }

            else if (string.Equals(BookmarkOut.Sector, bm.TypeName, StringComparison.CurrentCultureIgnoreCase))
            {
                var sectorTypeId = gSectorsService.GetById(connection, (short) bm.ObjectId, i => i.TypeId);
                if (sectorTypeId == 0) throw new Exception(Error.InputDataIncorrect);

                hasData = (GetUserBookmark(connection, currentUserId, sectorTypeId, bm.ObjectId) != null);
                bm.TypeId = sectorTypeId;
            }
            else
            {
                throw new NotImplementedException();
            }

            if (hasData)
                throw new Exception(Error.BookmarkIsExist);
            AddOrUpdate(connection,new UserBookmarkDataModel
            {
                UserId = currentUserId,
                TypeId = bm.TypeId,
                ObjectId = bm.ObjectId
            });
        }


        public bool DeleteItem(IDbConnection connection, BookmarkOut bm, int currentUserId)
        {
            var bookmark = GetUserBookmarkById(connection, currentUserId, bm.Id);
            Delete(connection,bookmark.Id);
            return true;
        }

        public IPlanshetViewData GetPlanshetViewData(IDbConnection connection, IMapInfoService mapInfoService, int currentUserId)
        {
            var bookmarks = GetUserBookmarks(connection, currentUserId);
            bookmarks = bookmarks.OrderByDescending(i => i.Id).ToList();

            var planets = new List<PlanetInfoOut>();
            var stars = new List<StarInfoOut>();
            var sectors = new List<SectorInfoOut>();

            #region For

            var types = _gameTypeService.GetAllGGameTypes(connection);

            foreach (var item in bookmarks)
            {
                var type = types.Single(i => i.Id == item.TypeId);
                var typeName = type.Type;

                #region Planet Type

                if (typeName == BookmarkOut.Planet)
                {
                    var planetOutData = mapInfoService.GetPlanetOutData(connection, item, currentUserId);
                    if (planetOutData == null) continue;
                    planets.Add(planetOutData);
                }

                #endregion

                #region StarType

                if (typeName == BookmarkOut.Star)
                {
                    var outSystemData = mapInfoService.GetSystemOutData(connection, item);
                    if (outSystemData == null) continue;
                    stars.Add(outSystemData);
                }

                #endregion

                #region SectorType

                if (typeName != BookmarkOut.Sector) continue;

                var sectorOutData = mapInfoService.GetSectorOutData(connection, item);
                if (sectorOutData == null) continue;
                sectors.Add(sectorOutData);

                #endregion
            }

            #endregion

            var tabs = mapInfoService.InitialTabs(planets, stars, sectors);
            return tabs;
        }

        #endregion
    }
}