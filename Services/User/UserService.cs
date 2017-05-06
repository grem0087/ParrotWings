using Services.User.Interfaces;
using DatabaseLayer.Interfaces;
using System.Linq;
using Services.User.Dto;
using DatabaseLayer.Entities;
using System.Collections.Generic;
using Services.Exceptions;
using Services.Common.Dto;

namespace Services.User
{
    public class UserService : IUserService
    {
        private IRepositoryManager _repositoryManager;
        private ICommonRepository<DbUser> _userRepository => _repositoryManager.GetCommonRepository<DbUser>();

        public UserService(IRepositoryManager repositoryManager)
        {
            _repositoryManager = repositoryManager;
        }

        public ICollection<IdNamePair> GetUsersByString(string input)
        {
            return _userRepository.GetAll()
                    .Where(x => x.Name.ToLower().Contains(input.ToLower()))
                    .Select(x=>new IdNamePair { Id = x.Id, Name = x.Name })
                    .ToArray();
        }

        public ICollection<UserDto> GetAll()
        {
            return _userRepository.GetAll().Select(x => new UserDto { Email = x.Email, Name = x.Name, Password = x.Password }).ToArray();
        }

        public void Register(UserDto user)
        {
            if (_userRepository.GetAll().Where(x => x.Email == user.Email).Any())
            {
                throw new ServiceException(ServiceExceptionType.UserAlreadyExist);
            }

            var _user = new DbUser { Email = user.Email, Name = user.Name, Password = user.Password };
            var _account = new DbAccount { UserId = _user.Id, Balance = 100 };
            _userRepository.Add(_user);

            _repositoryManager.GetCommonRepository<DbAccount>().Add(_account);
            _repositoryManager.SaveChanges();
        }

        public UserDto Login(string email, string password)
        {
            var rezult = _userRepository
                .GetAll()
                .FirstOrDefault(x => x.Email == email && x.Password == password);

            if (rezult != null)
            {
                return new UserDto
                {
                    Id = rezult.Id,
                    Email = rezult.Email,
                    Password = rezult.Password,
                    Name = rezult.Name
                };
            }

            return null;            
        }
    }
}
