using System.Collections.Generic;
using Server.Core.Interfaces.ForModel;

namespace Server.Services.HtmlHelpers
{
    public class PlanshetBodyTemplate : IPlanshetBodyTemplate
    {
        public string BodyId { get; set; }
        public int LastId { get; set; }
        public string TemplateUrl { get; set; }
        public object TemplateData { get; set; }
    }

    public class PlanshetViewData : IPlanshetViewData
    {
        public string UniqueId { get; set; }
        public string HeadTranslateName { get; set; }
        public bool HasTabs { get; set; }
        public string TemplateUrl { get; set; }
        public string TabTemplateUrl { get; set; }
        public List<IButtonsView> Buttons { get; set; }
        public List<IPlanshetBodyTemplate> Bodys { get; set; }
        public bool? IsMother { get; set; }
    }

    public static class PlanshetTabHelper
    {
        public static PlanshetViewData SetTabData(
            string uniqueId,
            string headTranslateName,
            List<string> translateTabNames,
            List<IPlanshetBodyTemplate> templateData,
            string rootTemplate,
            IReadOnlyList<string> tabBodyIds)
        {
            var tabs = new PlanshetViewData
            {
                TabTemplateUrl = "planshet-tabs.tmpl",
                TemplateUrl = rootTemplate,
                HeadTranslateName = headTranslateName,
                Bodys = templateData,
                UniqueId = uniqueId.ToLower(),
                HasTabs = true
            };
            var buttons = new List<IButtonsView>();
            for (byte i = 0; i < 3; i++)
            {
                buttons.Add(ButtonsView.TabBtn(i, translateTabNames[i]));

                tabs.Bodys[i].BodyId = tabBodyIds[i];
            }
            tabs.Buttons = buttons;

            return tabs;
        }
    }

    public static class PlanshetBodyHelper
    {
        public static PlanshetViewData SetBody(
            object templateData,
            string headTranslateName,
            string planshetId,
            string templateUrl,
            string childTemplate,
            int lastId = 1,
            List<IButtonsView> buttons = null)
        {
            var planshet = new PlanshetViewData
            {
                HeadTranslateName = headTranslateName,
                UniqueId = planshetId,
                Buttons = buttons,
                HasTabs = false,
                TemplateUrl = templateUrl,
                Bodys = new List<IPlanshetBodyTemplate>
                {
                    new PlanshetBodyTemplate
                    {
                        TemplateData = templateData,
                        TemplateUrl = childTemplate,
                        BodyId = planshetId,
                        LastId = lastId
                    }
                }
            };

            return planshet;
        }
    }
}