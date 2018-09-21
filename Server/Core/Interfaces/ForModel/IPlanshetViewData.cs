using System.Collections.Generic;
using Server.Core.Infrastructure.ComplexButton;
using Server.DataLayer;

namespace Server.Core.Interfaces.ForModel
{
    public interface IComplexButtonView
    {
        ComplexButtonView ComplexButtonView { get; set; }
        void SetComplexButtonView();
    }

    public interface IButtonsView
    {
        string TranslateName { get; set; }

        string ButtonId { get; set; }
        string CssClass { get; set; }
 
        bool ShowName { get; set; }
        bool ConteinPartial { get; set; }
        IButtonPartialView PartialView { get; set; }
        bool IsCssImage { get; set; }
        string CssImage { get; set; }
        string Method { get; set; }
        object Params { get; set; }
    }

    public interface IButtonPartialView
    {
        string PartialPath { get; set; }
        object Data { get; set; }
    }


    public interface IButtonsViewCollection
    {
        List<IButtonsView> Buttons { get; set; }
        bool HasButtons { get; set; }
    }

    public interface IPlanshetItem : IButtonsViewCollection, IUniqueIdElement
    {
    }


    public interface IPlanshetViewData
    {
        string UniqueId { get; set; }
        string HeadTranslateName { get; set; }
        bool HasTabs { get; set; }
        string TemplateUrl { get; set; }
        string TabTemplateUrl { get; set; }
        List<IButtonsView> Buttons { get; set; }
        List<IPlanshetBodyTemplate> Bodys { get; set; }
        bool? IsMother { get; set; }
    }

    public interface IPlanshetBodyTemplate
    {
        string BodyId { get; set; }
        int LastId { get; set; }
        string TemplateUrl { get; set; }
        object TemplateData { get; set; }
    }
}