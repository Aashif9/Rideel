import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

const Color _primary = Color(0xFF6C63FF);
const Color _secondary = Color(0xFFFF6584);
const Color _background = Color(0xFFF8F9FE);
const Color _textPrimary = Color(0xFF1A1A2E);
const Color _textSecondary = Color(0xFF6B7280);
const Color _success = Color(0xFF10B981);
const Color _warning = Color(0xFFF59E0B);

final List<Map<String, dynamic>> mockDeliveries = [
  {
    'id': 'd1',
    'from': 'Mumbai',
    'to': 'Pune',
    'status': 'in_transit',
    'traveler': 'Rahul Sharma',
    'weight': '2.5 kg',
    'desc': 'Electronics',
    'price': 125,
    'date': 'Dec 15, 2024',
    'eta': 'Dec 15, 2024 6 PM'
  },
  {
    'id': 'd2',
    'from': 'Delhi',
    'to': 'Jaipur',
    'status': 'delivered',
    'traveler': 'Priya Patel',
    'weight': '1 kg',
    'desc': 'Documents',
    'price': 75,
    'date': 'Dec 10, 2024',
    'eta': 'Delivered'
  },
  {
    'id': 'd3',
    'from': 'Bangalore',
    'to': 'Chennai',
    'status': 'pending',
    'traveler': 'Not assigned',
    'weight': '3 kg',
    'desc': 'Clothing',
    'price': 90,
    'date': 'Dec 18, 2024',
    'eta': 'Pending'
  },
];

class SenderDashboard extends StatefulWidget {
  const SenderDashboard({super.key});

  @override
  State<SenderDashboard> createState() => _SenderDashboardState();
}

class _SenderDashboardState extends State<SenderDashboard> {
  int _currentIndex = 0;

  Color _statusColor(String status) {
    switch (status) {
      case 'in_transit':
        return _primary;
      case 'delivered':
        return _success;
      case 'pending':
        return _warning;
      default:
        return _textSecondary;
    }
  }

  String _statusLabel(String status) {
    switch (status) {
      case 'in_transit':
        return 'In Transit';
      case 'delivered':
        return 'Delivered';
      case 'pending':
        return 'Pending';
      default:
        return status;
    }
  }

