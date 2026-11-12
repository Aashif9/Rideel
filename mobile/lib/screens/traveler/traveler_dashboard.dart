import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

final List<Map<String, dynamic>> mockRequests = [
  {
    'id': 'r1',
    'sender': 'Aashi Gupta',
    'from': 'Mumbai',
    'to': 'Pune',
    'desc': 'Electronics (Laptop)',
    'weight': 2.5,
    'category': 'Electronics',
    'pickup': 'Andheri West, Mumbai',
    'dropoff': 'Hinjewadi, Pune',
    'price': 125,
    'date': 'Dec 15, 2024',
    'senderRating': 4.6,
  },
  {
    'id': 'r2',
    'sender': 'Ravi Verma',
    'from': 'Mumbai',
    'to': 'Pune',
    'desc': 'Documents',
    'weight': 0.5,
    'category': 'Documents',
    'pickup': 'Bandra, Mumbai',
    'dropoff': 'Kothrud, Pune',
    'price': 75,
    'date': 'Dec 15, 2024',
    'senderRating': 4.2,
  },
  {
    'id': 'r3',
    'sender': 'Meera Singh',
    'from': 'Mumbai',
    'to': 'Pune',
    'desc': 'Clothing items',
    'weight': 3.0,
    'category': 'Clothing',
    'pickup': 'Dadar, Mumbai',
    'dropoff': 'Viman Nagar, Pune',
    'price': 90,
    'date': 'Dec 16, 2024',
    'senderRating': 4.8,
  },
  {
    'id': 'r4',
    'sender': 'Suresh Kumar',
    'from': 'Mumbai',
    'to': 'Pune',
    'desc': 'Medicine',
    'weight': 1.0,
    'category': 'Medicine',
    'pickup': 'Borivali, Mumbai',
    'dropoff': 'Wakad, Pune',
    'price': 60,
    'date': 'Dec 16, 2024',
    'senderRating': 4.4,
  },
];

final List<Map<String, dynamic>> mockTrips = [
  {
    'id': 'trip1',
    'from': 'Mumbai',
    'to': 'Pune',
    'date': 'Dec 15, 2024',
    'status': 'active',
    'availableWeight': 7.5,
    'pricePerKg': 50,
    'acceptedCount': 2,
    'earnings': 200,
  },
  {
    'id': 'trip2',
    'from': 'Delhi',
    'to': 'Jaipur',
    'date': 'Dec 10, 2024',
    'status': 'completed',
    'availableWeight': 0.0,
    'pricePerKg': 45,
    'acceptedCount': 3,
    'earnings': 450,
  },
];

class TravelerDashboard extends StatefulWidget {
  const TravelerDashboard({super.key});

  @override
  State<TravelerDashboard> createState() => _TravelerDashboardState();
}

