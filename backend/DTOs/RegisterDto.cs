namespace health.api.DTOs
{
    public class RegisterDto
    {
        public string? FullName { get; set; }
        public string? Username { get; set; }
        public string? Password { get; set; }
        public string? Role { get; set; }
        public string? Department { get; set; }
        public string? Diagnosis { get; set; }
    }
}
