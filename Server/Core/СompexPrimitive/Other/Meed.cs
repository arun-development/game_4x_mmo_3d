using System.Collections.Generic;
using System.Linq;
using Server.Core.Interfaces;
using Server.DataLayer;
using Server.Extensions;
using Server.Modules.Localize;

namespace Server.Core.СompexPrimitive.Other
{
    public class MeedDbModel : IUniqueIdElement
    {
        public int Count;
        public int Id { get; set; }
    }

    public class Meed : MeedDbModel, INativeName,ICreateNew<Meed>
    {
        public L10N Translate;
        public string SvgName;
        public string NativeName { get; set; }

        public Meed()
        {
        }

        public Meed(Meed other)
        {

            Id = other.Id;
            Translate = other.Translate.CreateNewFromThis();
            SvgName = other.SvgName;
            NativeName = other.NativeName;
            Count = other.Count;
        }

        public Meed CreateNew(Meed other)
        {
          return new Meed(other);
        }

        public Meed CreateNewFromThis()
        {
            return new Meed(this);
        }
    }

    public static class MeedHelper
    {
        private static readonly Dictionary<int, Meed> _meeds = _createMeeds();

        public static Dictionary<int, Meed> GetBaseMeeds()
        {
            return _meeds.ToDictionary(i => i.Key, i => i.Value.CreateNewFromThis());
        }

        private static Dictionary<int, Meed> _createMeeds()
        {
            var meeds = new Dictionary<int, Meed>();
            var achievementPrefix = "achievement-";

            #region meed 1

            var m1 = new Meed
            {
                Id = 1,
                NativeName = "tmpNativeNameMeed1",
                Translate = new L10N
                {
                    En = new LangField
                    {
                        Name = "en name meed 1",
                        Description = "en description meed 1"
                    },
                    Es = new LangField
                    {
                        Name = "es name meed 1",
                        Description = "es description meed 1"
                    },
                    Ru = new LangField
                    {
                        Name = "ru name meed 1",
                        Description = "ru description meed 1"
                    }
                }
            };
            m1.SvgName = achievementPrefix + m1.Id;

            #endregion

            #region m2

            var m2 = new Meed
            {
                Id = 2,
                NativeName = "tmpNativeNameMeed2",
                Translate = new L10N
                {
                    En = new LangField
                    {
                        Name = "en name meed 2",
                        Description = "en description meed 2"
                    },
                    Es = new LangField
                    {
                        Name = "es name meed 2",
                        Description = "es description meed 2"
                    },
                    Ru = new LangField
                    {
                        Name = "ru name meed 2",
                        Description = "ru description meed 2"
                    }
                }
            };

            #endregion

            #region m3

            var m3 = new Meed
            {
                Id = 3,
                NativeName = "tmpNativeNameMeed3",
                Translate = new L10N
                {
                    En = new LangField
                    {
                        Name = "en name meed 3",
                        Description = "en description meed 3"
                    },
                    Es = new LangField
                    {
                        Name = "es name meed 2",
                        Description = "es description meed 3"
                    },
                    Ru = new LangField
                    {
                        Name = "ru name meed 3",
                        Description = "ru description meed 3"
                    }
                }
            };

            #endregion

            #region meed 4

            var m4 = new Meed
            {
                Id = 4,
                NativeName = "tmpNativeNameMeed4",
                Translate = new L10N
                {
                    En = new LangField
                    {
                        Name = "en name meed 4",
                        Description = "en description meed 4 "
                    },
                    Es = new LangField
                    {
                        Name = "es name meed 4",
                        Description = "es description meed 4"
                    },
                    Ru = new LangField
                    {
                        Name = "ru name meed 1",
                        Description = "ru description meed 4"
                    }
                }
            };

            #endregion

            #region m5

            var m5 = new Meed
            {
                Id = 5,
                NativeName = "tmpNativeNameMeed5",
                Translate = new L10N
                {
                    En = new LangField
                    {
                        Name = "en name meed 5",
                        Description = "en description meed 5"
                    },
                    Es = new LangField
                    {
                        Name = "es name meed 5",
                        Description = "es description meed 5"
                    },
                    Ru = new LangField
                    {
                        Name = "ru name meed 5",
                        Description = "ru description meed 5"
                    }
                }
            };

            #endregion

            #region m6

            var m6 = new Meed
            {
                Id = 6,
                NativeName = "tmpNativeNameMeed6",
                Translate = new L10N
                {
                    En = new LangField
                    {
                        Name = "en name meed 6",
                        Description = "en description meed 6"
                    },
                    Es = new LangField
                    {
                        Name = "es name meed 2",
                        Description = "es description meed 6"
                    },
                    Ru = new LangField
                    {
                        Name = "ru name meed 6",
                        Description = "ru description meed 6"
                    }
                }
            };

            #endregion

            #region meed 7

            var m7 = new Meed
            {
                Id = 7,
                NativeName = "tmpNativeNameMeed7",
                Translate = new L10N
                {
                    En = new LangField
                    {
                        Name = "en name meed 7",
                        Description = "en description meed 7"
                    },
                    Es = new LangField
                    {
                        Name = "es name meed 7",
                        Description = "es description meed 7"
                    },
                    Ru = new LangField
                    {
                        Name = "ru name meed 7",
                        Description = "ru description meed 7"
                    }
                }
            };

            #endregion

            #region m8

            var m8 = new Meed
            {
                Id = 8,
                NativeName = "tmpNativeNameMeed8",
                Translate = new L10N
                {
                    En = new LangField
                    {
                        Name = "en name meed 8",
                        Description = "en description meed 8"
                    },
                    Es = new LangField
                    {
                        Name = "en name meed 8",
                        Description = "en description meed 8"
                    },
                    Ru = new LangField
                    {
                        Name = "en name meed 8",
                        Description = "en description meed 8"
                    }
                }
            };

            #endregion

            #region m9

            var m9 = new Meed
            {
                Id = 9,
                NativeName = "tmpNativeNameMeed9",
                Translate = new L10N
                {
                    En = new LangField
                    {
                        Name = "en name meed 9",
                        Description = "en description meed 9"
                    },
                    Es = new LangField
                    {
                        Name = "es name meed 9",
                        Description = "es description meed 9"
                    },
                    Ru = new LangField
                    {
                        Name = "ru name meed 9",
                        Description = "ru description meed 9"
                    }
                }
            };

            #endregion

            #region meed 10

            var m10 = new Meed
            {
                Id = 10,
                NativeName = "tmpNativeNameMeed10",
                Translate = new L10N
                {
                    En = new LangField
                    {
                        Name = "en name meed 10",
                        Description = "en description meed 10"
                    },
                    Es = new LangField
                    {
                        Name = "es name meed 10",
                        Description = "es description meed 10"
                    },
                    Ru = new LangField
                    {
                        Name = "ru name meed 10",
                        Description = "ru description meed 10"
                    }
                }
            };

            #endregion

            #region m11

            var m11 = new Meed
            {
                Id = 11,
                NativeName = "tmpNativeNameMeed11",
                Translate = new L10N
                {
                    En = new LangField
                    {
                        Name = "en name meed 11",
                        Description = "en description meed 11"
                    },
                    Es = new LangField
                    {
                        Name = "es name meed 11",
                        Description = "es description meed 11"
                    },
                    Ru = new LangField
                    {
                        Name = "ru name meed 11",
                        Description = "ru description meed 11"
                    }
                }
            };

            #endregion

            #region m12

            var m12 = new Meed
            {
                Id = 12,
                NativeName = "tmpNativeNameMeed12",
                Translate = new L10N
                {
                    En = new LangField
                    {
                        Name = "en name meed 12",
                        Description = "en description meed 12"
                    },
                    Es = new LangField
                    {
                        Name = "es name meed 12",
                        Description = "es description meed 12"
                    },
                    Ru = new LangField
                    {
                        Name = "ru name meed 12",
                        Description = "ru description meed 12"
                    }
                }
            };

            #endregion

            m1.SvgName = achievementPrefix + m1.Id;
            m2.SvgName = achievementPrefix + m2.Id;
            m3.SvgName = achievementPrefix + m3.Id;
            m4.SvgName = achievementPrefix + m4.Id;
            m5.SvgName = achievementPrefix + m5.Id;
            m6.SvgName = achievementPrefix + m6.Id;
            m7.SvgName = achievementPrefix + m7.Id;
            m8.SvgName = achievementPrefix + m8.Id;
            m9.SvgName = achievementPrefix + m9.Id;
            m10.SvgName = achievementPrefix + m10.Id;
            m11.SvgName = achievementPrefix + m11.Id;
            m12.SvgName = achievementPrefix + m12.Id;


            meeds[m1.Id] = m1;
            meeds[m2.Id] = m2;
            meeds[m3.Id] = m3;
            meeds[m4.Id] = m4;
            meeds[m5.Id] = m5;
            meeds[m6.Id] = m6;
            meeds[m7.Id] = m7;
            meeds[m8.Id] = m8;
            meeds[m9.Id] = m9;
            meeds[m10.Id] = m10;
            meeds[m11.Id] = m11;
            meeds[m12.Id] = m12;
            return meeds;
        }


