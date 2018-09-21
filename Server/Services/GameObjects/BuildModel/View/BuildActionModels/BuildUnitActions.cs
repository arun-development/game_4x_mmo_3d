namespace Server.Services.GameObjects.BuildModel.View.BuildActionModels

{
    public class BuildUnitActions : BuildDropItemActionModel
    {
        public const string ViewPath = PrefixTmpl + "unit" + Ext;
        public string Name;
        public int Level;
    }
}