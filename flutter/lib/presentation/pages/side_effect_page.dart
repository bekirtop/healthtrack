import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../../core/app_theme.dart';
import '../../core/utils/validators.dart';
import '../../data/services/medication_service.dart';
import '../state/side_effect_provider.dart';
import '../widgets/animated_button.dart';

class SideEffectPage extends StatefulWidget {
  final int userId;

  const SideEffectPage({super.key, required this.userId});

  @override
  State<SideEffectPage> createState() => _SideEffectPageState();
}

class _SideEffectPageState extends State<SideEffectPage> {
  final _descController = TextEditingController();
  String _selectedSeverity = "Hafif";
  int? _patientId;
  bool _isLoadingPatientId = true;

  @override
  void initState() {
    super.initState();
    _loadPatientId();
  }

  Future<void> _loadPatientId() async {
    final medicationService = MedicationService();
    final patientId = await medicationService.getPatientIdByUserId(widget.userId);
    
    if (mounted) {
      setState(() {
        _patientId = patientId;
        _isLoadingPatientId = false;
      });
      
      if (_patientId != null) {
        Provider.of<SideEffectProvider>(context, listen: false).fetchSideEffects(_patientId!);
      }
    }
  }

  @override
  void dispose() {
    _descController.dispose();
    super.dispose();
  }

