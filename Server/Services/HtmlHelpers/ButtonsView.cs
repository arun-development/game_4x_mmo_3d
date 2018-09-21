using Server.Core.Images;
using Server.Core.Infrastructure.Unit;
using Server.Core.Interfaces.ForModel;
using Server.Core.СompexPrimitive.Units;
 
using Server.Services.AdvancedService;
using Server.Services.OutModel;

namespace Server.Services.HtmlHelpers
{
    public class ButtonsView : IButtonsView
    {
 
        public const string BaseBtnsKey = "BaseBtnsKey";

        public const string  CssSmall = "small";
        private const string CssMediaTriple = "media-triple";
        private const string CssMediaDouble = "media-double";
        private const string CssMid = "mid";
        private const string CssTabButton = "tab-btn";
        private const string CssXlBtn = "xl-btn";
 


        public string TranslateName { get; set; }

        public string ButtonId { get; set; }
        public string CssClass { get; set; }
 
        public bool ShowName { get; set; }
        public bool ConteinPartial { get; set; }
        public IButtonPartialView PartialView { get; set; }
        public bool IsCssImage { get; set; }
        public string CssImage { get; set; }
        public string Method { get; set; }
        public object Params { get; set; }


        public static IButtonsView SmallDefault(string name, bool showName = false, string buttonId = null,string method = null,object param = null)
        {
            var btn = new ButtonsView
            {
                TranslateName = name,
                CssClass = CssSmall,
                ShowName = showName
            };
            if (method != null)
            {
                btn.Method = method;
            }
            if (param != null)
            {
                btn.Params = param;
            }
            if (!string.IsNullOrWhiteSpace(buttonId))
            {
                btn.ButtonId = buttonId;
            }

            return btn;
        }

        public static IButtonsView ConstructorSizeBtn(int groupCount = 1,
            bool showName = false, string name = null,
            string method = null,
            object param = null,
            string buttonId = null)
        {
            var size = CssXlBtn;
            if (groupCount == 2) size = CssMediaDouble;

            if (groupCount == 3) size = CssMediaTriple;
            if (groupCount == 4) size = CssSmall;

            if (name == null) name = "Ok";
            if (method == null) method = "";

            return new ButtonsView
            {
                TranslateName = name,
                CssClass = size,
                Method = method,
                ShowName = showName,
                Params = param,
                ButtonId = buttonId
            };
        }

        public static IButtonsView HangarToggle()
        {
            //const string name = "HangarBtn";
            var nativeName = "HangarToggle";
            var name = Modules.Localize.Game.Units.Resource.HangarToggle;

            return new ButtonsView
            {
                ButtonId = nativeName,
                TranslateName = name,
                CssClass = "hangar-btn " + CssMid,
                ShowName = false,
                IsCssImage = true,
                CssImage = new SpriteImages().MapControlIcons(nativeName).Medium
            };
        }


        public static IButtonsView HangarListBtns(HangarUnitsOut data)
        {
            string gray = null;
            if (data.Count == null || data.Count == 0)
            {
                gray = " grayScale ";
                data.Count = null;
            }
            return new ButtonsView
            {
                CssClass = CssMid + gray,
                ShowName = true,
                TranslateName = data.Name + " " + data.Count,
                ConteinPartial = true,
                PartialView = new ButtonPartialView
                {
                    Data = data,
                    PartialPath = HangarUnitsOut.ViewUnitItemTmpl
                }
            };
        }

        public static IButtonsView MapControlBtns(int idPosition, string translateName)
        {
            var mapControlIds = MapInfoService.MapControlIds;

            var itemId = "btn" + mapControlIds[idPosition];

            var nativeName = mapControlIds[idPosition];
            var method = "MapControl." + nativeName;


            return new ButtonsView
            {
                TranslateName = translateName,
                ButtonId = itemId,
                CssClass = CssMid,
                Method = method,
                ShowName = false,
                CssImage = new SpriteImages().MapControlIcons(nativeName).Medium,
                IsCssImage = true
            };
        }

