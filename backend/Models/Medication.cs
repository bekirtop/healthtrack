using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace health.api.Models
{
    public class Medication
    {
        public int Id { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public int PatientId { get; set; }
        public Patient? Patient { get; set; } // ← BURASI DEĞİŞTİ

        [Required, MaxLength(100)]
        public string Name { get; set; }

        [Required, MaxLength(50)]
        public string Dose { get; set; }

        public int FrequencyPerDay { get; set; }
        public int DurationDays { get; set; }

        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        [MaxLength(255)]
        public string? Notes { get; set; }

        public ICollection<MedicationDoseSchedule>? DoseSchedules { get; set; }
        public ICollection<MedicationRecord>? MedicationRecords { get; set; }
        public ICollection<SideEffect>? SideEffects { get; set; }
    }
}
