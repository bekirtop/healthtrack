import 'package:shared_preferences/shared_preferences.dart';
import 'package:jwt_decoder/jwt_decoder.dart';
import '../../core/services/api_service.dart';

class AuthService {
  final ApiService _apiService = ApiService();

  Future<bool> login(String username, String password) async {
    try {
      final response = await _apiService.client.post(
        '/Auth/login',
        data: {
          'username': username,
          'password': password,
        },
      );

      if (response.statusCode == 200) {
        final data = response.data;

        // Support both direct token string and object with 'token' key
        final token = data is Map ? data['token'] : data.toString();
        if (token == null || token.isEmpty) return false;

        final prefs = await SharedPreferences.getInstance();
        await prefs.setString('jwt_token', token);

        // Decode and persist userId and role for easy access throughout the app
        try {
          final decoded = JwtDecoder.decode(token);
          final userId = decoded['sub']?.toString();
          final role = (decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ??
                        decoded['role'] ??
                        '').toString();
          final fullName = (decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ??
                           decoded['name'] ?? '').toString();

          if (userId != null) await prefs.setString('user_id', userId);
          if (role.isNotEmpty) await prefs.setString('user_role', role);
          if (fullName.isNotEmpty) await prefs.setString('full_name', fullName);

          // Also save from API response directly if available (more reliable)
          if (data is Map) {
            if (data['id'] != null) await prefs.setString('user_id', data['id'].toString());
            if (data['role'] != null) await prefs.setString('user_role', data['role'].toString());
            if (data['fullName'] != null) await prefs.setString('full_name', data['fullName'].toString());
          }
        } catch (_) {}

        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('jwt_token');
    await prefs.remove('user_id');
    await prefs.remove('user_role');
    await prefs.remove('full_name');
  }

  /// Returns {userId, role, fullName} from saved prefs, or null if not logged in.
  static Future<Map<String, String>?> getCurrentUser() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('jwt_token');
    if (token == null) return null;
    return {
      'userId': prefs.getString('user_id') ?? '',
      'role': prefs.getString('user_role') ?? '',
      'fullName': prefs.getString('full_name') ?? 'Kullanıcı',
    };
  }
}