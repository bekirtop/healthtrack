using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using health.api.Data;
using health.api.Models;

namespace health.api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MessageController : ControllerBase
    {
        private readonly AppDbContext _db;

        public MessageController(AppDbContext db)
        {
            _db = db;
        }

        // POST: /api/Message/send
        [HttpPost("send")]
        public async Task<IActionResult> Send([FromBody] SendMessageDto dto)
        {
            if (dto == null || dto.ReceiverId == 0 || string.IsNullOrWhiteSpace(dto.Content))
                return BadRequest("Eksik mesaj bilgisi.");

            var senderId = dto.SenderId; // Şimdilik DTO'dan alıyoruz (auth yoksa)
            var msg = new Message
            {
                SenderId = senderId,
                ReceiverId = dto.ReceiverId,
                Content = dto.Content!,
                CreatedAt = DateTime.UtcNow,
                IsRead = false
            };

            _db.Messages.Add(msg);
            await _db.SaveChangesAsync();

            return Ok(msg);
        }

        // GET: /api/Message/list/{userId}
        [HttpGet("list/{userId}")]
        public async Task<IActionResult> GetByUserId(int userId)
        {
            var messages = await _db.Messages
                .Where(m => m.SenderId == userId || m.ReceiverId == userId)
                .OrderBy(m => m.CreatedAt)
                .ToListAsync();

            return Ok(messages);
        }

        // GET: /api/Message/unread/{userId}
        [HttpGet("unread/{userId}")]
        public async Task<IActionResult> GetUnread(int userId)
        {
            var unread = await _db.Messages
                .Where(m => m.ReceiverId == userId && !m.IsRead)
                .OrderByDescending(m => m.CreatedAt)
                .ToListAsync();

            return Ok(unread);
        }

        // PUT: /api/Message/{id}/read
        [HttpPut("{id}/read")]
        public async Task<IActionResult> MarkRead(int id)
        {
            var msg = await _db.Messages.FindAsync(id);
            if (msg == null) return NotFound();

            msg.IsRead = true;
            msg.ReadAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();

            return Ok(new { message = "Mesaj okundu olarak işaretlendi." });
        }
    }

    public class SendMessageDto
    {
        public int SenderId { get; set; }  // Şimdilik açık, ileride JWT'den alınabilir
        public int ReceiverId { get; set; }
        public string? Content { get; set; }
    }
}
