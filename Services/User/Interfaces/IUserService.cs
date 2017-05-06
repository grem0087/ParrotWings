using Services.Common.Dto;
using Services.User.Dto;
using System.Collections.Generic;

namespace Services.User.Interfaces
{
    public interface IUserService
    {
        void Register(UserDto user);
        UserDto Login(string email, string password);
        ICollection<UserDto> GetAll();
        ICollection<IdNamePair> GetUsersByString(string input);
    }
}
