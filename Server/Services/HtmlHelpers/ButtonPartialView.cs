using Server.Core.Interfaces.ForModel;

namespace Server.Services.HtmlHelpers
{
    public class ButtonPartialView: IButtonPartialView
    {
        public string PartialPath { get; set; }
        public object Data { get; set; }
    }
}