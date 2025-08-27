namespace backend.EF.Models
{
    public class ResultAPI
    {
        public int nStatusCode { get; set; } = 200;
        public string? sMessage { get; set; }
        public object? objResult { get; set; }
    }
}
namespace backend.EF.Models.BookModel
{
    public class CommonModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
}

