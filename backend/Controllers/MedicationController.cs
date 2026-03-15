using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using health.api.Data;
using health.api.Models;

namespace health.api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MedicationController : ControllerBase
    {
        private readonly AppDbContext _db;

        public MedicationController(AppDbContext db)
        {
            _db = db;
        }

        // POST: /api/Medication
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Medication medication)
        {
            if (medication == null)
                return BadRequest("Eksik veri.");

            // İlaç kaydını ekle
            _db.Medications.Add(medication);
            await _db.SaveChangesAsync();

            // FrequencyPerDay'e göre otomatik DoseSchedule oluştur (Eğer liste boş gelmişse)
            if (medication.FrequencyPerDay > 0 && (medication.DoseSchedules == null || medication.DoseSchedules.Count == 0))
            {
                var schedules = new List<MedicationDoseSchedule>();
                var hoursInterval = 24 / medication.FrequencyPerDay;

                for (int i = 0; i < medication.FrequencyPerDay; i++)
                {
                    var scheduleTime = new TimeSpan(i * hoursInterval, 0, 0);
                    var dateTime = DateTime.Today.Add(scheduleTime);
                    
                    schedules.Add(new MedicationDoseSchedule
                    {
                        MedicationId = medication.Id,
                        ScheduledTime = dateTime
                    });
                }

                _db.MedicationDoseSchedules.AddRange(schedules);
                await _db.SaveChangesAsync();
            }
            // NOT: Eğer medication.DoseSchedules dolu gelmişse, 
            // üstteki _db.Medications.Add(medication) ve SaveChanges zaten onları kaydetti.
            // Tekrar AddRange yapmaya gerek yok, hata verir.

            return Ok(medication);
        }

        // GET: /api/Medication/list/{patientId}
        [HttpGet("list/{patientId}")]
        public async Task<IActionResult> GetByPatient(int patientId)
        {
            var meds = await _db.Medications
                .Where(m => m.PatientId == patientId)
                .Include(m => m.DoseSchedules)
                .Include(m => m.MedicationRecords)
                .ToListAsync();

            return Ok(meds);
        }

        // GET: /api/Medication/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var med = await _db.Medications
                .Include(m => m.DoseSchedules)
                .Include(m => m.MedicationRecords)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (med == null)
                return NotFound();

            return Ok(med);
        }

        // PUT: /api/Medication/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Medication updated)
        {
            var existing = await _db.Medications.FindAsync(id);
            if (existing == null) return NotFound();

            existing.Name = updated.Name ?? existing.Name;
            existing.Dose = updated.Dose ?? existing.Dose;
            existing.FrequencyPerDay = updated.FrequencyPerDay != 0 ? updated.FrequencyPerDay : existing.FrequencyPerDay;
            existing.DurationDays = updated.DurationDays != 0 ? updated.DurationDays : existing.DurationDays;
            existing.StartDate = updated.StartDate != default ? updated.StartDate : existing.StartDate;
            existing.EndDate = updated.EndDate != default ? updated.EndDate : existing.EndDate;
            existing.Notes = updated.Notes ?? existing.Notes;

            await _db.SaveChangesAsync();
            return Ok(existing);
        }

        // DELETE: /api/Medication/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var med = await _db.Medications.FindAsync(id);
            if (med == null) return NotFound();

            _db.Medications.Remove(med);
            await _db.SaveChangesAsync();
            return Ok(new { message = "Silindi" });
        }

        // POST: /api/Medication/{id}/markTaken
        [HttpPost("{id}/markTaken")]
        public async Task<IActionResult> MarkTaken(int id, [FromBody] MarkTakenDto dto)
        {
            var medication = await _db.Medications
                .Include(m => m.DoseSchedules)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (medication == null)
                return NotFound("İlaç bulunamadı.");

            var schedule = await _db.MedicationDoseSchedules.FindAsync(dto.DoseScheduleId);
            if (schedule == null)
                return NotFound("Doz planı bulunamadı.");

            var record = new MedicationRecord
            {
                MedicationId = id,
                DoseScheduleId = schedule.Id,
                IsTaken = true,
                TakenAt = DateTime.UtcNow
            };

            _db.MedicationRecords.Add(record);
            await _db.SaveChangesAsync();

            return Ok(new { message = "Doz alındı olarak işaretlendi.", record });
        }
    }

    // DTO burada tutulabilir ya da ayrı DTO klasörüne konabilir
    public class MarkTakenDto
    {
        public int DoseScheduleId { get; set; }
    }
}
