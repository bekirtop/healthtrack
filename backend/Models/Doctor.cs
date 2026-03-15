using System;
using System.Collections.Generic;

namespace health.api.Models
{
    public class Doctor
    {
        public int Id { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public int UserId { get; set; }
        public User User { get; set; }
        public string? Department { get; set; }
        public ICollection<Patient>? Patients { get; set; }
        
        public ICollection<SocialPost>? SocialPosts { get; set; }
        public ICollection<EducationalMaterial>? EducationalMaterials { get; set; }
    }
}
