using System;
using System.Data;
using Server.Core.Images;
using Server.Core.СompexPrimitive;
using Server.Core.СompexPrimitive.Resources;
using Server.DataLayer;
using Server.Modules.Localize;
using Server.Services.GameObjects.BuildModel.View;

namespace Server.Services.GameObjects.BuildModel.BuildItem
{
    public interface ILaboratoryBuild : IBuild, IShopable
    {
    }

    public class LaboratoryBuild : Build, ILaboratoryBuild
    {
        public static readonly string NativeName = BuildNativeNames.LaboratoryBuild.ToString();
        private static readonly BasePrice _bp = new BasePrice(50, 20, 10, 3, 10);
        private static readonly SpriteImages _images = new SpriteImages().BuildImages(NativeName);
        private readonly LangField _text = new LangField("LaboratoryBuild name", "LaboratoryBuild description");

        public string Test(string message = "Ok")
        {
            return message;
        }

        #region Members

        #region Price and Calculate

        public int CalcCcCurrentPrice(int level)
        {
            throw new NotImplementedException();
        }

        public BasePrice CalcPrice(int level, bool premium)
        {
            throw new NotImplementedException();
        }


        public BasePrice DefaultPrice()
        {
            return _bp;
        }

        #endregion

        #region Get ViewModel

        public BuildItemUnitView GetViewModel(ItemProgress buildProgress, bool premiumIsActive,
            StorageResources resources = null)
        {
            throw new NotImplementedException();
        }

        #endregion

        #region Upgrade

        public int UpgradeForCc(IDbConnection connection, GDetailPlanetDataModel planet, int userId, bool premiumIsActive, BuildUpgrade preResult, IServiceProvider resolver)
        {
            throw new NotImplementedException();
        }

        public ItemProgress Upgraded(IDbConnection connection, GDetailPlanetDataModel planet, int userId, bool premiumIsActive, IServiceProvider resolver)
        {
            throw new NotImplementedException();
        }

        #endregion

        #endregion
    }
}