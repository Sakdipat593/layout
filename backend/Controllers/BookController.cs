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
            var result = _bookService.Create(book);
            return StatusCode(result.nStatusCode, result);
        }

        [HttpDelete]
        public IActionResult Delete([FromQuery] int id)
        {
            var result = _bookService.Delete(id);
            return StatusCode(result.nStatusCode, result);
        }
        [HttpPut]
        public IActionResult Edit([FromBody] BookStore book)
        {
            var result = _bookService.Edit(book);
            return StatusCode(result.nStatusCode, result);
        }
        [HttpGet]
        public IActionResult GetAuthors()
        {
            var authors = _bookService.GetAllAuthors();
            return Ok(authors);
        }

        [HttpGet]
        public IActionResult GetCategories()
        {
            var categories = _bookService.GetAllCategories();
            return Ok(categories);
        }
    }
}
