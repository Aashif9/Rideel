import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

const Color _primary = Color(0xFF6C63FF);
const Color _background = Color(0xFFF8F9FE);
const Color _textPrimary = Color(0xFF1A1A2E);
const Color _textSecondary = Color(0xFF6B7280);
const Color _success = Color(0xFF10B981);

final List<Map<String, dynamic>> mockTravelers = [
  {
    'id': 't1',
    'name': 'Rahul Sharma',
    'phone': '9876543210',
    'rating': 4.8,
    'totalTrips': 45,
    'vehicleType': 'Car',
    'verified': true,
    'from': 'Mumbai',
    'to': 'Pune',
    'date': 'Dec 15, 2024',
    'availableWeight': 10,
    'pricePerKg': 50,
    'avatar': 'RS'
  },
  {
    'id': 't2',
    'name': 'Priya Patel',
    'phone': '8765432109',
    'rating': 4.9,
    'totalTrips': 78,
    'vehicleType': 'Train',
    'verified': true,
    'from': 'Mumbai',
    'to': 'Pune',
    'date': 'Dec 15, 2024',
    'availableWeight': 15,
    'pricePerKg': 45,
    'avatar': 'PP'
  },
  {
    'id': 't3',
    'name': 'Amit Kumar',
    'phone': '7654321098',
    'rating': 4.5,
    'totalTrips': 23,
    'vehicleType': 'Bike',
    'verified': false,
    'from': 'Mumbai',
    'to': 'Pune',
    'date': 'Dec 16, 2024',
    'availableWeight': 5,
    'pricePerKg': 40,
    'avatar': 'AK'
  },
  {
    'id': 't4',
    'name': 'Sneha Joshi',
    'phone': '6543210987',
    'rating': 4.7,
    'totalTrips': 56,
    'vehicleType': 'Bus',
    'verified': true,
    'from': 'Mumbai',
    'to': 'Pune',
    'date': 'Dec 16, 2024',
    'availableWeight': 20,
    'pricePerKg': 35,
    'avatar': 'SJ'
  },
];

class AvailableTravelersScreen extends StatefulWidget {
  const AvailableTravelersScreen({super.key});

  @override
  State<AvailableTravelersScreen> createState() => _AvailableTravelersScreenState();
}

class _AvailableTravelersScreenState extends State<AvailableTravelersScreen> {
  IconData _vehicleIcon(String type) {
    switch (type.toLowerCase()) {
      case 'car':
        return Icons.directions_car;
      case 'train':
        return Icons.train;
      case 'bike':
        return Icons.two_wheeler;
      case 'bus':
        return Icons.directions_bus;
      default:
        return Icons.local_shipping;
    }
  }

