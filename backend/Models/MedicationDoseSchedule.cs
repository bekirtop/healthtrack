using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace health.api.Models
{
    public class MedicationDoseSchedule
    {
        public int Id { get; set; }
        public int MedicationId { get; set; }
        [System.Text.Json.Serialization.JsonIgnore]
        public Medication? Medication { get; set; }

        [Required]
        public DateTime ScheduledTime { get; set; }

        [MaxLength(255)]
        public string? Notes { get; set; }

        public ICollection<MedicationRecord>? Records { get; set; }
    }
}
