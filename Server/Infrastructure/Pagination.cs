using Newtonsoft.Json;

namespace Server.Infrastructure
{
    [JsonObject]
    public class Pagination
    {
        [JsonProperty("PathInString")]
        public string PathInString { get; set; }
    }
}
