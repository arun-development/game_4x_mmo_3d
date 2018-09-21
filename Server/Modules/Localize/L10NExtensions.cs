namespace Server.Modules.Localize
{
    public static class L10NExtensions
    {
        public static void InitializeField(this L10N l10N)
        {
            l10N.En = new LangField();
            l10N.Ru = new LangField();
            l10N.Es = new LangField();
        }
        public static string GetTranslateName(this L10N l10N)
        {
            if (l10N.CurrentCulture == L10N.SupportedCulture[(byte)LangKeys.Ru])
            {
                return l10N.Ru.Name;
            }
            return l10N.CurrentCulture == L10N.SupportedCulture[(byte)LangKeys.Es] ? l10N.Es.Name : l10N.En.Name;
        }
        public static string GetTranslateDescription(this L10N l10N)
        {
            if (l10N.CurrentCulture == L10N.SupportedCulture[(byte)LangKeys.Ru])
            {
                return l10N.Ru.Description;
            }
            
            return l10N.CurrentCulture == L10N.SupportedCulture[(byte)LangKeys.Es] ? l10N.Es.Description : l10N.En.Description;
        }

        public static string ToInvariant(this LangKeys key)
        {
            return key.ToString().ToLower();
        }
    }
}
