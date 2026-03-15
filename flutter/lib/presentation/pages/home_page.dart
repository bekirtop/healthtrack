import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:jwt_decoder/jwt_decoder.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../core/constants.dart';
import '../../data/services/auth_service.dart';
import '../state/medication_provider.dart';
import '../widgets/medication_card.dart';
import 'login_page.dart';
import 'medication_detail_page.dart'; 
import 'side_effect_page.dart'; 
import 'chat_page.dart';
import 'profile_page.dart'; 
import 'social_feed_page.dart';
import 'education_page.dart';
import '../state/content_provider.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  String userName = "";
  int? currentUserId; 
  int _selectedIndex = 0;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('jwt_token');

    if (token != null) {
      Map<String, dynamic> decodedToken = JwtDecoder.decode(token);
      int userId = int.parse(decodedToken['sub'].toString());
      String name = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ?? "Kullanıcı";

      if (mounted) {
        setState(() {
          userName = name;
          currentUserId = userId; 
        });
        Provider.of<MedicationProvider>(context, listen: false).fetchMedications(userId);
        Provider.of<ContentProvider>(context, listen: false).fetchContentForPatient(userId);
      }
    }
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    final medProvider = Provider.of<MedicationProvider>(context);

    return Scaffold(
      backgroundColor: AppConstants.backgroundColor,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        toolbarHeight: 80,
        titleSpacing: 16,
        title: Row(
          children: [
            Container(
              width: 50,
              height: 50,
              decoration: BoxDecoration(
                color: AppConstants.primaryColor.withOpacity(0.1),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: AppConstants.primaryColor.withOpacity(0.2)),
              ),
              child: Center(
                child: Text(
                  userName.isNotEmpty ? userName[0].toUpperCase() : "?",
                  style: const TextStyle(
                    color: AppConstants.primaryColor,
                    fontSize: 24,
                    fontWeight: FontWeight.w900,
                  ),
                ),
              ),
            ),
            const SizedBox(width: 12),
            
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Text(
                  "Tekrar Merhaba 👋", 
                  style: TextStyle(color: Colors.grey, fontSize: 12, fontWeight: FontWeight.w500),
                ),
                const SizedBox(height: 2),
                Text(
                  userName.isNotEmpty ? userName : "Kullanıcı",
                  style: const TextStyle(
                    color: Colors.black87, 
                    fontWeight: FontWeight.w800,
                    fontSize: 18,
                    letterSpacing: 0.5,
                  ),
                ),
              ],
            ),
          ],
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 8.0),
            child: Row(
              children: [
                IconButton(
                  icon: const Icon(Icons.chat_bubble_outline, color: AppConstants.primaryColor),
                  tooltip: "Doktorla Konuş",
                  onPressed: () {
                    final contentProvider = Provider.of<ContentProvider>(context, listen: false);
                    if (currentUserId != null) {
                      if (contentProvider.doctorUserId != null) {
                        Navigator.push(context, MaterialPageRoute(builder: (_) => ChatPage(
                          currentUserId: currentUserId!,
                          doctorUserId: contentProvider.doctorUserId!,
                          doctorName: contentProvider.doctorName,
                        )));
                      } else {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text("Size atanmış bir doktor bulunmamaktadır veya yükleniyor.")),
                        );
                      }
                    }
                  },
                ),
                IconButton(
                  icon: const Icon(Icons.report_problem_outlined, color: Colors.orange),
                  tooltip: "Yan Etki Bildir",
                  onPressed: () async {
                    if (currentUserId != null) {
                      final medicationService = Provider.of<MedicationProvider>(context, listen: false).medications;
                      Navigator.push(
                        context, 
                        MaterialPageRoute(
                          builder: (_) => SideEffectPage(userId: currentUserId!),
                        ),
                      );
                    }
                  },
                ),
                IconButton(
                  icon: Container(
                    padding: const EdgeInsets.all(2),
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(color: Colors.grey.shade300)
                    ),
                    child: const Icon(Icons.person, color: Colors.black87, size: 24),
                  ),
                  tooltip: "Profilim",
                  onPressed: () {
                    if (currentUserId != null) {
                      Navigator.push(context, MaterialPageRoute(builder: (_) => ProfilePage(userId: currentUserId!)));
                    }
                  },
                )
              ],
            ),
          )
        ],
      ),
      body: _selectedIndex == 0
          ? (medProvider.isLoading
              ? const Center(child: CircularProgressIndicator())
              : Padding(
                  padding: const EdgeInsets.fromLTRB(16, 16, 16, 0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text("Günlük İlaç Takibi", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.black87)),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(color: Colors.green.shade50, borderRadius: BorderRadius.circular(8)),
                            child: const Text("Bugün", style: TextStyle(color: Colors.green, fontWeight: FontWeight.bold, fontSize: 12)),
                          )
                        ],
                      ),
                      const SizedBox(height: 16),
                      
                      Expanded(
                        child: medProvider.medications.isEmpty
                            ? Center(
                                child: Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Icon(Icons.medication_liquid_sharp, size: 60, color: Colors.grey.shade300),
                                    const SizedBox(height: 10),
                                    const Text("Kayıtlı ilaç bulunamadı.", style: TextStyle(color: Colors.grey)),
                                  ],
                                ),
                              )
                            : RefreshIndicator(
                                onRefresh: () async {
                                  await _loadData();
                                },
                                child: ListView.builder(
                                  itemCount: medProvider.medications.length,
                                  itemBuilder: (context, index) {
                                    final med = medProvider.medications[index];
                                    return MedicationCard(
                                      medication: med,
                                      onTap: () {
                                        if (currentUserId != null) {
                                          Navigator.push(
                                            context,
                                            MaterialPageRoute(
                                              builder: (context) => MedicationDetailPage(
                                                medication: med,
                                                userId: currentUserId!,
                                              ),
                                            ),
                                          );
                                        }
                                      },
                                    );
                                  },
                                ),
                              ),
                      ),
                    ],
                  ),
                ))
          : _selectedIndex == 1
              ? const SocialFeedPage()
              : const EducationPage(),
      bottomNavigationBar: BottomNavigationBar(
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(
            icon: Icon(Icons.medication),
            label: 'İlaçlar',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.dynamic_feed),
            label: 'Sosyal Akış',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.school),
            label: 'Eğitim',
          ),
        ],
        currentIndex: _selectedIndex,
        selectedItemColor: AppConstants.primaryColor,
        onTap: _onItemTapped,
      ),
    );
  }
}