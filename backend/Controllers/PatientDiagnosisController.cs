using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using health.api.Data;
using health.api.Models;

namespace health.api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PatientDiagnosisController : ControllerBase
    {
        private readonly AppDbContext _db;

        public PatientDiagnosisController(AppDbContext db)
        {
            _db = db;
        }

        // GET: /api/PatientDiagnosis/{patientId}
        [HttpGet("{patientId}")]
        public async Task<IActionResult> GetByPatient(int patientId)
        {
            var exists = await _db.Patients.AnyAsync(p => p.Id == patientId);
            if (!exists) return NotFound(new { message = "Hasta bulunamadı." });

            var diagnoses = await _db.PatientDiagnoses
                .Where(d => d.PatientId == patientId)
                .OrderByDescending(d => d.DiagnosedAt)
                .ToListAsync();

            return Ok(diagnoses);
        }

        // POST: /api/PatientDiagnosis
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateDiagnosisDto dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.Diagnosis))
                return BadRequest(new { message = "Tanı açıklaması zorunludur." });

            var exists = await _db.Patients.AnyAsync(p => p.Id == dto.PatientId);
            if (!exists) return NotFound(new { message = "Hasta bulunamadı." });

            var diagnosis = new PatientDiagnosis
            {
                PatientId = dto.PatientId,
                Diagnosis = dto.Diagnosis,
                Notes = dto.Notes,
                DiagnosedAt = dto.DiagnosedAt ?? DateTime.UtcNow
            };

            _db.PatientDiagnoses.Add(diagnosis);
            await _db.SaveChangesAsync();

            return Ok(diagnosis);
        }

        // PUT: /api/PatientDiagnosis/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CreateDiagnosisDto dto)
        {
            var diagnosis = await _db.PatientDiagnoses.FindAsync(id);
            if (diagnosis == null) return NotFound(new { message = "Tanı bulunamadı." });

            diagnosis.Diagnosis = dto.Diagnosis ?? diagnosis.Diagnosis;
            diagnosis.Notes = dto.Notes ?? diagnosis.Notes;
            if (dto.DiagnosedAt.HasValue)
                diagnosis.DiagnosedAt = dto.DiagnosedAt.Value;

            await _db.SaveChangesAsync();
            return Ok(diagnosis);
        }

        // DELETE: /api/PatientDiagnosis/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var diagnosis = await _db.PatientDiagnoses.FindAsync(id);
            if (diagnosis == null) return NotFound(new { message = "Tanı bulunamadı." });

            _db.PatientDiagnoses.Remove(diagnosis);
            await _db.SaveChangesAsync();
            return Ok(new { message = "Tanı silindi." });
        }
    }

    public class CreateDiagnosisDto
    {
        public int PatientId { get; set; }
        public string Diagnosis { get; set; }
        public string? Notes { get; set; }
        public DateTime? DiagnosedAt { get; set; }
    }
}
