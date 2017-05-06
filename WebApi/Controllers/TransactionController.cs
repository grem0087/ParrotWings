
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Services.Transactions.Interface;
using WebApi.Infrastructure;
using Services.Transactions.Dto;
using System.Security.Claims;
using System;

namespace WebApi.Controllers
{

    [Authorize]
    public class TransactionController : Controller
    {
        private ITransactionService _transactionService;

        public TransactionController(ITransactionService transactionService)
        {
            _transactionService = transactionService;
        }

        [HttpGet]
        public IActionResult GetBalance(int userId)
        {
            try
            {
                var rez = _transactionService.GetBalance(userId);
                return Json(JsonResultHelper.Success(rez));
            }
            catch (Exception ex)
            {
                return Json(JsonResultHelper.Error(ex.Message));
            }
        }

        public IActionResult GetTransactionsList(SearchTransactionsDto searchDto)
        {
            var transactions = _transactionService.GetLastTransactions( searchDto );
            return Json(JsonResultHelper.Success(transactions));
        }

        [HttpPost]
        public IActionResult MakeTransaction(TransactionOperationDto dto)
        {
            try
            {
                _transactionService.MakeTransacrion(dto);
                return Json(JsonResultHelper.Success());
            }
            catch (Exception ex)
            {
                return Json(JsonResultHelper.Error(ex.Message));
            }
        }
    }
}