        public static IButtonsView LeaveFromAlliance(int allianceId, int groupCount = 1)
        {
 
            const string jsAction = "LeaveFromAlliance";
            var btn = ConstructorSizeBtn(groupCount,true);
            btn.TranslateName = Modules.Localize.Game.Alliance.Resource.LeaveAlliance;
            btn.Method = "GameServices.allianceService.leaveFromAlliance";
            btn.ButtonId = "alliance_" + allianceId + "_leave";
            btn.Params = new {Id = allianceId, NativeName = jsAction.ToLower()};
            return btn;
        }

        public static IButtonsView JoinToAlliacne(int allianceId, string allianceName, int groupCount = 1)
        {
 
            const string jsAction = "SendRequestJoinToAlliance";

            var btn = ConstructorSizeBtn(groupCount,true);
            btn.TranslateName = "tr_ Join to alliance";
            btn.Method = "GameServices.allianceService.sendRequestJoinToAlliance";
            btn.ButtonId = "alliance_" + allianceId + "_join";
            btn.Params = new
            {
                Id = allianceId,
                NativeName = jsAction.ToLower(),
                AllianceName = allianceName
            };
            return btn;
        }


        public static IButtonsView LefMenuNavAlliance()
        {
            const string cssItemSelector = " interface-icon-alliance";
            var cssResultClases = new SpriteImages().InterfaseBaseControlIcons(cssItemSelector).Icon;
 
            return new ButtonsView
            {
 
                IsCssImage = true,
                CssImage = cssResultClases,
                TranslateName = Modules.Localize.Game.Alliance.Resource.Alliance,
                CssClass = CssSmall,
 
                ShowName = false
            };
        }

        public static IButtonsView LefMenuNavConfederation()
        {
            const string cssItemSelector = " interface-icon-confederation";
            var cssResulClases = new SpriteImages().InterfaseBaseControlIcons(cssItemSelector).Icon;
 
            return new ButtonsView
            {
                IsCssImage = true,
                CssImage = cssResulClases,
                TranslateName = Modules.Localize.Game.Confederation.Resource.Confederation,
                CssClass = CssSmall,
                ShowName = false
            };
        }

        public static IButtonsView LefMenuNavJournal()
        {
            const string cssItemSelector = " interface-icon-journal";
            var cssResulClases = new SpriteImages().InterfaseBaseControlIcons(cssItemSelector).Icon;
 
            return new ButtonsView
            {
                IsCssImage = true,
                CssImage = cssResulClases,
                TranslateName = Modules.Localize.Game.Journal.Resource.Journal,
                CssClass = CssSmall,
                ShowName = false
            };
        }

        public static IButtonsView LefMenuNavChannels()
        {
            const string cssItemSelector = "interface-icon-message";
            var cssResulClases = new SpriteImages().InterfaseBaseControlIcons(cssItemSelector).Icon;
 
            return new ButtonsView
            {
                IsCssImage = true,
                CssImage = cssResulClases,
                TranslateName = Modules.Localize.Game.UserChannels.Resource.Messages,
                CssClass = CssSmall,
                ShowName = false
            };
        }

        public static IButtonsView TabBtn(byte tabIdx, string translateName)
        {
            return new ButtonsView
            {
                TranslateName = translateName,
                CssClass = CssTabButton,
                ShowName = true
            };
        }

        public static IButtonsView StorageActionSendAll()
        {

            var btn = SmallDefault(Modules.Localize.Game.Units.Resource.SendAll, true);
            btn.ButtonId = "btn-storage-action-send-all";
            btn.Method = "GameServices.industrialComplexService.btnStorageSendAllResources";
            return btn;
        }

        public static IButtonsView DeleteBookmark(int groupCount, int bookmarkId, string type, int elemId, int tabIdx)
        {
            var btn = ConstructorSizeBtn(groupCount, true);
            btn.TranslateName = Modules.Localize.Game.Common.Resource.Delete;
            btn.Method = "GameServices.bookmarkService.deleteBokmark";
            btn.Params = new TabButtonParam
            {
                TabIdx = tabIdx,
                Id = bookmarkId,
                SourceIsTab = true,
                Data = new BookmarkOut
                {
                    Id = bookmarkId

                }
            };
            return btn;
        }


