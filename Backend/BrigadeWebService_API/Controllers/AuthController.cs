using BrigadeWebService_BLL.Dto.Authorization;
using BrigadeWebService_BLL.Services.Interfaces;
using BrigadeWebService_DAL.Data;
using BrigadeWebService_DAL.Entities;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BrigadeWebService_API.Controllers
{
    [ApiController]
    [Route("api/[controller]/")]
    public class AuthController : Controller
    {
        private readonly AppDbContext _db;
        private readonly ITokenService _tokenService;

        public AuthController(AppDbContext db, ITokenService tokenService)
        {
            _db = db;
            _tokenService = tokenService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(BrigadeWebService_BLL.Dto.Authorization.LoginRequest request)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Username == request.Username);

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                return Unauthorized(new { error = "Invalid credentials" });

            var token = _tokenService.GenerateToken(user);
            return Ok(new LoginResponse(token));
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] BrigadeWebService_BLL.Dto.Authorization.LoginRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // нормалізуємо логін, щоб унікальність була передбачувана
            var normalized = request.Username.Trim();
            if (string.IsNullOrWhiteSpace(normalized))
                return BadRequest(new { error = "Username is required" });

            var exists = await _db.Users.AnyAsync(u => u.Username == normalized);
            if (exists)
                return Conflict(new { error = "Username already taken" });

            // хеш паролю (BCrypt.Net-Next пакет)
            // Рекомендовано WorkFactor 10–12 для деву/проду (балансуй під ресурси)
            var hash = BCrypt.Net.BCrypt.HashPassword(request.Password, workFactor: 11);

            var user = new User
            {
                Username = normalized,
                PasswordHash = hash,
                // за потреби додай інші поля: Email, Roles, CreatedAt = DateTime.UtcNow тощо
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            // одразу видати JWT (можеш повернути 201 без токена — на твій вибір)
            var token = _tokenService.GenerateToken(user);

            // 201 Created + мінімальне тіло (без чутливих полів)
            return NoContent();
        }
    }
}
