import 'package:flutter/material.dart';
import '../../data/services/side_effect_service.dart';

class SideEffectProvider with ChangeNotifier {
  final SideEffectService _service = SideEffectService();

  List<Map<String, dynamic>> _sideEffects = [];
  bool _isLoading = false;

  List<Map<String, dynamic>> get sideEffects => _sideEffects;
  bool get isLoading => _isLoading;

  Future<void> fetchSideEffects(int patientId) async {
    _isLoading = true;
    notifyListeners();

    _sideEffects = await _service.getSideEffects(patientId);

    _isLoading = false;
    notifyListeners();
  }

  Future<bool> report(int patientId, String description, String severity) async {
    bool success = await _service.reportSideEffect(patientId, description, severity);
    if (success) {
      await fetchSideEffects(patientId);
    }
    return success;
  }
}