import 'package:flutter/material.dart';
import '../../data/models/medication.dart';
import '../../data/services/medication_service.dart';

class MedicationProvider with ChangeNotifier {
  final MedicationService _service = MedicationService();
  
  List<Medication> _medications = [];
  bool _isLoading = false;
  String? _statusMessage;

  List<Medication> get medications => _medications;
  bool get isLoading => _isLoading;
  String? get statusMessage => _statusMessage;

  Future<void> fetchMedications(int userId) async {
    _isLoading = true;
    _statusMessage = "Hasta kaydı aranıyor...";
    notifyListeners(); 

    try {
      int? realPatientId = await _service.getPatientIdByUserId(userId);

      if (realPatientId != null) {
        _statusMessage = "İlaçlar yükleniyor...";
        notifyListeners();

        _medications = await _service.getMedications(realPatientId);
        
        if (_medications.isEmpty) {
          _statusMessage = "Bu hastaya ait hiç ilaç kaydı yok.";
        } else {
          _statusMessage = null;
        }
      } else {
        _statusMessage = "Sistemde Hasta kaydınız bulunamadı.\n(UserID: $userId ile eşleşen hasta yok)";
      }

    } catch (e) {

      _statusMessage = "Bir hata oluştu: $e";
      _medications = [];
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> markDoseAsTaken(int medicationId, int doseScheduleId, int userId) async {
    bool success = await _service.markTaken(medicationId, doseScheduleId);
    if (success) {
      await fetchMedications(userId);
    }
  }
}