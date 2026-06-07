
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
namespace TimetablesAPI.Models
{
    public class RegisterDto
    {
        public string Email { get; set;}
        public string Password { get; set;}
        public string? Name { get; set;}
        public string PasswordConfirmation { get; set;}
       

    }

    public class LoginDto
    {
        public string Email { get; set;}
        public string Password { get; set;}
    }
 
    
}