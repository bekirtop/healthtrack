using System;
using System.ComponentModel.DataAnnotations;

namespace health.api.Models
{
    public class SideEffect
    {
        public int Id { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public int PatientId { get; set; }
        public Patient Patient { get; set; }

        public int? MedicationId { get; set; }
        public Medication? Medication { get; set; }

        [Required, MaxLength(500)]
        public string Description { get; set; }

        [MaxLength(50)]
        public string? Severity { get; set; }

        public DateTime Date { get; set; } = DateTime.UtcNow;
    }
}
