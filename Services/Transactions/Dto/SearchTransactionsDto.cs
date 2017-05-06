namespace Services.Transactions.Dto
{
    public class SearchTransactionsDto
    {
        public int UserId {get; set;}
        public int TransactionsCount { get; set; } = 20;
    }
}
