using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using health.api.Data;
using health.api.Models;

namespace health.api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SideEffectController : ControllerBase
    {
        private readonly AppDbContext _db;

        public SideEffectController(AppDbContext db)
        {
            _db = db;
        }

        // POST: /api/SideEffect/report
        [HttpPost("report")]
        public async Task<IActionResult> Report([FromBody] ReportSideEffectDto dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.Description))
                return BadRequest("Geçersiz yan etki verisi.");

            var sideEffect = new SideEffect
            {
                PatientId = dto.PatientId,
                MedicationId = dto.MedicationId,
                Description = dto.Description!,
                Severity = dto.Severity,
                Date = DateTime.UtcNow
            };

            _db.SideEffects.Add(sideEffect);
            await _db.SaveChangesAsync();
            return Ok(sideEffect);
        }

        // GET: /api/SideEffect/list/{patientId}
        [HttpGet("list/{patientId}")]
        public async Task<IActionResult> GetByPatient(int patientId)
        {
            var list = await _db.SideEffects
                .Include(s => s.Medication)
                .Where(s => s.PatientId == patientId)
                .OrderByDescending(s => s.Date)
                .ToListAsync();

            return Ok(list);
        }

        // GET: /api/SideEffect/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var effect = await _db.SideEffects
                .Include(s => s.Medication)
                .Include(s => s.Patient)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (effect == null)
                return NotFound();

            return Ok(effect);
        }

        // DELETE: /api/SideEffect/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var effect = await _db.SideEffects.FindAsync(id);
            if (effect == null)
                return NotFound();

            _db.SideEffects.Remove(effect);
            await _db.SaveChangesAsync();
            return Ok(new { message = "Yan etki silindi." });
        }
    }

    public class ReportSideEffectDto
    {
        public int PatientId { get; set; }
        public int? MedicationId { get; set; }
        public string? Description { get; set; }
        public string? Severity { get; set; }
    }
}
