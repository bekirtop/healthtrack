using health.api.Models;

namespace health.api.Data
{
    public static class DbSeeder
    {
        public static void SeedDatabase(AppDbContext context)
        {
            // Eğer zaten veri varsa seeding yapma
            if (context.Users.Any())
            {
                Console.WriteLine("Database already seeded. Skipping...");
                return;
            }

            Console.WriteLine("Seeding database with demo data...");

            // Hash fonksiyonu
            string Hash(string input)
            {
                using var sha = System.Security.Cryptography.SHA256.Create();
                var bytes = sha.ComputeHash(System.Text.Encoding.UTF8.GetBytes(input));
                return BitConverter.ToString(bytes).Replace("-", "").ToLower();
            }

            // 1. Admin Kullanıcısı
            var adminUser = new User
            {
                FullName = "Admin User",
                Username = "admin",
                PasswordHash = Hash("admin123"),
                Role = "Admin"
            };
            context.Users.Add(adminUser);
            context.SaveChanges();

            Console.WriteLine("✓ Database seeded successfully with Admin account only!");
            Console.WriteLine("\nAdmin Credentials:");
            Console.WriteLine("================");
            Console.WriteLine("Username: admin");
            Console.WriteLine("Password: admin123");
        }
    }
}
