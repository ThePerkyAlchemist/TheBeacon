using TheBeaconCocktails.API.Model;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace TheBeaconCocktails.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        // In real world application, these would be saved in a database
        private const string USERNAME = "john.doe";
        private const string PASSWORD = "VerySecret!";
        [AllowAnonymous]
        [HttpPost]
        public ActionResult Login([FromBody] Login credentials)
        {
            if (credentials.Username == USERNAME && credentials.Password == PASSWORD)
            {
                // 1. Concatenate username and password with a semicolon
                var text = $"{credentials.Username}:{credentials.Password}";
                // 2. Base64encode the above
                var bytes = System.Text.Encoding.Default.GetBytes(text);
                var encodedCredentials = Convert.ToBase64String(bytes);
                // 3. Prefix with Basic
                var headerValue = $"Basic {encodedCredentials}";
                return Ok(new { headerValue = headerValue });
            }
            else
            {
                return Unauthorized();
            }
        }
    }
}