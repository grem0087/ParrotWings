using Services.Transactions.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Transactions.Interface
{
    public interface ITransactionService
    {
        decimal GetBalance(int userId);

        void MakeTransacrion(TransactionOperationDto dto);

        LastTransactionsDto GetLastTransactions(SearchTransactionsDto searchDto);
    }
}
