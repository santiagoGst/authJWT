using ApiAuth.Custom;
using ApiAuth.Data;
using ApiAuth.Models;
using ApiAuth.Models.DTOs;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ApiAuth.Controllers
{
    [Route("api/auth")]
    //[AllowAnonymous]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _appDbContext;
        private readonly Utilities _utilities;
        public AuthController(AppDbContext appDbContext, Utilities utilities)
        {
            _appDbContext = appDbContext;
            _utilities = utilities;
        }

        [HttpPost]
        [Route("signup")]
        public async Task<IActionResult> SignUp(SignUpDTO signUpDTO)
        {
            var newUser = new User
            {
                usr_user_name = signUpDTO.usr_user_name,
                usr_email = signUpDTO.usr_email,
                usr_password = _utilities.encriptarSHA256(signUpDTO.usr_password!)
            };

            await _appDbContext.Users.AddAsync(newUser);
            await _appDbContext.SaveChangesAsync();

            return newUser.usr_id != 0 ? StatusCode(StatusCodes.Status200OK, new { isSucces = true }) : StatusCode(StatusCodes.Status200OK, new { isSucces = false });
        }


        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> LogIn(LogInDTO logInDTO)
        {
            var userFound = await _appDbContext.Users.FirstOrDefaultAsync(usr => usr.usr_email == logInDTO.usr_email && usr.usr_password == _utilities.encriptarSHA256(logInDTO.usr_password!));
            if(userFound == null)
            {
                return StatusCode(StatusCodes.Status200OK, new { isSuccess = false, token="" });
            }
            else
            {
                return StatusCode(StatusCodes.Status200OK, new { isSuccess = true, token = _utilities.generarJWT(userFound), nameUser = userFound.usr_user_name });
            }
        }


        [HttpGet("contacts")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<ActionResult<List<User>>> GetContacts()
        {
            return Ok(await _appDbContext.Users.ToListAsync());        
        }
    }
}
