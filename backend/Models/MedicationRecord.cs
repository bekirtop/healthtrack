using System;

namespace health.api.Models
{
    public class MedicationRecord
    {
        public int Id { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public int MedicationId { get; set; }
        public Medication Medication { get; set; }

        public int DoseScheduleId { get; set; }
        public MedicationDoseSchedule DoseSchedule { get; set; }

        public DateTime RecordDate { get; set; } = DateTime.UtcNow;
        public bool IsTaken { get; set; }
        public DateTime? TakenAt { get; set; }
    }
}
