using Services.Common.Dto;
using System;

namespace Services.Transactions.Dto
{
    public class LastTransactionsDto
    {
        public TransactionDto[] Transactions { get; set; }
    }

    public class TransactionDto
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public IdNamePair Recipient { get; set; }
        public decimal Amount { get; set; }
    }
}