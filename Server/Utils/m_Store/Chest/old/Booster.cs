using System;
using System.Collections.Generic;
using System.Data.Linq;
using System.Linq;
using System.Web.Helpers;
using Newtonsoft.Json;

namespace site.Models.User.Chest
{
    public class Booster
    {
        public Booster()
        {
            Tbl = new SiteDataContext().booster;
        }

        private static Table<booster> Tbl { get; set; }

        public object InitializeBooster(string userId, ChestFields chestItem, StoreItem parameters, int ProductId)
        {
//            SetFinished(userId);


            var boosterData = new BoosterField();
            boosterData.UserId = userId;
            boosterData.UserChestId = chestItem.Id;
            boosterData.StoreProductId = ProductId;
            boosterData.AdvancedImgUrls = parameters.AdvancedImgUrls;

            // todo from properties
            Dictionary<string, dynamic> properties = Json.Decode(parameters.property);
            boosterData.Property = parameters.property;
            boosterData.BasicDuration = properties.ContainsKey("basicDuration") ? properties["basicDuration"] : null;


            if (ExistsActive(userId, ProductId))
//            if (true)
            {
                UpdateActivation(boosterData);
            }
            else
            {
                NewActivate(boosterData);
            }


            return new
            {
                boosterData,
                massage = "Вы активировали бустер такой то"
            };
        }


        protected object NewActivate(BoosterField data)
        {
            var db = new SiteDataContext();

            try
            {
                db.Connection.Open();
                db.Transaction = db.Connection.BeginTransaction();

                var userId = data.UserId;
                var userChestId = data.UserChestId;
                var basicDuration = data.BasicDuration;

                var currDate = DateTime.UtcNow;
                var dateEndTime = currDate.AddSeconds(basicDuration);

                var days = (decimal) data.BasicDuration/(60*60*24);
                var sucsess = "Бустер активирован";

//                var store = new Store();


                var TranslateText = Store.GetTranslate(data.StoreProductId, db);


                var boosterProperty = new
                {
                    TranslateText,
                    Property = Json.Decode(data.Property),
                    AdvancedImgUrls = Json.Decode(data.AdvancedImgUrls)
                };

                //========================================


                db.booster.InsertOnSubmit(new booster
                {
                    userId = userId,
                    storeProductId = data.StoreProductId,
                    user_chestId = userChestId,
                    basicDuration = basicDuration,
                    property = JsonConvert.SerializeObject(boosterProperty),
                    startTime = currDate,
                    endTime = dateEndTime
                });

                db.SubmitChanges();


                var queryUserChest = db.user_chest
                    .Where(uch => uch.Id == userChestId)
                    .Select(uch => uch).Single();
                queryUserChest.dateActivate = currDate;
                queryUserChest.activated = true;
                db.SubmitChanges();


                db.Transaction.Commit();


                return new
                {
                    days = Math.Truncate(days),
                    dateEndTime,
                    sucsess
                };
            }
            catch (Exception)
            {
                db.Transaction.Rollback();

                return new
                {
                    errors = "Rollback"
                };
            }
            finally
            {
                db.Transaction.Dispose();
                db.Connection.Close();
            }
        }

        protected object UpdateActivation(BoosterField data)
        {
            var db = new SiteDataContext();

            try
            {
                db.Connection.Open();
                db.Transaction = db.Connection.BeginTransaction();


                var userId = data.UserId;
                var userChestId = data.UserChestId;
                var storeProductId = data.StoreProductId;
                var basicDuration = data.BasicDuration;
                var currDate = DateTime.UtcNow;


                Cleaner(userId, storeProductId, db);

                var curEndTime = GetMaxEndTime(userId, storeProductId, currDate, db);

                var boosterProperty = GetItemProperty(storeProductId);

                db.booster.InsertOnSubmit(new booster
                {
                    userId = userId,
                    user_chestId = userChestId,
                    storeProductId = storeProductId,
                    basicDuration = basicDuration,
                    property = boosterProperty,
                    startTime = currDate,
                    endTime = currDate.AddSeconds(basicDuration).Add(curEndTime - currDate)
                });
                db.SubmitChanges();

                var userChest = new UserChest();
                userChest.UpdateActivateData(userChestId);

                db.Transaction.Commit();


                return new
                {
                    userId,
                    user_chestId = userChestId,
                    storeProductId,
                    basicDuration,
                    property = boosterProperty,
                    startTime = currDate,
                    endTime = currDate.AddSeconds(basicDuration).Add(curEndTime - currDate)
                };
            }
            catch (Exception)
            {
                db.Transaction.Rollback();
                return new
                {
                    Rollback = "Rollback"
                };
            }
            finally
            {
                db.Transaction.Dispose();
                db.Connection.Close();
            }
        }


        public static bool ExistsActive(string userId, int productId)
        {
            var query =
                Tbl
                    .Where(
                        b =>
                            b.userId == userId && b.finished == false && b.storeProductId == productId &&
                            b.endTime >= DateTime.UtcNow);
            return query.Any();
        }

        protected static object Cleaner(string userId, int productId, SiteDataContext db)
        {
            var inactiveItems = db.booster
                .Where(
                    p =>
                        p.userId == userId && p.finished == false &&
                        (p.storeProductId == productId || p.endTime < DateTime.UtcNow))
                .Select(p => p);

            foreach (var item in inactiveItems)
            {
                UserChest.SetFinalize(item.user_chestId);
                item.finished = true;
            }
            return new
            {
                Cleaner = "Cleaner true"
            };
        }


        protected DateTime GetMaxEndTime(string userId, int storeProductId, DateTime currDate, SiteDataContext db)
        {
            var q = db.booster
                .Where(b => b.userId == userId && b.storeProductId == storeProductId && b.endTime > currDate)
                .Select(b => b.endTime).Max();
            return q;
        }

        public string GetItemProperty(int storeProductId)
        {
            var q = Tbl
                .Where(b => b.storeProductId == storeProductId)
                .Select(b => b.property).First();
            return q;
        }


        public static IQueryable GetUserBoosterInfo(string userId)
        {
            var q =
                Tbl.Where(b => b.userId == userId && b.finished == false && b.endTime > DateTime.UtcNow).Select(b => new
                {
                    property = Json.Decode(b.property),
                    b.endTime
                });

            return q;
        }
    }
}