using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Server.Core.Infrastructure.ComplexButton;
using Server.Core.Interfaces.ForModel;
using Server.Core.StaticData;
using Server.Modules.Localize;
using Server.Services.HtmlHelpers;

namespace Server.Services.OutModel.JournalOut
{
    //public class JournalOut : SectionContentViewData
    public class JournalOut : IJournalOut
    {
 
        protected const string Ext = Directories.Tmpl;
        protected const string Prefix = "journal-";
        private const string JournalHtmlDirRoot = Prefix + "planshet-root" + Ext;

 
 
        //tabs content
        public const string JournalCollectionId = "journal-collection";

        protected const string TaskTmpl = Prefix + "tab-task" + Ext;
        protected const string ReportTmpl = Prefix + "tab-report" + Ext;
        protected const string SpyTmpl = Prefix + "tab-spy" + Ext;

        [MaxLength(3)] public static List<string> TabIds = new List<string>
        {
            "journal-task",
            "journal-report",
            "journal-spy"
        };
 

        [MaxLength(14)]
        public string SourceOwnName { get; set; }

        [MaxLength(14)]
        public string SourceSystemName { get; set; }

        /// <summary>
        ///     false -mother, true -planet
        /// </summary>
        public bool SourceOwnType { get; set; }

        [MaxLength(14)]
        public string TargetPlanetName { get; set; }

        [MaxLength(14)]
        public string TargetSystemName { get; set; }

        public ImageView LeftImage { get; set; }
        public ImageView RightImage { get; set; }

        public ComplexButtonView ComplexButtonView { get; set; }
        public int Id { get; set; }
        public List<IButtonsView> Buttons { get; set; }
        public bool HasButtons { get; set; }

        public virtual void SetComplexButtonView()
        {
            throw new NotImplementedException();
        }



        public static IPlanshetViewData InitialTabs(object taskData, object reportData, object spyData, ILocalizerService localizer)
        {
 
            var journalTranslates = localizer.GetGameTranstaleGroup(GameTranslateType.journal);

            var tabsData = new List<IPlanshetBodyTemplate>
            {
                new PlanshetBodyTemplate
                {
                    LastId = 1,
                    TemplateData = taskData,
                    TemplateUrl = TaskTmpl
                },
                new PlanshetBodyTemplate
                {
                    LastId = 1,
                    TemplateData = reportData,
                    TemplateUrl = ReportTmpl
                },
                new PlanshetBodyTemplate
                {
                    LastId = 1,
                    TemplateData = spyData,
                    TemplateUrl = SpyTmpl
                }
            };


            var listNames = new List<string>
            {
                journalTranslates["task"],
                journalTranslates["report"],
                journalTranslates["spy"]
            };


            return PlanshetTabHelper.SetTabData(JournalCollectionId, journalTranslates["journal"],  listNames, tabsData, JournalHtmlDirRoot, TabIds);
        }


        protected void SetComplexButtonView(SectionContentViewData data)
        {
            var cb = new ComplexButtonView();
            cb.Full(data);
            ComplexButtonView = cb;
        }

        protected SectionContentViewData ComplexBtn(object model, bool isTask = false, bool isImage = false)
        {
            var centrPath = Reports.ReportCenterTaskTmpl;

            if (isTask)
            {
                centrPath = TabTaskOut.TaskCenterPartialPath;
            }

            var views = new SectionContentViewData
            {
                Left = new SectionItem
                {
                    Data = LeftImage
                },
                Centr = new SectionItem
                {
                    Data = model,
                    Path = centrPath
                },
                Right = new SectionItem
                {
                    Data = RightImage
                }
            };

            return views;
        }
    }
}