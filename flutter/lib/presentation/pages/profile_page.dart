import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../core/app_theme.dart';
import '../../core/services/api_service.dart';
import '../../data/services/auth_service.dart';
import 'login_page.dart';

class ProfilePage extends StatefulWidget {
  final int userId;

  const ProfilePage({super.key, required this.userId});

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  final ApiService _api = ApiService();
  bool isLoading = true;
  Map<String, dynamic>? patientData;
  List<Map<String, dynamic>> diagnoses = [];

  @override
  void initState() {
    super.initState();
    _fetchProfileData();
  }

  Future<void> _fetchProfileData() async {
    try {
      // Use /Patient (list) and filter by userId - doesn't require doctor auth
      final response = await _api.client.get('/Patient');

      if (response.statusCode == 200) {
        final List patients = response.data;

        final myRecord = patients.firstWhere(
          (p) {
            final uId = p['userId'];
            final nestedUid = p['user'] != null ? p['user']['id'] : null;
            return (uId == widget.userId) || (nestedUid == widget.userId);
          },
          orElse: () => null,
        );

        if (myRecord != null && mounted) {
          // Also fetch multi-diagnoses
          List<Map<String, dynamic>> diagList = [];
          try {
            final diagRes = await _api.client.get('/PatientDiagnosis/${myRecord['id']}');
            if (diagRes.statusCode == 200) {
              diagList = List<Map<String, dynamic>>.from(diagRes.data);
            }
          } catch (_) {}

          if (mounted) {
            setState(() {
              patientData = myRecord;
              diagnoses = diagList;
              isLoading = false;
            });
          }
        } else if (mounted) {
          setState(() => isLoading = false);
        }
      }
    } catch (e) {
      if (mounted) setState(() => isLoading = false);
    }
  }