  Future<void> _handleSubmit() async {
    if (_descController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Row(
            children: [
              Icon(Icons.error_outline, color: Colors.white),
              SizedBox(width: 12),
              Text("Lütfen açıklama girin"),
            ],
          ),
          backgroundColor: Colors.red.shade600,
        ),
      );
      return;
    }

    if (_patientId == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Row(
            children: [
              Icon(Icons.error_outline, color: Colors.white),
              SizedBox(width: 12),
              Text("Hasta bilgisi yüklenemedi"),
            ],
          ),
          backgroundColor: Colors.red.shade600,
        ),
      );
      return;
    }

    final provider = Provider.of<SideEffectProvider>(context, listen: false);
    bool success = await provider.report(
      _patientId!, 
      _descController.text.trim(), 
      _selectedSeverity,
    );

    if (success && mounted) {
      _descController.clear();
      setState(() => _selectedSeverity = "Hafif");
      
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Row(
            children: [
              Icon(Icons.check_circle, color: Colors.white),
              SizedBox(width: 12),
              Text("Doktora iletildi! Geçmiş olsun."),
            ],
          ),
          backgroundColor: Colors.green.shade600,
          behavior: SnackBarBehavior.floating,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<SideEffectProvider>(context);

    return Scaffold(
      backgroundColor: AppTheme.backgroundColor,
      appBar: AppBar(
        title: const Text("Yan Etki Bildir"),
        elevation: 0,
      ),
      body: _isLoadingPatientId 
        ? const Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                CircularProgressIndicator(),
                SizedBox(height: 16),
                Text("Hasta bilgileri yükleniyor..."),
              ],
            ),
          )
        : _patientId == null
            ? Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.error_outline, size: 64, color: Colors.red.shade300),
                    const SizedBox(height: 16),
                    const Text("Hasta bilgisi bulunamadı"),
                  ],
                ),
              )
            : SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(AppTheme.radiusL),
                boxShadow: AppTheme.cardShadow,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Colors.orange.shade50,
                          borderRadius: BorderRadius.circular(AppTheme.radiusM),
                        ),
                        child: Icon(
                          Icons.report_problem,
                          color: Colors.orange.shade700,
                          size: 32,
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text("Nasıl Hissediyorsunuz?", style: AppTheme.heading3),
                            const SizedBox(height: 4),
                            Text(
                              "Durumunuzu doktorunuzla paylaşın",
                              style: AppTheme.bodyMedium,
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),
                  
                  TextField(
                    controller: _descController,
                    decoration: InputDecoration(
                      hintText: "Örn: Başım dönüyor, midem bulandı...",
                      hintStyle: TextStyle(color: Colors.grey[400]),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(AppTheme.radiusM),
                        borderSide: BorderSide(color: Colors.grey.shade200),
                      ),
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(AppTheme.radiusM),
                        borderSide: BorderSide(color: Colors.grey.shade200),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(AppTheme.radiusM),
                        borderSide: const BorderSide(
                          color: AppTheme.primaryColor,
                          width: 2,
                        ),
                      ),
                    ),
                    maxLines: 4,
                    style: AppTheme.bodyLarge,
                  ),
                  const SizedBox(height: 24),
                  
                  Text("Şiddet Seviyesi:", style: AppTheme.bodyLarge.copyWith(
                    fontWeight: FontWeight.w600,
                  )),
                  const SizedBox(height: 12),
                  Row(
                    children: ["Hafif", "Orta", "Şiddetli"].map((severity) {
                      final isSelected = _selectedSeverity == severity;
                      MaterialColor getColor() {
                        if (severity == "Hafif") return Colors.green;
                        if (severity == "Orta") return Colors.orange;
                        return Colors.red;
                      }
                      
                      return Padding(
                        padding: const EdgeInsets.only(right: 12),
                        child: FilterChip(
                          label: Text(severity),
                          selected: isSelected,
                          onSelected: (selected) {
                            if (selected) setState(() => _selectedSeverity = severity);
                          },
                          selectedColor: getColor()[50],
                          checkmarkColor: getColor()[700],
                          labelStyle: TextStyle(
                            color: isSelected ? getColor()[700] : Colors.grey[700],
                            fontWeight: isSelected ? FontWeight.w600 : FontWeight.w500,
                          ),
                          side: BorderSide(
                            color: isSelected ? getColor()[200]! : Colors.grey.shade300,
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: 24),
                  
                  AnimatedButton(
                    text: "BİLDİR",
                    icon: Icons.send,
                    onPressed: _handleSubmit,
                  ),
                ],
              ),
            ),

            const SizedBox(height: 32),
            
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text("Geçmiş Bildirimler", style: AppTheme.heading3),
                if (provider.sideEffects.isNotEmpty)
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: AppTheme.primaryColor.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(AppTheme.radiusS),
                    ),
                    child: Text(
                      "${provider.sideEffects.length}",
                      style: TextStyle(
                        color: AppTheme.primaryColor,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),
              ],
            ),
            const SizedBox(height: 16),

            provider.isLoading 
              ? const Center(child: CircularProgressIndicator())
              : provider.sideEffects.isEmpty
                  ? Container(
                      padding: const EdgeInsets.all(32),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(AppTheme.radiusL),
                      ),
                      child: Center(
                        child: Column(
                          children: [
                            Icon(
                              Icons.check_circle_outline,
                              size: 64,
                              color: Colors.grey.shade300,
                            ),
                            const SizedBox(height: 16),
                            Text(
                              "Henüz bir bildirim yok",
                              style: AppTheme.bodyMedium,
                            ),
                          ],
                        ),
                      ),
                    )
                  : ListView.builder(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      itemCount: provider.sideEffects.length,
                      itemBuilder: (context, index) {
                        final item = provider.sideEffects[index];
                        final date = DateTime.tryParse(item['date'] ?? '') ?? DateTime.now();
                        final severity = item['severity'] ?? "Hafif";
                        
                        MaterialColor getSeverityColor() {
                          final lowerSev = severity.toLowerCase();
                          if (lowerSev == "şiddetli" || lowerSev == "severe") return Colors.red;
                          if (lowerSev == "orta" || lowerSev == "moderate") return Colors.orange;
                          return Colors.green;
                        }

                        String getTranslatedSeverity() {
                          if (severity == "Mild") return "Hafif";
                          if (severity == "Moderate") return "Orta";
                          if (severity == "Severe") return "Şiddetli";
                          return severity;
                        }
                        
                        return Container(
                          margin: const EdgeInsets.only(bottom: 12),
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(AppTheme.radiusL),
                            boxShadow: AppTheme.cardShadow,
                          ),
                          child: Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Container(
                                padding: const EdgeInsets.all(10),
                                decoration: BoxDecoration(
                                  color: getSeverityColor()[50],
                                  borderRadius: BorderRadius.circular(AppTheme.radiusM),
                                ),
                                child: Icon(
                                  Icons.warning_amber_rounded,
                                  color: getSeverityColor()[700],
                                  size: 24,
                                ),
                              ),
                              const SizedBox(width: 16),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      item['description'] ?? "",
                                      style: AppTheme.bodyLarge.copyWith(
                                        fontWeight: FontWeight.w500,
                                      ),
                                    ),
                                    const SizedBox(height: 8),
                                    Row(
                                      children: [
                                        Icon(
                                          Icons.access_time,
                                          size: 14,
                                          color: Colors.grey[600],
                                        ),
                                        const SizedBox(width: 4),
                                        Text(
                                          DateFormat('dd MMM yyyy - HH:mm').format(date),
                                          style: AppTheme.caption,
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                              ),
                              const SizedBox(width: 12),
                              Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 12,
                                  vertical: 6,
                                ),
                                decoration: BoxDecoration(
                                  color: getSeverityColor()[50],
                                  borderRadius: BorderRadius.circular(AppTheme.radiusS),
                                  border: Border.all(
                                    color: getSeverityColor()[200]!,
                                  ),
                                ),
                                child: Text(
                                  getTranslatedSeverity(),
                                  style: TextStyle(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w600,
                                    color: getSeverityColor()[700],
                                  ),
                                ),
                              ),
                            ],
                          ),
                        );
                      },
                    ),
          ],
        ),
      ),
    );
  }
}