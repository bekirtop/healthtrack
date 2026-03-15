using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using health.api.Data;
using health.api.Models;

namespace health.api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DoctorController : ControllerBase
    {
        private readonly AppDbContext _db;

        public DoctorController(AppDbContext db)
        {
            _db = db;
        }

        // GET: /api/Doctor
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var doctors = await _db.Doctors
                .Include(d => d.User)
                .Include(d => d.Patients)
                    .ThenInclude(p => p.User)
                .ToListAsync();

            return Ok(doctors);
        }

        // GET: /api/Doctor/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var doctor = await _db.Doctors
                .Include(d => d.User)
                .Include(d => d.Patients)
                .FirstOrDefaultAsync(d => d.Id == id);

            if (doctor == null)
                return NotFound();

            return Ok(doctor);
        }

        // POST: /api/Doctor
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Doctor doctor)
        {
            if (doctor == null)
                return BadRequest("Geçersiz veri.");

            _db.Doctors.Add(doctor);
            await _db.SaveChangesAsync();

            return Ok(doctor);
        }

        // PUT: /api/Doctor/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Doctor updated)
        {
            var existing = await _db.Doctors.FindAsync(id);
            if (existing == null)
                return NotFound();

            existing.Department = updated.Department ?? existing.Department;

            await _db.SaveChangesAsync();
            return Ok(existing);
        }

        // DELETE: /api/Doctor/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var doctor = await _db.Doctors.FindAsync(id);
            if (doctor == null)
                return NotFound();

            _db.Doctors.Remove(doctor);
            await _db.SaveChangesAsync();
            return Ok(new { message = "Doktor silindi." });
        }

        // GET: /api/Doctor/{doctorId}/patients
        // Belirli bir doktorun atanmış hastalarını listeler
        [HttpGet("{doctorId}/patients")]
        public async Task<IActionResult> GetDoctorPatients(int doctorId)
        {
            var doctor = await _db.Doctors.FindAsync(doctorId);
            if (doctor == null)
                return NotFound(new { message = "Doktor bulunamadı." });

            var patients = await _db.Patients
                .Include(p => p.User)
                .Where(p => p.DoctorId == doctorId)
                .Select(p => new
                {
                    patientId = p.Id,
                    patientName = p.User.FullName,
                    patientDiagnosis = p.Diagnosis,
                    dischargeDate = p.DischargeDate,
                    assignedAt = p.CreatedAt
                })
                .OrderByDescending(p => p.assignedAt)
                .ToListAsync();

            return Ok(patients);
        }
    }
}
