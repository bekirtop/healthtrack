# HealthTrack API - Backend Documentation

.NET 6 Web API for the HealthTrack health management system.

## 🏗️ Architecture

- **Framework**: ASP.NET Core 6.0
- **Database**: SQLite with Entity Framework Core
- **Authentication**: JWT Bearer Token
- **API Documentation**: Swagger/OpenAPI

## 📁 Project Structure

```
health.api/
├── Controllers/           # API endpoints
│   ├── AuthController.cs
│   ├── DoctorController.cs
│   ├── PatientController.cs
│   ├── MedicationController.cs
│   ├── MessageController.cs
│   └── SideEffectController.cs
├── Models/               # Database entities
├── Data/                # DbContext
├── DTOs/                # Data transfer objects
├── Services/            # Business logic (JWT)
├── Migrations/          # EF migrations
└── Program.cs          # Startup configuration
```

## 🚀 Getting Started

### Prerequisites
- .NET 6 SDK

### Running the API

```bash
# Restore packages
dotnet restore

# Apply migrations
dotnet ef database update

# Run the application
dotnet run
```

API will be available at: **http://localhost:5018**
Swagger UI: **http://localhost:5018/swagger**

## 🔐 Authentication

### JWT Configuration

Edit `appsettings.json`:

```json
{
  "Jwt": {
    "Key": "your-very-secure-secret-key-min-32-chars",
    "Issuer": "HealthTrackAPI",
    "Audience": "HealthTrackClient",
    "ExpiresInMinutes": 1440
  }
}
```

### Flow

1. Call `POST /api/Auth/login` with credentials
2. Receive JWT token in response
3. Include token in subsequent requests:
   ```
   Authorization: Bearer <your-token>
   ```

## 📚 API Endpoints

### Authentication (`/api/Auth`)

#### Register User
```http
POST /api/Auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "password": "password123",
  "fullName": "John Doe",
  "role": "Doctor",        // Admin, Doctor, or Patient
  "department": "Cardiology",  // For Doctor role
  "diagnosis": null        // For Patient role
}
```

Response:
```json
{
  "message": "Kayıt başarılı.",
  "id": 1,
  "role": "Doctor"
}
```

#### Login
```http
POST /api/Auth/login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "password123"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "id": 1,
  "fullName": "John Doe",
  "role": "Doctor"
}
```

---

### Doctors (`/api/Doctor`)

#### Get All Doctors
```http
GET /api/Doctor
Authorization: Bearer <token>
```

#### Get Doctor Patients
```http
GET /api/Doctor/patients
Authorization: Bearer <token>
```

#### Create Doctor
```http
POST /api/Doctor
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": 1,
  "department": "Cardiology"
}
```

---

### Patients (`/api/Patient`)

#### Get All Patients
```http
GET /api/Patient
Authorization: Bearer <token>
```

#### Get Patient by ID
```http
GET /api/Patient/{id}
Authorization: Bearer <token>
```

#### Create Patient
```http
POST /api/Patient
Authorization: Bearer <token>
Content-Type: application/json

{
  "fullName": "Jane Smith",
  "diagnosis": "Hypertension",
  "userId": null  // Optional
}
```

#### Assign Patient to Doctor
```http
POST /api/Patient/assign
Authorization: Bearer <token>
Content-Type: application/json

{
  "patientId": 1,
  "doctorId": 2
}
```

---

### Medications (`/api/Medication`)

#### Get Patient Medications
```http
GET /api/Medication/list/{patientId}
Authorization: Bearer <token>
```

#### Add Medication
```http
POST /api/Medication
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Aspirin",
  "dose": "100mg",
  "frequencyPerDay": 2,
  "durationDays": 30,
  "startDate": "2024-01-01T00:00:00Z",
  "endDate": "2024-01-31T00:00:00Z",
  "notes": "Take with food",
  "patientId": 1
}
```

#### Update Medication
```http
PUT /api/Medication/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Aspirin",
  "dose": "150mg",
  ...
}
```

#### Delete Medication
```http
DELETE /api/Medication/{id}
Authorization: Bearer <token>
```

---

### Messages (`/api/Message`)

#### Send Message
```http
POST /api/Message/send
Authorization: Bearer <token>
Content-Type: application/json

{
  "senderId": 1,
  "receiverId": 2,
  "content": "How are you feeling today?"
}
```

#### Get Patient Messages
```http
GET /api/Message/list/{patientId}
Authorization: Bearer <token>
```

#### Get Unread Messages
```http
GET /api/Message/unread/{userId}
Authorization: Bearer <token>
```

---

### Side Effects (`/api/SideEffect`)

#### Report Side Effect
```http
POST /api/SideEffect/report
Authorization: Bearer <token>
Content-Type: application/json

{
  "patientId": 1,
  "medicationId": 3,
  "description": "Nausea after taking medication",
  "severity": "Moderate"  // Mild, Moderate, Severe
}
```

#### Get Patient Side Effects
```http
GET /api/SideEffect/list/{patientId}
Authorization: Bearer <token>
```

#### Delete Side Effect
```http
DELETE /api/SideEffect/{id}
Authorization: Bearer <token>
```

---

## 💾 Database Models

### User
```csharp
public class User
{
    public int Id { get; set; }
    public string FullName { get; set; }
    public string Username { get; set; }
    public string PasswordHash { get; set; }
    public string Role { get; set; }  // Admin, Doctor, Patient
}
```

### Doctor
```csharp
public class Doctor
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string? Department { get; set; }
    public User? User { get; set; }
    public ICollection<DoctorPatient>? DoctorPatients { get; set; }
}
```

### Patient
```csharp
public class Patient
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string? Diagnosis { get; set; }
    public DateTime? DischargeDate { get; set; }
    public User? User { get; set; }
    public ICollection<Medication>? Medications { get; set; }
    public ICollection<SideEffect>? SideEffects { get; set; }
}
```

## 🔧 Configuration

### CORS Settings

By default, the API accepts requests from `http://localhost:5173`. To modify:

```csharp
// In Program.cs
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy
            .WithOrigins("http://localhost:5173", "https://yourdomain.com")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials());
});
```

### Database Connection

SQLite connection string is in `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=health.db"
  }
}
```

## 🗄️ Migrations

### Create Migration
```bash
dotnet ef migrations add MigrationName
```

### Apply Migration
```bash
dotnet ef database update
```

### Remove Last Migration
```bash
dotnet ef migrations remove
```

## 🧪 Testing with Swagger

1. Start the API: `dotnet run`
2. Open http://localhost:5018/swagger
3. Click "Authorize" button
4. Login via `/api/Auth/login` endpoint
5. Copy the token from the response
6. Paste in the Authorize dialog: `Bearer <token>`
7. Test protected endpoints

## 🐛 Error Handling

The API returns standard HTTP status codes:

- `200 OK` - Success
- `201 Created` - Resource created
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Duplicate resource
- `500 Internal Server Error` - Server error

## 📝 Development Tips

### Hot Reload
```bash
dotnet watch run
```

### Clean Build
```bash
dotnet clean
dotnet build
```

### Production Build
```bash
dotnet publish -c Release -o ./publish
```

## 🔒 Security Notes

- Passwords are hashed using SHA256
- JWT tokens contain user ID, username, and role
- All endpoints (except Auth) require authentication
- Role-based access can be implemented using `[Authorize(Roles = "Admin")]`

---

For frontend integration, see [../health-frontend/README.md](../health-frontend/README.md)