        public static Meed GetMeedById(int meedId)
        {
            return _meeds.ContainsKey(meedId) ? _meeds[meedId].CreateNewFromThis() : null;
        }

        public static Dictionary<int, Meed> GetMeedByDbModel(Dictionary<int, MeedDbModel> model)
        {
            var result = GetBaseMeeds();
            foreach (var i in model) result[i.Key].Count = model[i.Key].Count;
            return result;
        }

        public static Dictionary<int, Meed> GetMeedByDbModel(string model)
        {
            return string.IsNullOrWhiteSpace(model)
                ? GetBaseMeeds()
                : GetMeedByDbModel(model.ToSpecificModel<Dictionary<int, MeedDbModel>>());
        }

        public static string AddMeed(Dictionary<int, MeedDbModel> model, int meedId, int addMeed)
        {
            if (model.ContainsKey(meedId)) model[meedId].Count += addMeed;
            else
            {
                model.Add(meedId, new MeedDbModel
                {
                    Id = meedId,
                    Count = addMeed
                });
            }

            return model.ToSerealizeString();
        }

        public static string AddMeed(string model, int meedId, int addMeed)
        {
            var m = string.IsNullOrWhiteSpace(model)
                ? new Dictionary<int, MeedDbModel>()
                : model.ToSpecificModel<Dictionary<int, MeedDbModel>>();
            return AddMeed(m, meedId, addMeed);
        }
    }
}