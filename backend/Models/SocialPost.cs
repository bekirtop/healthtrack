using System;

namespace health.api.Models
{
    public class SocialPost
    {
        public int Id { get; set; }
        
        public int DoctorId { get; set; }
        public Doctor Doctor { get; set; }
        
        public required string ImageUrl { get; set; }
        public required string Caption { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
