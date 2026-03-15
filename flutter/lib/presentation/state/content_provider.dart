import 'package:flutter/material.dart';
import '../../data/models/content_models.dart';
import '../../data/services/content_service.dart';

class ContentProvider extends ChangeNotifier {
  final ContentService _service = ContentService();
  
  bool _isLoading = false;
  bool get isLoading => _isLoading;

  List<SocialPost> _posts = [];
  List<SocialPost> get posts => _posts;

  List<EducationalMaterial> _materials = [];
  List<EducationalMaterial> get materials => _materials;
  
  int? _doctorId;
  int? get doctorId => _doctorId;

  int? _doctorUserId;
  int? get doctorUserId => _doctorUserId;

  String? _doctorName;
  String? get doctorName => _doctorName;

  Future<void> fetchContentForPatient(int userId) async {
    _isLoading = true;
    notifyListeners();

    try {
      // 1. Fetch global content for everyone
      final futures = await Future.wait([
        _service.getSocialPosts(),
        _service.getEducationalMaterials(),
      ]);
      _posts = futures[0] as List<SocialPost>;
      _materials = futures[1] as List<EducationalMaterial>;

      // 2. Try to fetch patient profile for messaging etc.
      final profile = await _service.getPatientProfile(userId);
      if (profile != null && profile['doctorId'] != null) {
        _doctorId = profile['doctorId'];
        
        // Fetch doctor info to get their userId for messaging
        try {
          final doctorRes = await _service.getDoctorProfile(_doctorId!);
          if (doctorRes != null) {
            _doctorUserId = doctorRes['userId'];
            _doctorName = doctorRes['user'] != null ? doctorRes['user']['fullName'] : "Doktor";
          }
        } catch (_) {}
      }
    } catch (e) {
      print('Error fetching content: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
