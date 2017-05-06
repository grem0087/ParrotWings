using Microsoft.IdentityModel.Tokens;
using Services.User.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Authentication
{

    public class TokenProviderOptions
    {
        public string Path { get; set; } = "/token";        
        public string Issuer { get; set; } = "Issuer";        
        public string Audience { get; set; } = "Audience";        
        public TimeSpan Expiration { get; set; } = TimeSpan.FromMinutes(5);        
        public SigningCredentials SigningCredentials { get; set; }
        public string SigningKey = "secretkey_secretkey123!";        
        public Func<string, string, Task<ClaimsIdentity>> IdentityResolver { get; set; }        
        public Func<Task<string>> NonceGenerator { get; set; } = () => Task.FromResult(Guid.NewGuid().ToString());
        public IUserService UserService;
    }

}
