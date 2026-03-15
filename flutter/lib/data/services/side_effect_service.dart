import 'package:dio/dio.dart';
import '../../core/services/api_service.dart';

class SideEffectService {
  final ApiService _apiService = ApiService();

  Future<bool> reportSideEffect(int patientId, String description, String severity) async {
    // Map Turkish UI labels to English backend values
    final Map<String, String> severityMap = {
      'Hafif': 'Mild',
      'Orta': 'Moderate',
      'Şiddetli': 'Severe',
    };
    final backendSeverity = severityMap[severity] ?? severity;

    try {
      final response = await _apiService.client.post(
        '/SideEffect/report',
        data: {
          "patientId": patientId,
          "description": description,
          "severity": backendSeverity,
          "medicationId": null,
          "date": DateTime.now().toIso8601String(),
        },
      );
      return response.statusCode == 200;
    } catch (e) {
      return false;
    }
  }

  Future<List<Map<String, dynamic>>> getSideEffects(int patientId) async {
    try {
      final response = await _apiService.client.get('/SideEffect/list/$patientId');
      if (response.statusCode == 200) {
        return List<Map<String, dynamic>>.from(response.data);
      }
      return [];
    } catch (e) {

      return [];
    }
  }
}