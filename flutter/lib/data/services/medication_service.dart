import '../../core/services/api_service.dart';
import '../models/medication.dart';

class MedicationService {
  final ApiService _apiService = ApiService();

  /// Resolves the patient's patientId from their userId.
  Future<int?> getPatientIdByUserId(int userId) async {
    // Primary: use the optimized endpoint
    try {
      final response = await _apiService.client.get('/Patient/by-user/$userId');
      if (response.statusCode == 200 && response.data != null) {
        return response.data['id'];
      }
    } catch (_) {}

    // Fallback: list all patients and find match by userId
    try {
      final response = await _apiService.client.get('/Patient');
      if (response.statusCode == 200) {
        final List patients = response.data;
        final match = patients.firstWhere(
          (p) {
            final uId = p['userId'];
            final nestedUid = p['user'] != null ? p['user']['id'] : null;
            return (uId == userId) || (nestedUid == userId);
          },
          orElse: () => null,
        );
        if (match != null) return match['id'];
      }
    } catch (_) {}

    return null;
  }

  Future<List<Medication>> getMedications(int patientId) async {
    try {
      final response = await _apiService.client.get('/Medication/list/$patientId');
      if (response.statusCode == 200) {
        final List data = response.data;
        return data.map((e) => Medication.fromJson(e)).toList();
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  Future<bool> markTaken(int medicationId, int doseScheduleId) async {
    try {
      // Updated endpoint to match backend MedicationRecord POST
      final response = await _apiService.client.post(
        '/MedicationRecord',
        data: {
          "medicationId": medicationId,
          "doseScheduleId": doseScheduleId,
          "isTaken": true,
          "takenAt": DateTime.now().toIso8601String(),
        },
      );
      return response.statusCode == 200 || response.statusCode == 201;
    } catch (e) {
      return false;
    }
  }
}