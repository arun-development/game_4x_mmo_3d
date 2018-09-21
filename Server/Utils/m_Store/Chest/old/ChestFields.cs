namespace site.Models.User.Chest
{
    public class ChestFields
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public int ProductType { get; set; }
        public int Count { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public dynamic ImgCollection { get; set; }
        public bool Activated { get; set; }
        public bool Finished { get; set; }
    }
}