/// PatientDiagnosisService – fetches the patient's diagnoses from the backend.
import '../../core/services/api_service.dart';

class PatientDiagnosisService {
  final ApiService _apiService = ApiService();

  Future<List<Map<String, dynamic>>> getDiagnoses(int patientId) async {
    try {
      final response = await _apiService.client.get('/PatientDiagnosis/$patientId');
      if (response.statusCode == 200) {
        return List<Map<String, dynamic>>.from(response.data);
      }
      return [];
    } catch (_) {
      return [];
    }
  }
}
