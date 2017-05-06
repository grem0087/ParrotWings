using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Services.User.Dto;
using Services.User.Interfaces;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
using WebApi.Authentication;
using WebApi.Infrastructure;

namespace WebApi.Controllers
{
    public class UsersController : Controller
    {
        private readonly TokenProviderOptions _options;
        private IUserService _userService;

        public UsersController(IUserService userService, IOptions<TokenProviderOptions> options)
        {
            _options = options.Value;
            _userService = userService;
        }
        
        [HttpPost]
        public IActionResult Register([FromBody]UserDto user)
        {
            try
            {
                _userService.Register(user);
                return Json(JsonResultHelper.Success());
            }
            catch (Exception ex)
            {
                return Json(JsonResultHelper.Error(ex.Message));
            }
        }

        [HttpGet]
        [Authorize]
        public IActionResult GetUsers(string input)
        {
            var rezult = _userService.GetUsersByString(input);
            return Json(JsonResultHelper.Success(rezult));
        }

        [HttpPost]
        public async Task SignIn(string email, string password)
        {
            var identity = GetIdentity(email, password);
            if (identity == null)
            {
                Response.StatusCode = 400;
                await Response.WriteAsync("Invalid username or password.");
                return;
            }

            var now = DateTime.UtcNow;
            var jwt = new JwtSecurityToken(
                    issuer: _options.Issuer,
                    audience: _options.Audience,
                    notBefore: now,
                    claims: identity.Claims,
                    expires: now.Add(_options.Expiration),
                    signingCredentials: new SigningCredentials(new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_options.SigningKey)), SecurityAlgorithms.HmacSha256));
            var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);

            var response = new
            {
                access_token = encodedJwt,
                userId = identity.Claims.FirstOrDefault(x => x.Type == "Id").Value,
                userName = identity.Claims.FirstOrDefault(x => x.Type == "Name").Value,
                expires_in = (int)_options.Expiration.TotalSeconds
            };

            Response.ContentType = "application/json";

            await Response.WriteAsync(JsonConvert.SerializeObject(response, new JsonSerializerSettings { Formatting = Formatting.Indented }));
        }

        private ClaimsIdentity GetIdentity(string email, string password)
        {
            var user = _userService.Login(email, password);
            if (user != null)
            {
                var claims = new[]
                {
                    new Claim("Name", user.Name),
                    new Claim("Id", user.Id.ToString()),
                };
                return new ClaimsIdentity(new GenericIdentity(email, "Token"), claims);
            }
            
            return null;
        }
    }
}
