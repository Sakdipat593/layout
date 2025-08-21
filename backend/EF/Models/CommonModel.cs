namespace backend.EF.Models
{
    public class ResultAPI
    {
        public int nStatusCode { get; set; } = 200;
        public string? sMessage { get; set; }
        public object? objResult { get; set; }
    }
}
