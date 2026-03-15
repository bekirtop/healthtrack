import 'package:dio/dio.dart';
import '../../core/services/api_service.dart';
import '../models/message.dart';

class MessageService {
  final ApiService _apiService = ApiService();

  Future<List<Message>> getMessages(int userId) async {
    try {
      final response = await _apiService.client.get('/Message/list/$userId');
      
      if (response.statusCode == 200) {
        final List data = response.data;
        return data.map((e) => Message.fromJson(e)).toList();
      }
      return [];
    } catch (e) {

      return [];
    }
  }

  Future<bool> sendMessage(int senderId, int receiverId, String content) async {
    try {
      final response = await _apiService.client.post(
        '/Message/send',
        data: {
          "senderId": senderId,
          "receiverId": receiverId,
          "content": content
        },
      );
      return response.statusCode == 200;
    } catch (e) {

      return false;
    }
  }
}