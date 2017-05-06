using Services.Transactions.Interface;
using System.Transactions;
using Services.Transactions.Dto;
using DatabaseLayer.Interfaces;
using DatabaseLayer.Entities;
using Services.Exceptions;
using System.Linq;
using Services.Common.Dto;

namespace Services.Transactions
{
    public class TransactionService : ITransactionService
    {
        private IRepositoryManager _repositoryManager;
        private ICommonRepository<DbTransaction> _transactionRepository => _repositoryManager.GetCommonRepository<DbTransaction>();
        private ICommonRepository<DbAccount> _accountRepository => _repositoryManager.GetCommonRepository<DbAccount>();
        private ICommonRepository<DbUser> _userRepository => _repositoryManager.GetCommonRepository<DbUser>();

        public TransactionService(IRepositoryManager repositoryManager)
        {
            _repositoryManager = repositoryManager;
        }

        public LastTransactionsDto GetLastTransactions(SearchTransactionsDto searchDto)
        {
            var payeeAccountid = _accountRepository.GetAll().FirstOrDefault(x => x.UserId == searchDto.UserId).Id;
            var transactionsList = _transactionRepository.GetAll()
                .Where(x => x.PayeeId == payeeAccountid)
                    //.GroupBy(x=>x.RecipientId)
                    //.OrderBy(x=>x.Count())
                    .Take(searchDto.TransactionsCount)
                    .ToArray()
                    .Select(x=> new TransactionDto {Id =x.Id,  Amount = x.Amount, Recipient = new IdNamePair { Id = x.Recipient.User.Id, Name = x.Recipient.User.Name } });

            return new LastTransactionsDto() { Transactions = transactionsList.ToArray() };
        }

        public decimal GetBalance(int userId)
        {
            try
            {
                return _accountRepository.GetAll().FirstOrDefault(x => x.UserId == userId).Balance;
            }catch
            {
                throw new ServiceException( ServiceExceptionType.EntityNotFound);
            }
        }

        public void MakeTransacrion(TransactionOperationDto dto)
        {
            using (var scope = new TransactionScope())
            {
                var payee = _accountRepository.GetAll().First(x=>x.UserId == dto.PayeeId);
                if (payee.Balance < dto.Amount)
                {
                    throw new ServiceException(ServiceExceptionType.NotEnoughtBalance);
                }

                payee.Balance -= dto.Amount;
                var recipient = _accountRepository.GetAll().FirstOrDefault(x => x.UserId == dto.RecipientId);
                recipient.Balance += dto.Amount;
                _transactionRepository.Add(new DbTransaction { Amount = dto.Amount, PayeeId = payee.Id, RecipientId = recipient.Id });

                _repositoryManager.SaveChanges();
                scope.Complete();
            }
        }
    }
}
