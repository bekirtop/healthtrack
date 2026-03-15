import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../../data/models/medication.dart';
import '../state/medication_provider.dart';
import '../../core/constants.dart';

class MedicationDetailPage extends StatelessWidget {
  final Medication medication;
  final int userId;

  const MedicationDetailPage({
    super.key, 
    required this.medication,
    required this.userId,
  });

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<MedicationProvider>(context);
    
    final currentMedication = provider.medications.firstWhere(
      (m) => m.id == medication.id, 
      orElse: () => medication
    );

    return Scaffold(
      backgroundColor: AppConstants.backgroundColor,
      appBar: AppBar(
        title: Text(currentMedication.name, style: const TextStyle(color: Colors.black)),
        backgroundColor: Colors.white,
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.black),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildInfoCard(currentMedication),
            
            const SizedBox(height: 24),
            const Text("Doz Takvimi", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            
            Expanded(
              child: currentMedication.doseSchedules.isEmpty 
                ? const Center(child: Text("Planlanmış saat yok."))
                : ListView.builder(
                    itemCount: currentMedication.doseSchedules.length,
                    itemBuilder: (context, index) {
                      final dose = currentMedication.doseSchedules[index];
                      return _buildDoseItem(context, currentMedication, dose, provider);
                    },
                  ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoCard(Medication med) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 10, offset: Offset(0, 4))],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppConstants.primaryColor.withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.medical_services, size: 32, color: AppConstants.primaryColor),
          ),
          const SizedBox(width: 16),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(med.name, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
              const SizedBox(height: 4),
              Text("${med.dose} • Günde ${med.frequencyPerDay} kez", 
                style: TextStyle(color: Colors.grey[600])),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildDoseItem(BuildContext context, Medication med, MedicationDoseSchedule dose, MedicationProvider provider) {
    final timeString = DateFormat('HH:mm').format(dose.scheduledTime);
    final bool isTaken = dose.isTaken;

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      elevation: 1,
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        leading: Icon(
          Icons.access_time_filled, 
          color: isTaken ? AppConstants.accentColor : Colors.grey[400],
          size: 28,
        ),
        title: Text(
          "$timeString - ${dose.notes ?? 'Doz'}",
          style: TextStyle(
            fontWeight: FontWeight.bold,
            decoration: isTaken ? TextDecoration.lineThrough : null,
            color: isTaken ? Colors.grey : Colors.black,
          ),
        ),
        subtitle: Text(
          isTaken ? "Alındı" : "Bekleniyor",
          style: TextStyle(
            color: isTaken ? AppConstants.accentColor : Colors.grey,
            fontWeight: isTaken ? FontWeight.bold : FontWeight.normal
          ),
        ),
        trailing: isTaken
            ? const Icon(Icons.check_circle, color: AppConstants.accentColor, size: 34)
            : ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppConstants.primaryColor,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                ),
                onPressed: () {
                  provider.markDoseAsTaken(med.id, dose.id, userId);
                  
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text("Harika! İlaç kaydedildi. 💊"), 
                      backgroundColor: AppConstants.accentColor,
                      duration: Duration(seconds: 1),
                    ),
                  );
                },
                child: const Text("Aldım", style: TextStyle(color: Colors.white)),
              ),
      ),
    );
  }
}