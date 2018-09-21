using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using Server.Core.Interfaces.Confederation;
using Server.Modules.Localize;

namespace Server.Services.Confederation
{
    public static class OfficerHelper
    {
        static OfficerHelper()
        {
            var president = new OfficerBase
            {
                Type = OfficerTypes.President,
                Stats = new OfficerStats
                {
                    Hp = 50,
                    Attack = 50,
                    CastAlliance = true
                }
            };
            president.Translate = new L10N
            {
                En = new LangField("EN: president name  ",
                    $"EN: president description  hp:{president.Stats.HpView}, atk:{president.Stats.AttackView}"),
                Es = new LangField("Es: president name  ",
                    $"ES: president description  hp:{president.Stats.HpView}, atk:{president.Stats.AttackView}"),
                Ru = new LangField("Ru: president name  ",
                    $"RU: president description  hp:{president.Stats.HpView}, atk:{president.Stats.AttackView}"),
            };

            var atacker = new OfficerBase
            {
                Type = OfficerTypes.Atacker,
                Stats = new OfficerStats
                {
                    Hp = 0,
                    Attack = 50,
                    CastAlliance = true
                }
            };

            atacker.Translate = new L10N
            {
                En = new LangField("EN: atacker name  ",
                    $"EN: atacker description  hp:{atacker.Stats.HpView}, atk:{atacker.Stats.AttackView}"),
                Es = new LangField("Es: atacker name  ",
                    $"ES: atacker description  hp:{atacker.Stats.HpView}, atk:{atacker.Stats.AttackView}"),
                Ru = new LangField("Ru: atacker name  ",
                    $"RU: atacker description  hp:{atacker.Stats.HpView}, atk:{atacker.Stats.AttackView}"),
            };

            var protector = new OfficerBase
            {
                Type = OfficerTypes.Protector,
                Stats = new OfficerStats
                {
                    Hp = 50,
                    Attack = 0,
                    CastAlliance = true
                }
            };
            protector.Translate = new L10N
            {
                En = new LangField("EN: protector name  ",
                    $"EN: protector description  hp:{protector.Stats.HpView}, atk:{protector.Stats.AttackView}"),
                Es = new LangField("Es: protector name  ",
                    $"ES: protector description  hp:{protector.Stats.HpView}, atk:{protector.Stats.AttackView}"),
                Ru = new LangField("Ru: protector name  ",
                    $"RU: protector description  hp:{protector.Stats.HpView}, atk:{protector.Stats.AttackView}"),
            };

            var supporter = new OfficerBase
            {
                Type = OfficerTypes.Supporter,

                Stats = new OfficerStats
                {
                    Hp = 20,
                    Attack = 20,
                    CastAlliance = true
                }
            };
            supporter.Translate = new L10N
            {
                En = new LangField("EN: supporter name  ",
                    $"EN: supporter description  hp: {supporter.Stats.HpView}, atk: {supporter.Stats.AttackView}"),
                Es = new LangField("Es: supporter name  ",
                    $"ES:  supporter description  hp: {supporter.Stats.HpView}, atk: {supporter.Stats.AttackView}"),
                Ru = new LangField("Ru: supporter name  ",
                    $"RU: supporter description  hp: {supporter.Stats.HpView}, atk: {supporter.Stats.AttackView}"),
            };

            var dic = new Dictionary<byte, OfficerBase>
            {
                {(byte) president.Type, president},
                {(byte) atacker.Type, atacker},
                {(byte) protector.Type, protector},
                {(byte) supporter.Type, supporter},
            };

            _storage = new ConcurrentDictionary<byte, OfficerBase>(dic);
        }

        private static readonly ConcurrentDictionary<byte, OfficerBase> _storage;

        public static OfficerBase GetOfficer(OfficerTypes officerType)
        {
            OfficerBase officer;
            _storage.TryGetValue((byte) officerType, out officer);
            return officer;
        }

        public static List<OfficerBase> GetOfficers()
        {
            return _storage.Select(i => i.Value).ToList();
        }
    }
}