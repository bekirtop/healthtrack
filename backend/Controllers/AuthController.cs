using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using health.api.Data;
using health.api.Models;
using health.api.DTOs;
using health.api.Services;

namespace health.api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly JwtService _jwt;

        public AuthController(AppDbContext db, JwtService jwt)
        {
            _db = db;
            _jwt = jwt;
        }

        private static string Hash(string input)
        {
            using var sha = SHA256.Create();
            var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(input));
            return BitConverter.ToString(bytes).Replace("-", "").ToLower();
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Username) || string.IsNullOrWhiteSpace(dto.Password))
                return BadRequest("Kullanıcı adı ve şifre zorunludur.");

            if (await _db.Users.AnyAsync(x => x.Username == dto.Username))
                return Conflict("Bu kullanıcı adı zaten alınmış.");

            var user = new User
            {
                FullName = dto.FullName ?? dto.Username,
                Username = dto.Username,
                PasswordHash = Hash(dto.Password),
                Role = dto.Role ?? "Patient"
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            if (user.Role == "Doctor")
            {
                var doctor = new Doctor { UserId = user.Id, Department = dto.Department };
                _db.Doctors.Add(doctor);
            }
            else if (user.Role == "Patient")
            {
                var patient = new Patient { UserId = user.Id, Diagnosis = dto.Diagnosis };
                _db.Patients.Add(patient);
            }

            await _db.SaveChangesAsync();
            return Ok(new { message = "Kayıt başarılı.", user.Id, user.Role });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            if (dto.Username == null || dto.Password == null)
                return BadRequest("Eksik bilgi.");

            var hashed = Hash(dto.Password);
            var user = await _db.Users.FirstOrDefaultAsync(x => x.Username == dto.Username && x.PasswordHash == hashed);

            if (user == null)
                return Unauthorized("Kullanıcı adı veya şifre hatalı.");

            var token = _jwt.GenerateToken(user);
            return Ok(new { token, user.Id, user.FullName, user.Role });
        }
    }
}
