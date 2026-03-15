using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using health.api.Data;
using health.api.Models;
using System.Threading.Tasks;
using System.Linq;

namespace health.api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PatientController : ControllerBase
    {
        private readonly AppDbContext _db;

        public PatientController(AppDbContext db)
        {
            _db = db;
        }

        // DTO (controller içinde)
        public class PatientListDto
        {
            public int Id { get; set; }
            public int UserId { get; set; }
            public string? FullName { get; set; }
            public string? Diagnosis { get; set; }
            public int? DoctorId { get; set; }
            public DateTime? DischargeDate { get; set; }
            public UserSummaryDto User { get; set; }
        }

        public class UserSummaryDto
        {
            public int Id { get; set; }
            public string? FullName { get; set; }
            public string? Username { get; set; }
        }

        // GET: /api/Patient
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var patients = await _db.Patients
                .Include(p => p.User)
                .Select(p => new PatientListDto
                {
                    Id = p.Id,
                    UserId = p.UserId,
                    FullName = p.User.FullName,
                    Diagnosis = p.Diagnosis,
                    DoctorId = p.DoctorId,
                    DischargeDate = p.DischargeDate,
                    User = p.User != null ? new UserSummaryDto { Id = p.User.Id, FullName = p.User.FullName, Username = p.User.Username } : null
                })
                .ToListAsync();

            return Ok(patients);
        }

        // GET: /api/Patient/by-user/{userId}
        [HttpGet("by-user/{userId}")]
        public async Task<IActionResult> GetByUserId(int userId)
        {
            var patient = await _db.Patients
                .Include(p => p.User)
                .Where(p => p.UserId == userId)
                .Select(p => new PatientListDto
                {
                    Id = p.Id,
                    UserId = p.UserId,
                    FullName = p.User != null ? p.User.FullName : null,
                    Diagnosis = p.Diagnosis,
                    DoctorId = p.DoctorId,
                    DischargeDate = p.DischargeDate,
                    User = p.User != null ? new UserSummaryDto { Id = p.User.Id, FullName = p.User.FullName, Username = p.User.Username } : null
                })
                .FirstOrDefaultAsync();

            if (patient == null) return NotFound(new { message = "Bu kullanıcıya ait hasta kayıdı bulunamadı." });
            return Ok(patient);
        }

        // GET: /api/Patient/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var patient = await _db.Patients
                .Include(p => p.User)
                .Where(p => p.Id == id)
                .Select(p => new PatientListDto
                {
                    Id = p.Id,
                    UserId = p.UserId,
                    FullName = p.User != null ? p.User.FullName : null,
                    Diagnosis = p.Diagnosis,
                    DoctorId = p.DoctorId,
                    DischargeDate = p.DischargeDate
                })
                .FirstOrDefaultAsync();

            if (patient == null)
                return NotFound();

            return Ok(patient);
        }

        // POST: /api/Patient
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Patient patient)
        {
            _db.Patients.Add(patient);
            await _db.SaveChangesAsync();
            return Ok(patient);
        }

        // PUT: /api/Patient/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Patient updated)
        {
            var existing = await _db.Patients.FindAsync(id);
            if (existing == null) return NotFound();

            existing.Diagnosis = updated.Diagnosis ?? existing.Diagnosis;
            existing.DischargeDate = updated.DischargeDate ?? existing.DischargeDate;

            await _db.SaveChangesAsync();
            return Ok(existing);
        }

        // DELETE: /api/Patient/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var patient = await _db.Patients
                .Include(p => p.User)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (patient == null) return NotFound();

            if (patient.User != null)
            {
                // User'ı silmek cascade ile Patient, Medication vb. her şeyi siler
                _db.Users.Remove(patient.User);
            }
            else
            {
                _db.Patients.Remove(patient);
            }

            await _db.SaveChangesAsync();
            return Ok(new { message = "Hasta ve bağlı kullanıcı hesabı silindi." });
        }

        // GET: /api/Patient/{id}/medications
        [HttpGet("{id}/medications")]
        public async Task<IActionResult> GetMedicationsByPatient(int id)
        {
            var meds = await _db.Medications
                .Where(m => m.PatientId == id)
                .Include(m => m.DoseSchedules)
                .Include(m => m.MedicationRecords)
                .ToListAsync();

            return Ok(meds);
        }

        // POST: /api/Patient/{id}/assign-doctor/{doctorId}
        [HttpPost("{id}/assign-doctor/{doctorId}")]
        public async Task<IActionResult> AssignDoctor(int id, int doctorId)
        {
            var patient = await _db.Patients.FindAsync(id);
            if (patient == null) return NotFound("Hasta bulunamadı.");

            var doctor = await _db.Doctors.FindAsync(doctorId);
            if (doctor == null) return NotFound("Doktor bulunamadı.");

            patient.DoctorId = doctorId;
            await _db.SaveChangesAsync();

            return Ok(new { message = "Hasta başarıyla doktora atandı." });
        }

        // POST: /api/Patient/{id}/unassign-doctor
        [HttpPost("{id}/unassign-doctor")]
        public async Task<IActionResult> UnassignDoctor(int id)
        {
            var patient = await _db.Patients.FindAsync(id);
            if (patient == null) return NotFound("Hasta bulunamadı.");

            patient.DoctorId = null;
            await _db.SaveChangesAsync();

            return Ok(new { message = "Hastanın doktor ataması kaldırıldı." });
        }
    }
}
