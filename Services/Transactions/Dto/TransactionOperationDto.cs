namespace Services.Transactions.Dto
{
    public class TransactionOperationDto
    {
        public decimal Amount { get; set; }
        public int RecipientId { get; set; }
        public int PayeeId { get; set; }
    }
}
