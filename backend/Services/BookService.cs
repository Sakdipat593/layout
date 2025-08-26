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
        ResultAPI Delete(int id);
        ResultAPI Edit(BookStore book);

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

            // ดึงเฉพาะ record ที่ยังไม่ถูกลบ
            var lstData = _db.TB_Books
                             .Where(b => b.isDelete == false)
                             .ToList();

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
                    nID = item.nBookID,
                    sTitle = item.sName ?? "",
                    nPrice = item.nAmount ?? 0,
                    nStock = item.isPrint ?? false,
                    nPublishDate = item.dRelease.HasValue
                    ? item.dRelease.Value.ToString("dd/MM/yyyy")
                    : DateTime.Now.ToString("dd/MM/yyyy"),
                    nAuthor = item.nAutherID ?? 0,
                    sAuthorName = author?.sName ?? "",
                    nCategory = item.nCategoryID ?? 0,
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
                var author = _db.TB_Authers.FirstOrDefault(a => a.sName == book.sAuthorName);
                var Id = _db.TB_Authers.Max(M => M.nAutherID) + 1;
                if (author == null)
                {
                    author = new TB_Auther { sName = book.sAuthorName, nAutherID = Id };
                    _db.TB_Authers.Add(author);
                    _db.SaveChanges();
                }

                var category = _db.TB_Categories.FirstOrDefault(c => c.sName == book.sCategoryName);
                var CateId = _db.TB_Categories.Max(N => N.nCategoryID) + 1;
                if (category == null)
                {
                    category = new TB_Category { sName = book.sCategoryName, nCategoryID = CateId };
                    _db.TB_Categories.Add(category);
                    _db.SaveChanges();
                }

                var bookId = _db.TB_Books.Max(N => N.nBookID) + 1;
                var newBook = new TB_Book
                {
                    nBookID = bookId,
                    sName = book.sTitle,
                    nAmount = book.nPrice,
                    isPrint = book.nStock,
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
                result.objResult = book;
            }
            catch (Exception ex)
            {
                result.nStatusCode = StatusCodes.Status500InternalServerError;
                result.sMessage = ex.Message;
            }
            return result;
        }

        // ===== Soft Delete =====
        public ResultAPI Delete(int id)
        {
            ResultAPI result = new ResultAPI();
            var book = _db.TB_Books.FirstOrDefault(b => b.nBookID == id);

            if (book == null)
            {
                result.nStatusCode = StatusCodes.Status404NotFound;
                result.sMessage = "ไม่พบข้อมูล";
                return result;
            }

            // Soft Delete + Log
            book.isDelete = true;
            book.dDelete = DateTime.Now;
            _db.SaveChanges();

            result.nStatusCode = StatusCodes.Status200OK;
            result.sMessage = "ลบข้อมูลสำเร็จ (Soft Delete)";
            return result;
        }
        public ResultAPI Edit(BookStore book)
        {
            var result = new ResultAPI();
            try
            {
                var existingBook = _db.TB_Books.FirstOrDefault(b => b.nBookID == book.nBookID);
                if (existingBook == null)
                {
                    result.nStatusCode = 404;
                    result.sMessage = "ไม่พบข้อมูล";
                    return result;
                }

                // อัปเดตค่า
                existingBook.sName = book.sTitle;
                existingBook.nAmount = book.nPrice;
                existingBook.isPrint = book.nStock;
                existingBook.dRelease = book.nPublishDate;
                existingBook.dUpdate = DateTime.Now;

                // TODO: ถ้า Author/Category เป็น string ต้อง map หา ID ก่อน
                // existingBook.nAutherID = ...;
                // existingBook.nCategoryID = ...;

                _db.SaveChanges();

                result.nStatusCode = 200;
                result.sMessage = "แก้ไขข้อมูลสำเร็จ";
            }
            catch (Exception ex)
            {
                result.nStatusCode = 500;
                result.sMessage = "เกิดข้อผิดพลาด: " + ex.Message;
            }
            return result;
        }

    }
}