        public static IButtonsView Attack(bool sourceIsJournal, int groupCount, string planetName, int planetId)
        {
            var btn = ConstructorSizeBtn(groupCount, true);
            btn.TranslateName = Modules.Localize.Game.Journal.Resource.Attack;
            btn.Method = "GameServices.journalHelper.attack";
            btn.Params = new TabButtonParam
            {
                TabIdx = 0,
                SourceIsTab = sourceIsJournal,
                TargetName = planetName,
                Data = new { planetId }

            };

            return btn;
        }


        public static IButtonsView SpyDelete(int spyId)
        {


            var btn = ConstructorSizeBtn(2, true);
            btn.TranslateName = Modules.Localize.Game.Common.Resource.Delete;
            btn.Method = "GameServices.journalHelper.deleteSpyItem";
            btn.ButtonId = "spy_" + spyId + "_delete";
            btn.Params = new TabButtonParam
            {
                TabIdx = 2,
                Id = spyId,
                SourceIsTab = true,
                Data = new { spyId }
            };

            return btn;
        }

        public static IButtonsView ReportDelete(int reportId)
        {
            var btn = ConstructorSizeBtn(2, true);
            btn.TranslateName = Modules.Localize.Game.Common.Resource.Delete;
            btn.Method = "GameServices.journalHelper.deleteReportItem";
            btn.ButtonId = "report_" + reportId + "_delete";
            btn.Params = new TabButtonParam
            {
                TabIdx = 1,
                Id = reportId,
                SourceIsTab = true,
                Data = new { reportId }
            };

            return btn;
        }

        public static IButtonsView Spy(int groupCount, int planetId, string planetName, bool sourceIsTab)
        {

            var btn = ConstructorSizeBtn(groupCount, true);
            btn.TranslateName = Modules.Localize.Game.Journal.Resource.Spy;
            btn.Method = "GameServices.journalHelper.spy";
            btn.Params = new TabButtonParam
            {
                TabIdx = 2,
                SourceIsTab = sourceIsTab,
                Data = new { planetId, planetName },
                TargetName = planetName
            };

            return btn;
        }

        public static IButtonsView NewSpyItemFromSerch()
        {


            var btn = ConstructorSizeBtn(3, true);
            btn.TranslateName = Modules.Localize.Game.Journal.Resource.Spy;
            btn.Method = "GameServices.journalHelper.newSpy";
            btn.ButtonId = "btn-serch-target-spy";

            btn.Params = new TabButtonParam
            {
                TabIdx = 3,
                SourceIsTab = false,
                Data = new { planetName = "" }
            };
            return btn;

        }

        public static IButtonsView NewTaskAttack()
        {

            var btn = ConstructorSizeBtn(2, true);
            btn.TranslateName = Modules.Localize.Game.Journal.Resource.NewAttack;
            btn.Method = "GameServices.journalHelper.newAttack";
            btn.ButtonId = "add-task-attack";
            btn.Params = new TabButtonParam
            {
                TabIdx = 0,
                SourceIsTab = true,
                Data = new TaskFleet()
            };
            return btn;
        }

        public static IButtonsView NewTaskTransfer()
        {
            var btn = ConstructorSizeBtn(2, true);
            btn.TranslateName = Modules.Localize.Game.Journal.Resource.NewTransfer;
            btn.Method = "GameServices.journalHelper.newTransfer";
            btn.ButtonId = "add-task-transfer";
            btn.Params = new TabButtonParam
            {
                TabIdx = 0,
                SourceIsTab = true,
                Data = new TaskFleet()
            };
            return btn;
        }
    }

    /// <summary>
    ///  Используется для установки параметров запроса и данных для кнопки Атрибуты 
    /// </summary>
    public class TabButtonParam
    {

        public int? Id { get; set; }
        public int TabIdx { get; set; }
        public string TargetName { get; set; }
        public bool SourceIsTab { get; set; }
        public string Method { get; set; }
        public string Url { get; set; }
        public object Data { get; set; }
    }
}