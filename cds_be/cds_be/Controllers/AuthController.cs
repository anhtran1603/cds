using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using cds_be.Models;
using System.Linq;
using System.Threading.Tasks;
using System;
using Microsoft.EntityFrameworkCore;

namespace cds_be.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLogin login)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.UserName == login.UserName && u.PasswordHash == login.Password);

            if (user == null)
            {
                return Unauthorized("Invalid username or password");
            }
            var result = new
            {
                message = "Login successful",
                user  = new
                {
                    username = user.UserName,
                    fullname = user.FullName,
                    roleId = user.RoleID
                }
               
            };

            return Ok(result);
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            HttpContext.Session.Clear();
            return Ok("Logout successful");
        }

        [HttpGet("role/{roleId}")]
        public async Task<ActionResult<IEnumerable<Users>>> GetUsersByRole(int roleId)
        {
            var users = await _context.Users.Where(u => u.RoleID == roleId).ToListAsync();

            if (users == null || users.Count == 0)
            {
                return NotFound();
            }

            return users;
        }
    }
}