using System.Security.Claims;

namespace Services.User.Dto
{
    public interface IUser {
        string Name { get; set; }
    }
    public class UserDto : ClaimsIdentity
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
