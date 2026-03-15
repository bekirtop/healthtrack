class Medication {
  final int id;
  final String name;
  final String dose;
  final int frequencyPerDay;
  final DateTime startDate;
  final DateTime endDate;
  final List<MedicationDoseSchedule> doseSchedules;

  Medication({
    required this.id,
    required this.name,
    required this.dose,
    required this.frequencyPerDay,
    required this.startDate,
    required this.endDate,
    required this.doseSchedules,
  });

  factory Medication.fromJson(Map<String, dynamic> json) {
    return Medication(
      id: json['id'],
      name: json['name'] ?? 'Bilinmeyen İlaç',
      dose: json['dose'] ?? '',
      frequencyPerDay: json['frequencyPerDay'] ?? 0,
      startDate: DateTime.tryParse(json['startDate'] ?? '') ?? DateTime.now(),
      endDate: DateTime.tryParse(json['endDate'] ?? '') ?? DateTime.now(),
      doseSchedules: (json['doseSchedules'] as List?)
              ?.map((i) => MedicationDoseSchedule.fromJson(i))
              .toList() ?? [],
    );
  }
}

class MedicationDoseSchedule {
  final int id;
  final DateTime scheduledTime;
  final String? notes; 
  final bool isTaken;

  MedicationDoseSchedule({
    required this.id,
    required this.scheduledTime,
    this.notes, 
    this.isTaken = false,
  });

  factory MedicationDoseSchedule.fromJson(Map<String, dynamic> json) {
    
    bool takenStatus = false;
    if (json['records'] != null && (json['records'] as List).isNotEmpty) {
      takenStatus = (json['records'] as List).any((r) => r['isTaken'] == true);
    }

    return MedicationDoseSchedule(
      id: json['id'],
      scheduledTime: DateTime.tryParse(json['scheduledTime'] ?? '') ?? DateTime.now(),
      notes: json['notes'], 
      isTaken: takenStatus,
    );
  }
}