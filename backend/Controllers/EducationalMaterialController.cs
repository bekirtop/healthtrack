using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using health.api.Data;
using health.api.Models;

namespace health.api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EducationalMaterialController : ControllerBase
    {
        private readonly AppDbContext _db;

        public EducationalMaterialController(AppDbContext db)
        {
            _db = db;
        }

        // GET: /api/EducationalMaterial
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var mats = await _db.EducationalMaterials
                .Include(m => m.Doctor)
                    .ThenInclude(d => d.User)
                .OrderByDescending(m => m.CreatedAt)
                .ToListAsync();

            return Ok(mats.Select(m => new
            {
                id = m.Id,
                doctorId = m.DoctorId,
                doctorName = m.Doctor.User.FullName,
                title = m.Title,
                content = m.Content,
                fileUrl = m.FileUrl,
                videoUrl = m.VideoUrl,
                createdAt = m.CreatedAt
            }));
        }

        // GET: /api/EducationalMaterial/doctor/{doctorId}
        [HttpGet("doctor/{doctorId}")]
        public async Task<IActionResult> GetByDoctor(int doctorId)
        {
            var mats = await _db.EducationalMaterials
                .Include(m => m.Doctor)
                    .ThenInclude(d => d.User)
                .Where(m => m.DoctorId == doctorId)
                .OrderByDescending(m => m.CreatedAt)
                .ToListAsync();

            return Ok(mats.Select(m => new
            {
                id = m.Id,
                doctorId = m.DoctorId,
                doctorName = m.Doctor.User.FullName,
                title = m.Title,
                content = m.Content,
                fileUrl = m.FileUrl,
                videoUrl = m.VideoUrl,
                createdAt = m.CreatedAt
            }));
        }

        // POST: /api/EducationalMaterial
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] EducationalMaterial material)
        {
            if (material == null) return BadRequest();

            _db.EducationalMaterials.Add(material);
            await _db.SaveChangesAsync();

            return Ok(material);
        }

        // DELETE: /api/EducationalMaterial/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var mat = await _db.EducationalMaterials.FindAsync(id);
            if (mat == null) return NotFound();

            _db.EducationalMaterials.Remove(mat);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Materyal silindi." });
        }
    }
}
