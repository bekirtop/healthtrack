using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using health.api.Data;
using health.api.Models;

namespace health.api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MedicationRecordController : ControllerBase
    {
        private readonly AppDbContext _db;

        public MedicationRecordController(AppDbContext db)
        {
            _db = db;
        }

        // GET: /api/MedicationRecord/list/{patientId}
        [HttpGet("list/{patientId}")]
        public async Task<IActionResult> GetByPatient(int patientId)
        {
            var records = await _db.MedicationRecords
                .Include(r => r.Medication)
                .Include(r => r.DoseSchedule)
                .Where(r => r.Medication.PatientId == patientId)
                .ToListAsync();

            return Ok(records);
        }

        // GET: /api/MedicationRecord/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var record = await _db.MedicationRecords
                .Include(r => r.Medication)
                .Include(r => r.DoseSchedule)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (record == null)
                return NotFound();

            return Ok(record);
        }

        // POST: /api/MedicationRecord
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateRecordDto dto)
        {
            if (dto == null)
                return BadRequest("Eksik veri.");

            var record = new MedicationRecord
            {
                MedicationId = dto.MedicationId,
                DoseScheduleId = dto.DoseScheduleId,
                IsTaken = dto.IsTaken,
                RecordDate = DateTime.UtcNow,
                TakenAt = dto.IsTaken ? DateTime.UtcNow : null
            };

            _db.MedicationRecords.Add(record);
            await _db.SaveChangesAsync();
            return Ok(record);
        }

        // DELETE: /api/MedicationRecord/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var record = await _db.MedicationRecords.FindAsync(id);
            if (record == null)
                return NotFound();

            _db.MedicationRecords.Remove(record);
            await _db.SaveChangesAsync();
            return Ok(new { message = "Silindi" });
        }
    }

    public class CreateRecordDto
    {
        public int MedicationId { get; set; }
        public int DoseScheduleId { get; set; }
        public bool IsTaken { get; set; }
    }
}
