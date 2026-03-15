using System;
using System.Collections.Generic;

namespace health.api.Models
{
    public class Patient
    {
        public int Id { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public int UserId { get; set; }
        public User User { get; set; }
        public string? Diagnosis { get; set; } // Geriye dönük uyumluluk için tutuldu
        public DateTime? DischargeDate { get; set; }

        public int? DoctorId { get; set; }
        public Doctor? Doctor { get; set; }
        public ICollection<Medication>? Medications { get; set; }
        public ICollection<SideEffect>? SideEffects { get; set; }
        public ICollection<PatientDiagnosis>? Diagnoses { get; set; }
    }
}