  Widget _buildStars(double rating) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: List.generate(5, (i) {
        if (i < rating.floor()) {
          return const Icon(Icons.star, size: 14, color: Color(0xFFF59E0B));
        } else if (i < rating && rating - i >= 0.5) {
          return const Icon(Icons.star_half, size: 14, color: Color(0xFFF59E0B));
        }
        return const Icon(Icons.star_border, size: 14, color: Color(0xFFF59E0B));
      }),
    );
  }

  void _showFilterSheet() {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => Container(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Filter Travelers',
              style: GoogleFonts.poppins(
                fontSize: 18,
                fontWeight: FontWeight.w700,
                color: _textPrimary,
              ),
            ),
            const SizedBox(height: 16),
            Text('Vehicle Type', style: GoogleFonts.poppins(fontWeight: FontWeight.w600)),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              children: ['All', 'Car', 'Train', 'Bus', 'Bike'].map((v) {
                return FilterChip(
                  label: Text(v, style: GoogleFonts.poppins(fontSize: 13)),
                  selected: v == 'All',
                  selectedColor: _primary.withOpacity(0.2),
                  onSelected: (_) {},
                );
              }).toList(),
            ),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () => Navigator.pop(ctx),
                style: ElevatedButton.styleFrom(
                  backgroundColor: _primary,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: Text('Apply', style: GoogleFonts.poppins(fontWeight: FontWeight.w700, color: Colors.white)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _background,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: _textPrimary),
          onPressed: () => context.go('/sender/create-parcel'),
        ),
        title: Text(
          'Available Travelers',
          style: GoogleFonts.poppins(
            fontSize: 20,
            fontWeight: FontWeight.w700,
            color: _textPrimary,
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.filter_list, color: _primary),
            onPressed: _showFilterSheet,
          ),
        ],
      ),
      body: Column(
        children: [
          // Route summary card
          Container(
            margin: const EdgeInsets.all(16),
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF6C63FF), Color(0xFF5A52E0)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(14),
              boxShadow: [
                BoxShadow(
                  color: _primary.withOpacity(0.3),
                  blurRadius: 12,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Row(
              children: [
                const Icon(Icons.location_on, color: Colors.white, size: 20),
                const SizedBox(width: 8),
                Text(
                  'Mumbai → Pune',
                  style: GoogleFonts.poppins(
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                    color: Colors.white,
                  ),
                ),
                const Spacer(),
                const Icon(Icons.calendar_today, color: Colors.white70, size: 16),
                const SizedBox(width: 6),
                Text(
                  'Dec 15, 2024',
                  style: GoogleFonts.poppins(
                    fontSize: 13,
                    color: Colors.white.withOpacity(0.9),
                  ),
                ),
              ],
            ),
          ),

          // Count
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              children: [
                Text(
                  '${mockTravelers.length} travelers found',
                  style: GoogleFonts.poppins(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: _textSecondary,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 8),

          // Traveler list
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              itemCount: mockTravelers.length,
              itemBuilder: (ctx, i) => _buildTravelerCard(mockTravelers[i]),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTravelerCard(Map<String, dynamic> t) {
    return Container(
      margin: const EdgeInsets.only(bottom: 14),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.07),
            blurRadius: 10,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Avatar
              Stack(
                children: [
                  Container(
                    width: 54,
                    height: 54,
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [_primary, _primary.withOpacity(0.7)],
                      ),
                      shape: BoxShape.circle,
                    ),
                    child: Center(
                      child: Text(
                        t['avatar'],
                        style: GoogleFonts.poppins(
                          fontSize: 18,
                          fontWeight: FontWeight.w700,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ),
                  if (t['verified'] == true)
                    Positioned(
                      right: 0,
                      bottom: 0,
                      child: Container(
                        width: 18,
                        height: 18,
                        decoration: const BoxDecoration(
                          color: _success,
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.check, size: 11, color: Colors.white),
                      ),
                    ),
                ],
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      t['name'],
                      style: GoogleFonts.poppins(
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                        color: _textPrimary,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Row(
                      children: [
                        _buildStars(t['rating']),
                        const SizedBox(width: 4),
                        Text(
                          '${t['rating']} (${t['totalTrips']} trips)',
                          style: GoogleFonts.poppins(fontSize: 12, color: _textSecondary),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        Icon(_vehicleIcon(t['vehicleType']), size: 16, color: _primary),
                        const SizedBox(width: 4),
                        Text(
                          t['vehicleType'],
                          style: GoogleFonts.poppins(
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                            color: _primary,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          const Divider(color: Color(0xFFE5E7EB)),
          const SizedBox(height: 10),

          // Route & date
          Row(
            children: [
              const Icon(Icons.my_location, size: 14, color: _textSecondary),
              const SizedBox(width: 4),
              Text(t['from'], style: GoogleFonts.poppins(fontSize: 13, fontWeight: FontWeight.w600, color: _textPrimary)),
              const Padding(
                padding: EdgeInsets.symmetric(horizontal: 6),
                child: Icon(Icons.arrow_forward, size: 14, color: _textSecondary),
              ),
              const Icon(Icons.location_on, size: 14, color: _textSecondary),
              const SizedBox(width: 4),
              Text(t['to'], style: GoogleFonts.poppins(fontSize: 13, fontWeight: FontWeight.w600, color: _textPrimary)),
              const Spacer(),
              const Icon(Icons.calendar_today, size: 13, color: _textSecondary),
              const SizedBox(width: 4),
              Text(t['date'], style: GoogleFonts.poppins(fontSize: 12, color: _textSecondary)),
            ],
          ),
          const SizedBox(height: 10),

          Row(
            children: [
              _infoChip(Icons.scale, '${t['availableWeight']} kg avail.'),
              const SizedBox(width: 10),
              _infoChip(Icons.currency_rupee, '${t['pricePerKg']}/kg'),
              const Spacer(),
              ElevatedButton(
                onPressed: () {
                  context.go('/sender/traveler-profile', extra: t);
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: _primary,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  elevation: 0,
                ),
                child: Text(
                  'View Profile',
                  style: GoogleFonts.poppins(fontSize: 13, fontWeight: FontWeight.w700),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _infoChip(IconData icon, String text) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: _primary.withOpacity(0.08),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 13, color: _primary),
          const SizedBox(width: 4),
          Text(
            text,
            style: GoogleFonts.poppins(fontSize: 12, fontWeight: FontWeight.w600, color: _primary),
          ),
        ],
      ),
    );
  }
}
