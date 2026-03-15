import 'package:flutter/material.dart';
import '../../data/services/auth_service.dart';

class AuthProvider with ChangeNotifier {
  final AuthService _authService = AuthService();

  bool _isLoading = false;
  String? _errorMessage;

  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  Future<bool> login(String username, String password) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    final success = await _authService.login(username, password);

    _isLoading = false;
    
    if (!success) {
      _errorMessage = "Giriş başarısız. Bilgileri kontrol edin.";
    }

    notifyListeners(); 
    return success;
  }
}