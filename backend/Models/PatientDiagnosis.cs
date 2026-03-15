using System;
using System.ComponentModel.DataAnnotations;

namespace health.api.Models
{
    public class PatientDiagnosis
    {
        public int Id { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public int PatientId { get; set; }
        public Patient Patient { get; set; }

        [Required, MaxLength(255)] public required string Diagnosis { get; set; }

        public DateTime DiagnosedAt { get; set; } = DateTime.UtcNow;

        [MaxLength(1000)]
        public string? Notes { get; set; }
    }
}
