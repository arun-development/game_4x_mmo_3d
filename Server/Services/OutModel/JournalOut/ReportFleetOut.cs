using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using Server.Core.Battle;
using Server.Core.Images;
using Server.Core.Interfaces;
using Server.Core.СompexPrimitive.Units;
using Server.Extensions;

namespace Server.Services.OutModel.JournalOut {
    public class ReportFleetOut : INativeName {
        public string TranslateName { get; set; }
        public SpriteImages SpriteImages { get; set; }

        public int StartUnitCount { get; set; }
        public int LostUnitCount { get; set; }

        [MaxLength(14)]
        public string NativeName { get; set; }


        public static Dictionary<UnitType, ReportFleetOut> ConvertBattleFleetsToReportFleetView(string battleFleets) {
            var data = battleFleets.ToSpecificModel<BattleFleets>();
            return ConvertBattleFleetsToReportFleetView(data);
        }

        public static Dictionary<UnitType, ReportFleetOut> ConvertBattleFleetsToReportFleetView(
            BattleFleets battleFleets) {
            var resultCollection = CreateBaseReportUnits();
            var keys = resultCollection.Keys.ToList();
            foreach (var key in keys) {
                if (battleFleets.Before.ContainsKey(key)) {
                    resultCollection[key].StartUnitCount = battleFleets.Before[key];
                }
                if (battleFleets.Lose.ContainsKey(key)) {
                    resultCollection[key].LostUnitCount = battleFleets.Lose[key];
                }
            }

            return resultCollection;
        }


        private static Dictionary<UnitType, ReportFleetOut> CreateBaseReportUnits() {
            var protoCollection = HangarUnitsOut.EmptyHangar();
            var keys = protoCollection.Keys.ToList();
            var result = keys.ToDictionary(key => key, key => new ReportFleetOut {
                NativeName = protoCollection[key].NativeName,
                SpriteImages = protoCollection[key].SpriteImages,
                TranslateName = protoCollection[key].Name,
                LostUnitCount = 0,
                StartUnitCount = 0
            });

            return result;
        }
    }
}