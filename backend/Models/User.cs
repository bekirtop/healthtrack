using System;
using System.ComponentModel.DataAnnotations;

namespace health.api.Models
{
    public class User
    {
        public int Id { get; set; }
        [Required, MaxLength(100)] public string FullName { get; set; }
        [Required, MaxLength(50)] public string Username { get; set; }
        [Required, MaxLength(255)] public string PasswordHash { get; set; }
        [Required, MaxLength(20)] public string Role { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