class _TravelerDashboardState extends State<TravelerDashboard> {
  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FE),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        title: Text(
          'Hello, Traveler 👋',
          style: GoogleFonts.poppins(
            fontSize: 20,
            fontWeight: FontWeight.w600,
            color: const Color(0xFF1A1A2E),
          ),
        ),
        actions: [
          Stack(
            children: [
              IconButton(
                icon: const Icon(Icons.notifications_outlined, color: Color(0xFF1A1A2E)),
                onPressed: () => context.push('/notifications'),
              ),
              Positioned(
                right: 8,
                top: 8,
                child: Container(
                  padding: const EdgeInsets.all(2),
                  decoration: const BoxDecoration(
                    color: Color(0xFFFF6584),
                    shape: BoxShape.circle,
                  ),
                  constraints: const BoxConstraints(minWidth: 16, minHeight: 16),
                  child: Text(
                    '2',
                    style: GoogleFonts.poppins(
                      color: Colors.white,
                      fontSize: 10,
                      fontWeight: FontWeight.w600,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildHeroCard(context),
            const SizedBox(height: 16),
            _buildEarningsSummary(),
            const SizedBox(height: 20),
            _buildSectionHeader(context),
            const SizedBox(height: 12),
            ...mockRequests.take(2).map((r) => _buildRequestCard(context, r)),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => context.push('/traveler/create-trip'),
        backgroundColor: const Color(0xFF6C63FF),
        child: const Icon(Icons.add, color: Colors.white),
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (i) {
          setState(() => _currentIndex = i);
          switch (i) {
            case 1:
              context.push('/traveler/my-trips');
              break;
            case 2:
              context.push('/wallet');
              break;
            case 3:
              context.push('/notifications');
              break;
            case 4:
              context.push('/profile');
              break;
          }
        },
        type: BottomNavigationBarType.fixed,
        selectedItemColor: const Color(0xFF6C63FF),
        unselectedItemColor: const Color(0xFF6B7280),
        selectedLabelStyle: GoogleFonts.poppins(fontSize: 11, fontWeight: FontWeight.w500),
        unselectedLabelStyle: GoogleFonts.poppins(fontSize: 11),
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home_outlined), activeIcon: Icon(Icons.home), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.luggage_outlined), activeIcon: Icon(Icons.luggage), label: 'My Trips'),
          BottomNavigationBarItem(icon: Icon(Icons.account_balance_wallet_outlined), activeIcon: Icon(Icons.account_balance_wallet), label: 'Wallet'),
          BottomNavigationBarItem(icon: Icon(Icons.notifications_outlined), activeIcon: Icon(Icons.notifications), label: 'Alerts'),
          BottomNavigationBarItem(icon: Icon(Icons.person_outline), activeIcon: Icon(Icons.person), label: 'Profile'),
        ],
      ),
    );
  }

  Widget _buildHeroCard(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF6C63FF), Color(0xFF3F37C9)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF6C63FF).withOpacity(0.3),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Create a Trip',
            style: GoogleFonts.poppins(
              fontSize: 22,
              fontWeight: FontWeight.w700,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            'List your route and earn by carrying parcels',
            style: GoogleFonts.poppins(
              fontSize: 13,
              color: Colors.white.withOpacity(0.85),
            ),
          ),
          const SizedBox(height: 16),
          ElevatedButton(
            onPressed: () => context.push('/traveler/create-trip'),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.white,
              foregroundColor: const Color(0xFF6C63FF),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
              elevation: 0,
            ),
            child: Text(
              'Create Trip',
              style: GoogleFonts.poppins(fontWeight: FontWeight.w600, fontSize: 14),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEarningsSummary() {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 8),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _buildStatItem('₹650', 'Earned', Icons.currency_rupee, const Color(0xFF10B981)),
          _buildDivider(),
          _buildStatItem('5', 'Trips', Icons.luggage, const Color(0xFF6C63FF)),
          _buildDivider(),
          _buildStatItem('4.8', 'Rating', Icons.star, const Color(0xFFF59E0B)),
        ],
      ),
    );
  }

  Widget _buildDivider() {
    return Container(width: 1, height: 40, color: const Color(0xFFE5E7EB));
  }

  Widget _buildStatItem(String value, String label, IconData icon, Color color) {
    return Column(
      children: [
        Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 16, color: color),
            const SizedBox(width: 4),
            Text(
              value,
              style: GoogleFonts.poppins(
                fontSize: 18,
                fontWeight: FontWeight.w700,
                color: const Color(0xFF1A1A2E),
              ),
            ),
          ],
        ),
        const SizedBox(height: 2),
        Text(
          label,
          style: GoogleFonts.poppins(
            fontSize: 12,
            color: const Color(0xFF6B7280),
          ),
        ),
      ],
    );
  }

  Widget _buildSectionHeader(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          'Available Requests',
          style: GoogleFonts.poppins(
            fontSize: 16,
            fontWeight: FontWeight.w600,
            color: const Color(0xFF1A1A2E),
          ),
        ),
        GestureDetector(
          onTap: () => context.push('/traveler/requests'),
          child: Text(
            'View All',
            style: GoogleFonts.poppins(
              fontSize: 13,
              fontWeight: FontWeight.w500,
              color: const Color(0xFF6C63FF),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildRequestCard(BuildContext context, Map<String, dynamic> request) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                request['sender'],
                style: GoogleFonts.poppins(
                  fontSize: 15,
                  fontWeight: FontWeight.w600,
                  color: const Color(0xFF1A1A2E),
                ),
              ),
              Text(
                '₹${request['price']}',
                style: GoogleFonts.poppins(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: const Color(0xFF10B981),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              Text(
                request['from'],
                style: GoogleFonts.poppins(fontSize: 13, color: const Color(0xFF1A1A2E)),
              ),
              const Padding(
                padding: EdgeInsets.symmetric(horizontal: 6),
                child: Icon(Icons.arrow_forward, size: 14, color: Color(0xFF6C63FF)),
              ),
              Text(
                request['to'],
                style: GoogleFonts.poppins(fontSize: 13, color: const Color(0xFF1A1A2E)),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: const Color(0xFF6C63FF).withOpacity(0.1),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  request['category'],
                  style: GoogleFonts.poppins(
                    fontSize: 11,
                    color: const Color(0xFF6C63FF),
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Text(
                '${request['weight']} kg',
                style: GoogleFonts.poppins(fontSize: 12, color: const Color(0xFF6B7280)),
              ),
              const Spacer(),
              TextButton(
                onPressed: () => context.push('/traveler/request-details', extra: request),
                style: TextButton.styleFrom(
                  foregroundColor: const Color(0xFF6C63FF),
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                    side: const BorderSide(color: Color(0xFF6C63FF)),
                  ),
                ),
                child: Text(
                  'View Details',
                  style: GoogleFonts.poppins(fontSize: 12, fontWeight: FontWeight.w500),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
