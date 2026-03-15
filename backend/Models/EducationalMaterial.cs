using System;

namespace health.api.Models
{
    public class EducationalMaterial
    {
        public int Id { get; set; }
        
        public int DoctorId { get; set; }
        public Doctor Doctor { get; set; }

        public required string Title { get; set; }
        public required string Content { get; set; }
        public string? FileUrl { get; set; }
        public string? VideoUrl { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