  Future<void> _showLogoutDialog() async {
    return showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppTheme.radiusL),
          ),
          title: Row(
            children: [
              Icon(Icons.logout, color: Colors.red.shade700),
              const SizedBox(width: 12),
              const Text("Çıkış Yap"),
            ],
          ),
          content: const Text("Hesabınızdan çıkış yapmak istediğinize emin misiniz?"),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text("İPTAL"),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.red,
                foregroundColor: Colors.white,
              ),
              onPressed: () async {
                await AuthService().logout();
                if (mounted) {
                  Navigator.of(context).pop();
                  Navigator.pushAndRemoveUntil(
                    context,
                    MaterialPageRoute(builder: (_) => const LoginPage()),
                    (route) => false,
                  );
                }
              },
              child: const Text("ÇIKIŞ YAP"),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.backgroundColor,
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : patientData == null
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.person_off, size: 64, color: Colors.grey.shade400),
                      const SizedBox(height: 16),
                      const Text(
                        "Profil bilgileri bulunamadı.",
                        style: TextStyle(color: Colors.grey),
                      ),
                    ],
                  ),
                )
              : RefreshIndicator(
                  onRefresh: _fetchProfileData,
                  child: SingleChildScrollView(
                    physics: const AlwaysScrollableScrollPhysics(),
                    child: Column(
                      children: [
                        // --- Gradient Header ---
                        Stack(
                          alignment: Alignment.topCenter,
                          children: [
                            Container(
                              width: double.infinity,
                              height: 220,
                              decoration: const BoxDecoration(
                                gradient: LinearGradient(
                                  colors: [Color(0xFF4F46E5), Color(0xFF7C3AED)],
                                  begin: Alignment.topLeft,
                                  end: Alignment.bottomRight,
                                ),
                                borderRadius: BorderRadius.vertical(bottom: Radius.circular(32)),
                              ),
                            ),
                            SafeArea(
                              child: Padding(
                                padding: const EdgeInsets.only(top: 16),
                                child: Column(
                                  children: [
                                    Container(
                                      padding: const EdgeInsets.all(3),
                                      decoration: BoxDecoration(
                                        shape: BoxShape.circle,
                                        border: Border.all(color: Colors.white, width: 3),
                                        boxShadow: [
                                          BoxShadow(
                                            color: Colors.black.withOpacity(0.2),
                                            blurRadius: 16,
                                            offset: const Offset(0, 8),
                                          ),
                                        ],
                                      ),
                                      child: CircleAvatar(
                                        radius: 44,
                                        backgroundColor: Colors.white,
                                        child: Text(
                                          (patientData?['user']?['fullName'] ?? "U")
                                              .split(' ')
                                              .map((e) => e.isNotEmpty ? e[0] : '')
                                              .take(2)
                                              .join()
                                              .toUpperCase(),
                                          style: TextStyle(
                                            color: AppTheme.primaryColor,
                                            fontSize: 28,
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                      ),
                                    ),
                                    const SizedBox(height: 12),
                                    Text(
                                      patientData?['user']?['fullName'] ?? "Kullanıcı",
                                      style: const TextStyle(
                                        color: Colors.white,
                                        fontSize: 20,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                    Text(
                                      "@${patientData?['user']?['username'] ?? ''}",
                                      style: TextStyle(
                                        color: Colors.white.withOpacity(0.85),
                                        fontSize: 13,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                            // Back button
                            Positioned(
                              top: 10,
                              left: 10,
                              child: SafeArea(
                                child: GestureDetector(
                                  onTap: () => Navigator.pop(context),
                                  child: Container(
                                    padding: const EdgeInsets.all(8),
                                    decoration: BoxDecoration(
                                      color: Colors.white,
                                      borderRadius: BorderRadius.circular(12),
                                      boxShadow: [
                                        BoxShadow(
                                          color: Colors.black.withOpacity(0.1),
                                          blurRadius: 8,
                                          offset: const Offset(0, 2),
                                        ),
                                      ],
                                    ),
                                    child: const Icon(Icons.arrow_back, color: Colors.black87),
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),

                        // --- Info Section ---
                        Padding(
                          padding: const EdgeInsets.all(24),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text("Sağlık Bilgilerim", style: AppTheme.heading3),
                              const SizedBox(height: 16),

                              // Multi-diagnosis section
                              _buildDiagnosesSection(),

                              _buildInfoTile(
                                Icons.calendar_today,
                                "Taburcu Tarihi",
                                _formatDate(patientData?['dischargeDate']),
                              ),

                              const SizedBox(height: 32),

                              SizedBox(
                                width: double.infinity,
                                height: 56,
                                child: ElevatedButton.icon(
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: Colors.red.shade600,
                                    foregroundColor: Colors.white,
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(AppTheme.radiusM),
                                    ),
                                    elevation: 4,
                                  ),
                                  onPressed: _showLogoutDialog,
                                  icon: const Icon(Icons.logout),
                                  label: const Text(
                                    "ÇIKIŞ YAP",
                                    style: TextStyle(fontWeight: FontWeight.w700, fontSize: 16),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
    );
  }

  Widget _buildDiagnosesSection() {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppTheme.radiusL),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 20, offset: const Offset(0, 4)),
        ],
        border: Border.all(color: Colors.grey.shade100),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppTheme.primaryColor.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Icon(Icons.medical_information, color: AppTheme.primaryColor, size: 28),
              ),
              const SizedBox(width: 20),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      "Tanılarım",
                      style: AppTheme.bodyMedium.copyWith(color: Colors.grey.shade600, fontSize: 14),
                    ),
                    const SizedBox(height: 6),
                    if (diagnoses.isEmpty)
                      const Text("Henüz tanı kaydı yok",
                          style: TextStyle(fontSize: 15, color: Colors.grey)),
                  ],
                ),
              ),
            ],
          ),
          if (diagnoses.isNotEmpty) ...[
            const SizedBox(height: 14),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: diagnoses
                  .map((d) => Chip(
                        label: Text(
                          d['diagnosis'] ?? '',
                          style: TextStyle(
                            color: AppTheme.primaryColor,
                            fontWeight: FontWeight.w600,
                            fontSize: 12,
                          ),
                        ),
                        backgroundColor: AppTheme.primaryColor.withOpacity(0.1),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(20),
                          side: BorderSide(color: AppTheme.primaryColor.withOpacity(0.2)),
                        ),
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                      ))
                  .toList(),
            ),
          ],
        ],
      ),
    );
  }

  String _formatDate(String? dateStr) {
    if (dateStr == null) return "Tedavi Devam Ediyor";
    try {
      final date = DateTime.parse(dateStr);
      return DateFormat('dd MMMM yyyy', 'tr_TR').format(date);
    } catch (_) {
      return dateStr;
    }
  }

  Widget _buildInfoTile(IconData icon, String title, String value) {
    final isTreatmentContinuing = value == "Tedavi Devam Ediyor";
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(AppTheme.radiusL),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 20, offset: const Offset(0, 4)),
        ],
        border: Border.all(color: Colors.grey.shade100),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: isTreatmentContinuing
                  ? Colors.orange.shade50
                  : AppTheme.primaryColor.withOpacity(0.1),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Icon(
              icon,
              color: isTreatmentContinuing ? Colors.orange : AppTheme.primaryColor,
              size: 28,
            ),
          ),
          const SizedBox(width: 20),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title,
                    style: AppTheme.bodyMedium.copyWith(color: Colors.grey.shade600, fontSize: 14)),
                const SizedBox(height: 6),
                Text(
                  value,
                  style: AppTheme.heading3.copyWith(
                    fontSize: 16,
                    color: isTreatmentContinuing ? Colors.orange.shade800 : Colors.black87,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}