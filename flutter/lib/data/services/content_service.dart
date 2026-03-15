import '../../core/services/api_service.dart';
import '../models/content_models.dart';

class ContentService {
  final ApiService _apiService = ApiService();

  Future<Map<String, dynamic>?> getPatientProfile(int userId) async {
    try {
      final response = await _apiService.client.get('/Patient/by-user/$userId');
      if (response.statusCode == 200) {
        return response.data;
      }
    } catch (e) {
      print('Error fetching patient profile: $e');
    }
    return null;
  }

  Future<Map<String, dynamic>?> getDoctorProfile(int doctorId) async {
    try {
      final response = await _apiService.client.get('/Doctor/$doctorId');
      if (response.statusCode == 200) {
        return response.data;
      }
    } catch (e) {
      print('Error fetching doctor profile: $e');
    }
    return null;
  }

  Future<List<SocialPost>> getSocialPosts() async {
    try {
      final response = await _apiService.client.get('/SocialPost');
      if (response.statusCode == 200) {
        List<dynamic> body = response.data;
        return body.map((dynamic item) => SocialPost.fromJson(item)).toList();
      }
    } catch (e) {
      print('Error fetching social posts: $e');
    }
    return [];
  }

  Future<List<EducationalMaterial>> getEducationalMaterials() async {
    try {
      final response = await _apiService.client.get('/EducationalMaterial');
      if (response.statusCode == 200) {
        List<dynamic> body = response.data;
        return body.map((dynamic item) => EducationalMaterial.fromJson(item)).toList();
      }
    } catch (e) {
      print('Error fetching educational materials: $e');
    }
    return [];
  }
}
