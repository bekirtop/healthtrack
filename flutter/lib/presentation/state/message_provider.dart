import 'package:flutter/material.dart';
import '../../data/models/message.dart';
import '../../data/services/message_service.dart';

class MessageProvider with ChangeNotifier {
  final MessageService _service = MessageService();

  List<Message> _messages = [];
  bool _isLoading = false;

  List<Message> get messages => _messages;
  bool get isLoading => _isLoading;

  Future<void> fetchMessages(int userId, {bool showLoading = true}) async {
    if (showLoading) {
      _isLoading = true;
      notifyListeners();
    }

    try {
      final fetchedMessages = await _service.getMessages(userId);
      _messages = fetchedMessages;
      _messages.sort((a, b) => a.createdAt.compareTo(b.createdAt));
    } catch (e) {
      print('Error fetching messages: $e');
    } finally {
      if (showLoading) {
        _isLoading = false;
        notifyListeners();
      } else {
        notifyListeners(); // Still need to notify if new messages were added
      }
    }
  }

  Future<bool> sendMessage(int senderId, int receiverId, String content) async {
    if (content.trim().isEmpty) return false;

    bool success = await _service.sendMessage(senderId, receiverId, content);
    if (success) {
      await fetchMessages(senderId); 
    }
    return success;
  }
}