  void _onNavTap(int index) {
    setState(() => _currentIndex = index);
    switch (index) {
      case 0:
        context.go('/sender/dashboard');
        break;
      case 1:
        context.go('/sender/my-deliveries');
        break;
      case 2:
        // wallet placeholder
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Wallet coming soon!')),
        );
        break;
      case 3:
        // notifications placeholder
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Notifications coming soon!')),
        );
        break;
      case 4:
        // profile placeholder
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Profile coming soon!')),
        );
        break;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _background,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        automaticallyImplyLeading: false,
        title: Text(
          'Hello, Aashi 👋',
          style: GoogleFonts.poppins(
            fontSize: 20,
            fontWeight: FontWeight.w700,
            color: _textPrimary,
          ),
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16),
            child: Stack(
              children: [
                IconButton(
                  icon: const Icon(Icons.notifications_outlined, color: _textPrimary, size: 28),
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Notifications coming soon!')),
                    );
                  },
                ),
                Positioned(
                  right: 8,
                  top: 8,
                  child: Container(
                    padding: const EdgeInsets.all(3),
                    decoration: const BoxDecoration(
                      color: _secondary,
                      shape: BoxShape.circle,
                    ),
                    child: Text(
                      '3',
                      style: GoogleFonts.poppins(
                        fontSize: 10,
                        fontWeight: FontWeight.w700,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Purple gradient hero card
            _buildHeroCard(),
            const SizedBox(height: 20),
            // Stats row
            _buildStatsRow(),
            const SizedBox(height: 24),
            // Recent deliveries
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Recent Deliveries',
                  style: GoogleFonts.poppins(
                    fontSize: 18,
                    fontWeight: FontWeight.w700,
                    color: _textPrimary,
                  ),
                ),
                TextButton(
                  onPressed: () => context.go('/sender/my-deliveries'),
                  child: Text(
                    'See All',
                    style: GoogleFonts.poppins(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: _primary,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            ...mockDeliveries.take(2).map((d) => _buildDeliveryCard(d)),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => context.go('/sender/create-parcel'),
        backgroundColor: _primary,
        child: const Icon(Icons.add, color: Colors.white),
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: _onNavTap,
        type: BottomNavigationBarType.fixed,
        selectedItemColor: _primary,
        unselectedItemColor: _textSecondary,
        selectedLabelStyle: GoogleFonts.poppins(fontSize: 11, fontWeight: FontWeight.w600),
        unselectedLabelStyle: GoogleFonts.poppins(fontSize: 11),
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home_outlined), activeIcon: Icon(Icons.home), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.local_shipping_outlined), activeIcon: Icon(Icons.local_shipping), label: 'My Deliveries'),
          BottomNavigationBarItem(icon: Icon(Icons.account_balance_wallet_outlined), activeIcon: Icon(Icons.account_balance_wallet), label: 'Wallet'),
          BottomNavigationBarItem(icon: Icon(Icons.notifications_outlined), activeIcon: Icon(Icons.notifications), label: 'Notifications'),
          BottomNavigationBarItem(icon: Icon(Icons.person_outline), activeIcon: Icon(Icons.person), label: 'Profile'),
        ],
      ),
    );
  }

  Widget _buildHeroCard() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF6C63FF), Color(0xFF5A52E0)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: _primary.withOpacity(0.35),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Icon(Icons.send_rounded, color: Colors.white, size: 28),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Send a Parcel',
                      style: GoogleFonts.poppins(
                        fontSize: 22,
                        fontWeight: FontWeight.w800,
                        color: Colors.white,
                      ),
                    ),
                    Text(
                      'Connect with travelers on your route',
                      style: GoogleFonts.poppins(
                        fontSize: 13,
                        color: Colors.white.withOpacity(0.85),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: () => context.go('/sender/create-parcel'),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.white,
                foregroundColor: _primary,
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                elevation: 0,
              ),
              child: Text(
                'Send Now',
                style: GoogleFonts.poppins(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatsRow() {
    final stats = [
      {'label': 'Active', 'value': '3', 'icon': Icons.local_shipping, 'color': _primary},
      {'label': 'Total', 'value': '12', 'icon': Icons.inventory_2, 'color': _secondary},
      {'label': 'Rating', 'value': '4.8', 'icon': Icons.star, 'color': _warning},
    ];
    return Row(
      children: stats.map((s) {
        return Expanded(
          child: Container(
            margin: EdgeInsets.only(
              left: stats.indexOf(s) == 0 ? 0 : 6,
              right: stats.indexOf(s) == stats.length - 1 ? 0 : 6,
            ),
            padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 12),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.06),
                  blurRadius: 8,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Column(
              children: [
                Icon(s['icon'] as IconData, color: s['color'] as Color, size: 24),
                const SizedBox(height: 8),
                Text(
                  s['value'] as String,
                  style: GoogleFonts.poppins(
                    fontSize: 20,
                    fontWeight: FontWeight.w800,
                    color: _textPrimary,
                  ),
                ),
                Text(
                  s['label'] as String,
                  style: GoogleFonts.poppins(
                    fontSize: 12,
                    color: _textSecondary,
                  ),
                ),
              ],
            ),
          ),
        );
      }).toList(),
    );
  }

  Widget _buildDeliveryCard(Map<String, dynamic> d) {
    final statusColor = _statusColor(d['status']);
    final statusLabel = _statusLabel(d['status']);
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.06),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Row(
                  children: [
                    Text(
                      d['from'],
                      style: GoogleFonts.poppins(
                        fontSize: 15,
                        fontWeight: FontWeight.w700,
                        color: _textPrimary,
                      ),
                    ),
                    const Padding(
                      padding: EdgeInsets.symmetric(horizontal: 8),
                      child: Icon(Icons.arrow_forward, size: 16, color: _textSecondary),
                    ),
                    Text(
                      d['to'],
                      style: GoogleFonts.poppins(
                        fontSize: 15,
                        fontWeight: FontWeight.w700,
                        color: _textPrimary,
                      ),
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: statusColor.withOpacity(0.12),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  statusLabel,
                  style: GoogleFonts.poppins(
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    color: statusColor,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              const Icon(Icons.person_outline, size: 14, color: _textSecondary),
              const SizedBox(width: 4),
              Text(
                d['traveler'],
                style: GoogleFonts.poppins(fontSize: 13, color: _textSecondary),
              ),
              const Spacer(),
              Text(
                '₹${d['price']}',
                style: GoogleFonts.poppins(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: _primary,
                ),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Text(
            d['desc'],
            style: GoogleFonts.poppins(fontSize: 12, color: _textSecondary),
          ),
        ],
      ),
    );
  }
}
