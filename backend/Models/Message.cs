using System;
using System.ComponentModel.DataAnnotations;

namespace health.api.Models
{
    public class Message
    {
        public int Id { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public int SenderId { get; set; }
        public int ReceiverId { get; set; }

        [Required]
        public string Content { get; set; }

        public bool IsRead { get; set; } = false;
        public DateTime? ReadAt { get; set; }
    }
}
