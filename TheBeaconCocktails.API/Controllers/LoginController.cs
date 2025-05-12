using TheBeaconCocktails.API.Model;
using TheBeaconCocktails.API.Middleware; //  add this
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace TheBeaconCocktails.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private const string USERNAME = "thebeacon.admin";
        private const string PASSWORD = "Youshallpass!";

        [AllowAnonymous]
        [HttpPost]
        public ActionResult Login([FromBody] Login credentials)
        {
            if (credentials.Username == USERNAME && credentials.Password == PASSWORD)
            {
                var headerValue = AuthenticationHelper.Encrypt(credentials.Username, credentials.Password);
                return Ok(new { headerValue = headerValue });
            }
            else
            {
                return Unauthorized();
            }
        }
    }
}
