using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using health.api.Data;
using health.api.Models;

namespace health.api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SocialPostController : ControllerBase
    {
        private readonly AppDbContext _db;

        public SocialPostController(AppDbContext db)
        {
            _db = db;
        }

        // GET: /api/SocialPost
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var posts = await _db.SocialPosts
                .Include(p => p.Doctor)
                    .ThenInclude(d => d.User)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            return Ok(posts.Select(p => new
            {
                id = p.Id,
                doctorId = p.DoctorId,
                doctorName = p.Doctor.User.FullName,
                imageUrl = p.ImageUrl,
                caption = p.Caption,
                createdAt = p.CreatedAt
            }));
        }

        // GET: /api/SocialPost/doctor/{doctorId}
        [HttpGet("doctor/{doctorId}")]
        public async Task<IActionResult> GetByDoctor(int doctorId)
        {
            var posts = await _db.SocialPosts
                .Include(p => p.Doctor)
                    .ThenInclude(d => d.User)
                .Where(p => p.DoctorId == doctorId)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();

            return Ok(posts.Select(p => new
            {
                id = p.Id,
                doctorId = p.DoctorId,
                doctorName = p.Doctor.User.FullName,
                imageUrl = p.ImageUrl,
                caption = p.Caption,
                createdAt = p.CreatedAt
            }));
        }

        // POST: /api/SocialPost
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] SocialPost post)
        {
            if (post == null)
                return BadRequest("Geçersiz veri.");

            _db.SocialPosts.Add(post);
            await _db.SaveChangesAsync();

            return Ok(post);
        }

        // DELETE: /api/SocialPost/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var post = await _db.SocialPosts.FindAsync(id);
            if (post == null) return NotFound();

            _db.SocialPosts.Remove(post);
            await _db.SaveChangesAsync();
            return Ok(new { message = "Post silindi." });
        }
    }
}
