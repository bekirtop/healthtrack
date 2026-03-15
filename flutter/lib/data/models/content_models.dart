class SocialPost {
  final int id;
  final int doctorId;
  final String doctorName;
  final String imageUrl;
  final String caption;
  final DateTime createdAt;

  SocialPost({
    required this.id,
    required this.doctorId,
    required this.doctorName,
    required this.imageUrl,
    required this.caption,
    required this.createdAt,
  });

  factory SocialPost.fromJson(Map<String, dynamic> json) {
    return SocialPost(
      id: json['id'],
      doctorId: json['doctorId'],
      doctorName: json['doctorName'] ?? 'Doktor',
      imageUrl: json['imageUrl'],
      caption: json['caption'],
      createdAt: DateTime.parse(json['createdAt']),
    );
  }
}

class EducationalMaterial {
  final int id;
  final int doctorId;
  final String doctorName;
  final String title;
  final String content;
  final String? fileUrl;
  final String? videoUrl;
  final DateTime createdAt;

  EducationalMaterial({
    required this.id,
    required this.doctorId,
    required this.doctorName,
    required this.title,
    required this.content,
    this.fileUrl,
    this.videoUrl,
    required this.createdAt,
  });

  factory EducationalMaterial.fromJson(Map<String, dynamic> json) {
    return EducationalMaterial(
      id: json['id'],
      doctorId: json['doctorId'],
      doctorName: json['doctorName'] ?? 'Doktor',
      title: json['title'],
      content: json['content'],
      fileUrl: json['fileUrl'],
      videoUrl: json['videoUrl'],
      createdAt: DateTime.parse(json['createdAt']),
    );
  }
}
