namespace Server.Core.Interfaces.GameObjects
{
    public class BuildPropertyView
    {
        public string PropertyName { get; set; }
        public string PropertyNativeName { get; set; }
        public double BaseValue { get; set; }
        public double CurrentValue { get; set; }
        public double NextValue { get; set; }
    }
}
