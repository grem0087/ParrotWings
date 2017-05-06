using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Services.Transactions.Interface;
using WebApi.Infrastructure;

namespace WebApi.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        private ITransactionService _transactionService;

        public HomeController(ITransactionService transactionService)
        {
            _transactionService = transactionService;
        }

        public IActionResult Index()
        {
            return Json(new { request = "Index" });
        }              
    }
}
