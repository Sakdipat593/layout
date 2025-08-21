using backend.EF.Models;
using backend.EF.Models.BookModel;
using Microsoft.AspNetCore.Http;
using System.Linq;

namespace backend.EF.Services
{
    public interface IBookService
    {
        ResultAPI OnloadData();
        ResultAPI Create(BookStore book);
    }

    public class BookService : IBookService
    {
        private readonly BookDBContext _db;

        public BookService(BookDBContext db)
        {
            _db = db;
        }

        // ===== ดึงข้อมูลทั้งหมด =====
        public ResultAPI OnloadData()
        {
            ResultAPI result = new ResultAPI();

            var lstData = _db.TB_Books.Where(b => b.isDelete != true).ToList();
            var lstAuthor = _db.TB_Authers.ToList();
            var lstCategory = _db.TB_Categories.ToList();

            if (!lstData.Any())
            {
                result.sMessage = "Data not found.";
                result.nStatusCode = StatusCodes.Status404NotFound;
                return result;
            }

            var lstDataResult = lstData.Select(item =>
            {
                var author = lstAuthor.FirstOrDefault(a => a.nAutherID == item.nAutherID);
                var category = lstCategory.FirstOrDefault(c => c.nCategoryID == item.nCategoryID);

                return new BookStore
                {
                    nID = item.nBookID, // int ไม่ nullable
                    sTitle = item.sName ?? "",
                    nPrice = item.nAmount ?? 0, // int? ใช้ ??
                    nStock = item.isPrint ?? false, // bool? ใช้ ??
                    nPublishDate = item.dRelease.HasValue ? item.dRelease.Value.ToString("dd/MM/yyyy") : "",
                    nAuthor = item.nAutherID ?? 0, // int? ใช้ ??
                    sAuthorName = author?.sName ?? "",
                    nCategory = item.nCategoryID ?? 0, // int? ใช้ ??
                    sCategoryName = category?.sName ?? ""
                };
            }).ToList();

            result.objResult = lstDataResult;
            result.nStatusCode = StatusCodes.Status200OK;
            return result;
        }

        // ===== เพิ่มข้อมูลใหม่ =====
        public ResultAPI Create(BookStore book)
        {
            ResultAPI result = new ResultAPI();

            try
            {
                // ===== ตรวจสอบ Author =====
                var author = _db.TB_Authers.FirstOrDefault(a => a.sName == book.sAuthorName);
                var Id = _db.TB_Authers.Max(M => M.nAutherID) + 1;
                if (author == null)
                {
                    author = new TB_Auther { sName = book.sAuthorName , nAutherID = Id };
                    _db.TB_Authers.Add(author);
                    _db.SaveChanges();
                }

                // ===== ตรวจสอบ Category =====
                var category = _db.TB_Categories.FirstOrDefault(c => c.sName == book.sCategoryName);
                var CateId = _db.TB_Categories.Max(N => N.nCategoryID) + 1;
                if (category == null)
                {
                    category = new TB_Category { sName = book.sCategoryName , nCategoryID = CateId };
                    _db.TB_Categories.Add(category);
                    _db.SaveChanges();
                }

                var bookId = _db.TB_Books.Max(N => N.nBookID) + 1;
                // ===== เพิ่ม Book =====
                var newBook = new TB_Book
                {
                    nBookID = bookId,
                    sName = book.sTitle,
                    nAmount = book.nPrice,
                    isPrint = book.nStock,
                    dRelease = DateTime.TryParse(book.nPublishDate, out var dt) ? dt : (DateTime?)null,
                    nAutherID = author.nAutherID,
                    nCategoryID = category.nCategoryID,
                    dCreate = DateTime.Now,
                    dUpdate = DateTime.Now,
                    isDelete = false
                };

                _db.TB_Books.Add(newBook);
                _db.SaveChanges();

                result.nStatusCode = StatusCodes.Status200OK;
                result.sMessage = "บันทึกสำเร็จ";
                result.objResult = book; // ส่งกลับข้อมูลที่ submit
            }
            catch (Exception ex)
            {
                result.nStatusCode = StatusCodes.Status500InternalServerError;
                result.sMessage = ex.Message;
            }

            return result;
        }
    }
}
