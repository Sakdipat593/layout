using Microsoft.AspNetCore.Mvc;
using backend.EF.Services;
using backend.EF.Models.BookModel;

namespace backend.Controllers
{
    [ApiController]
    [Route("[Controller]/[action]")]
    public class BookController : Controller
    {
        private readonly IBookService _bookService;

        public BookController(IBookService bookService)
        {
            _bookService = bookService;
        }
        [HttpGet]
        public IActionResult OnloadData()
        {
            var result = _bookService.OnloadData();
            return StatusCode(result.nStatusCode, result);
        }
        [HttpPost]
        public IActionResult Create([FromBody] BookStore book)
        {
            if (book == null)
                return BadRequest(new { message = "ข้อมูลว่าง" });

            var result = _bookService.Create(book);
            return StatusCode(result.nStatusCode, result);
        }
    }
}
