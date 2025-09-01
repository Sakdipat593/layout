namespace backend.EF.Models.BookModel
{
    public class BookStore
    {
        public int nBookID { get; set; }
        public int? nID { get; set; }
        public int? nNo { get; set; }
        public string sTitle { get; set; }
        public int nPrice { get; set; }
        public bool nStock { get; set; }
        public string nPublishDate { get; set; }
        public int? nAuthor { get; set; }
        public int? nCategory { get; set; }
        public string sAuthorName { get; set; }
        public string sCategoryName { get; set; }
    }
}
