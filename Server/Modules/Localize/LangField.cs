using System.ComponentModel.DataAnnotations;
using Server.Core.Interfaces;
using Server.Core.StaticData;

namespace Server.Modules.Localize
{
    public enum LangKeys : byte
    {
        En,
        Ru,
        Es
    }

    public interface ITranslateField<T>
    {
        T Ru { get; set; }
        T En { get; set; }
        T Es { get; set; }
    }


    public class LangField : ICreateNew<LangField>
    {
        public LangField()
        {
        }

        public LangField(string name, string description)
        {
            Name = name;
            Description = description;
        }

        protected LangField(LangField other)
        {
            Name = other.Name;
            Description = other.Description;
        }

        [MaxLength((int) MaxLenghtConsts.DescriptionLangNameMax)]
        public string Name { get; set; }

        //[MaxLength((int)MaxLenghtConsts.DescriptionLangDescriptionMax)]
        [MaxLength((int) MaxLenghtConsts.DefaultDescription)]
        public string Description { get; set; }

        public LangField CreateNew(LangField other)
        {
            return new LangField(other);
        }

        public LangField CreateNewFromThis()
        {
            return new LangField(this);
        }

        public object Clone()
        {
            return MemberwiseClone();
        }
    }

    public class L10NSimple : ITranslateField<string>, ICreateNew<L10NSimple>
    {
        public L10NSimple()
        {
        }

        protected L10NSimple(ITranslateField<string> other)
        {
            En = other.En;
            Es = other.Es;
            Ru = other.Ru;
        }

        public L10NSimple CreateNew(L10NSimple other)
        {
            return new L10NSimple(other);
        }

        public L10NSimple CreateNewFromThis()
        {
            return new L10NSimple(this);
        }

        public string Ru { get; set; }

        public string En { get; set; }

        public string Es { get; set; }

        public L10NSimple CreateNew(ITranslateField<string> other)
        {
            return new L10NSimple(other);
        }
    }
}