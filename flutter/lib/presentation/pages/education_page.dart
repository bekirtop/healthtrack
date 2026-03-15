import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import 'package:url_launcher/url_launcher.dart';
import '../state/content_provider.dart';
import '../../core/app_theme.dart';

class EducationPage extends StatelessWidget {
  const EducationPage({super.key});

  Future<void> _launchURL(String? url) async {
    if (url == null || url.isEmpty) return;
    final Uri uri = Uri.parse(url);
    if (!await launchUrl(uri)) {
      throw Exception('Could not launch $url');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<ContentProvider>(
      builder: (context, provider, child) {
        if (provider.isLoading) {
          return const Center(child: CircularProgressIndicator());
        }

        if (provider.materials.isEmpty) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.library_books, size: 64, color: Colors.grey.shade300),
                const SizedBox(height: 16),
                const Text(
                  "Henüz bir eğitim materyali paylaşılmadı.",
                  style: TextStyle(color: Colors.grey),
                ),
              ],
            ),
          );
        }

        return ListView.builder(
          padding: const EdgeInsets.all(16),
          itemCount: provider.materials.length,
          itemBuilder: (context, index) {
            final mat = provider.materials[index];
            return Container(
              margin: const EdgeInsets.only(bottom: 16),
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(AppTheme.radiusL),
                boxShadow: [
                  BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10, offset: const Offset(0, 4)),
                ],
                border: Border.all(color: Colors.grey.shade100),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      CircleAvatar(
                        radius: 14,
                        backgroundColor: AppTheme.primaryColor.withOpacity(0.1),
                        child: const Icon(Icons.school, color: AppTheme.primaryColor, size: 16),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        mat.doctorName,
                        style: TextStyle(
                            color: Colors.grey.shade600,
                            fontWeight: FontWeight.w600,
                            fontSize: 12),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Text(
                    mat.title,
                    style: AppTheme.heading3.copyWith(fontSize: 18),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    mat.content,
                    style: AppTheme.bodyMedium.copyWith(color: Colors.grey.shade700),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      if (mat.videoUrl != null && mat.videoUrl!.isNotEmpty)
                        TextButton.icon(
                          onPressed: () => _launchURL(mat.videoUrl),
                          icon: const Icon(Icons.play_circle_fill, color: AppTheme.primaryColor),
                          label: const Text("Videoyu İzle"),
                          style: TextButton.styleFrom(
                            foregroundColor: AppTheme.primaryColor,
                          ),
                        ),
                      if (mat.fileUrl != null && mat.fileUrl!.isNotEmpty)
                        TextButton.icon(
                          onPressed: () => _launchURL(mat.fileUrl),
                          icon: const Icon(Icons.download, color: Colors.blue),
                          label: const Text("Dosyayı İndir"),
                          style: TextButton.styleFrom(
                            foregroundColor: Colors.blue,
                          ),
                        ),
                    ],
                  ),
                  const Divider(height: 24),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        DateFormat('dd MMM yyyy').format(mat.createdAt),
                        style: const TextStyle(color: Colors.grey, fontSize: 11),
                      ),
                      const Icon(Icons.arrow_forward_ios, size: 12, color: Colors.grey),
                    ],
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }
}
