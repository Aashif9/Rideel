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

class TravelerProfileScreen extends StatelessWidget {
  final dynamic traveler;
  const TravelerProfileScreen({super.key, this.traveler});

  static const _defaultTraveler = {
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
    'avatar': 'RS',
  };

  static const _mockReviews = [
    {'name': 'Meera K.', 'rating': 5, 'review': 'Very reliable and delivered on time. Package was in perfect condition!'},
    {'name': 'Suresh P.', 'rating': 5, 'review': 'Great communication throughout the journey. Highly recommend!'},
    {'name': 'Anjali R.', 'rating': 4, 'review': 'Good experience overall. Would use again for future deliveries.'},
  ];

  IconData _vehicleIcon(String type) {
    switch (type.toLowerCase()) {
      case 'car': return Icons.directions_car;
      case 'train': return Icons.train;
      case 'bike': return Icons.two_wheeler;
      case 'bus': return Icons.directions_bus;
      default: return Icons.local_shipping;
    }
  }

  Widget _buildStars(double rating, {double size = 16}) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: List.generate(5, (i) {
        if (i < rating.floor()) return Icon(Icons.star, size: size, color: _warning);
        if (i < rating && rating - i >= 0.5) return Icon(Icons.star_half, size: size, color: _warning);
        return Icon(Icons.star_border, size: size, color: _warning);
      }),
    );
  }

  void _showBookingSheet(BuildContext context, Map t) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) => Container(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: const Color(0xFFE5E7EB),
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            const SizedBox(height: 20),
            Text(
              'Confirm Booking',
              style: GoogleFonts.poppins(
                fontSize: 20,
                fontWeight: FontWeight.w700,
                color: _textPrimary,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'You\'re about to book ${t['name']} for your parcel delivery.',
              textAlign: TextAlign.center,
              style: GoogleFonts.poppins(fontSize: 14, color: _textSecondary),
            ),
            const SizedBox(height: 20),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: _primary.withOpacity(0.06),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                children: [
                  Container(
                    width: 48,
                    height: 48,
                    decoration: const BoxDecoration(color: _primary, shape: BoxShape.circle),
                    child: Center(
                      child: Text(
                        t['avatar'],
                        style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w700, color: Colors.white),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(t['name'], style: GoogleFonts.poppins(fontSize: 15, fontWeight: FontWeight.w700, color: _textPrimary)),
                        Row(
                          children: [
                            _buildStars((t['rating'] as num).toDouble(), size: 13),
                            const SizedBox(width: 4),
                            Text('${t['rating']}', style: GoogleFonts.poppins(fontSize: 12, color: _textSecondary)),
                          ],
                        ),
                      ],
                    ),
                  ),
                  Text(
                    '₹${t['pricePerKg']}/kg',
                    style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w700, color: _primary),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: () => Navigator.pop(ctx),
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      side: const BorderSide(color: _primary),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: Text('Cancel', style: GoogleFonts.poppins(fontWeight: FontWeight.w700, color: _primary)),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.pop(ctx);
                      context.go('/sender/booking-confirmation', extra: t);
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: _primary,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      elevation: 0,
                    ),
                    child: Text('Book Now', style: GoogleFonts.poppins(fontWeight: FontWeight.w700, color: Colors.white)),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final t = (traveler != null && traveler is Map) ? Map<String, dynamic>.from(traveler) : Map<String, dynamic>.from(_defaultTraveler);
    final rating = (t['rating'] as num).toDouble();

    return Scaffold(
      backgroundColor: _background,
      body: CustomScrollView(
        slivers: [
          // SliverAppBar with gradient
          SliverAppBar(
            expandedHeight: 200,
            pinned: true,
            backgroundColor: _primary,
            leading: IconButton(
              icon: const Icon(Icons.arrow_back_ios_new, color: Colors.white),
              onPressed: () => context.go('/sender/available-travelers'),
            ),
            title: Text(
              t['name'],
              style: GoogleFonts.poppins(
                fontSize: 18,
                fontWeight: FontWeight.w700,
                color: Colors.white,
              ),
            ),
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    colors: [Color(0xFF6C63FF), Color(0xFF5A52E0)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const SizedBox(height: 48),
                    // Large avatar
                    Stack(
                      children: [
                        Container(
                          width: 80,
                          height: 80,
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.25),
                            shape: BoxShape.circle,
                            border: Border.all(color: Colors.white, width: 3),
                          ),
                          child: Center(
                            child: Text(
                              t['avatar'],
                              style: GoogleFonts.poppins(
                                fontSize: 28,
                                fontWeight: FontWeight.w800,
                                color: Colors.white,
                              ),
                            ),
                          ),
                        ),
                        if (t['verified'] == true)
                          Positioned(
                            right: 2,
                            bottom: 2,
                            child: Container(
                              width: 24,
                              height: 24,
                              decoration: const BoxDecoration(color: _success, shape: BoxShape.circle),
                              child: const Icon(Icons.check, size: 14, color: Colors.white),
                            ),
                          ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),

          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Name & rating header
                  Center(
                    child: Column(
                      children: [
                        const SizedBox(height: 8),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              t['name'],
                              style: GoogleFonts.poppins(
                                fontSize: 22,
                                fontWeight: FontWeight.w800,
                                color: _textPrimary,
                              ),
                            ),
                            if (t['verified'] == true) ...[
                              const SizedBox(width: 8),
                              const Icon(Icons.verified, color: _success, size: 20),
                            ],
                          ],
                        ),
                        const SizedBox(height: 4),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            _buildStars(rating),
                            const SizedBox(width: 6),
                            Text(
                              '$rating rating',
                              style: GoogleFonts.poppins(fontSize: 14, color: _textSecondary),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(_vehicleIcon(t['vehicleType']), size: 18, color: _primary),
                            const SizedBox(width: 6),
                            Text(
                              t['vehicleType'],
                              style: GoogleFonts.poppins(
                                fontSize: 15,
                                fontWeight: FontWeight.w600,
                                color: _primary,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),

                  // Stats row
                  Container(
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [
                        BoxShadow(color: Colors.black.withOpacity(0.06), blurRadius: 8, offset: const Offset(0, 2)),
                      ],
                    ),
                    child: Row(
                      children: [
                        _buildStatItem('${t['totalTrips']}', 'Total Trips', Icons.local_shipping),
                        _vertDivider(),
                        _buildStatItem('$rating', 'Rating', Icons.star),
                        _vertDivider(),
                        _buildStatItem('2022', 'Member Since', Icons.calendar_today),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Route card
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [
                        BoxShadow(color: Colors.black.withOpacity(0.06), blurRadius: 8, offset: const Offset(0, 2)),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Trip Details',
                          style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w700, color: _textPrimary),
                        ),
                        const SizedBox(height: 14),
                        Row(
                          children: [
                            Expanded(
                              child: Column(
                                children: [
                                  const Icon(Icons.radio_button_on, color: _success, size: 20),
                                  const SizedBox(height: 4),
                                  Text(t['from'], style: GoogleFonts.poppins(fontSize: 15, fontWeight: FontWeight.w700, color: _textPrimary)),
                                  Text('From', style: GoogleFonts.poppins(fontSize: 11, color: _textSecondary)),
                                ],
                              ),
                            ),
                            Column(
                              children: [
                                const Icon(Icons.arrow_forward, color: _textSecondary, size: 24),
                                Text(t['date'], style: GoogleFonts.poppins(fontSize: 11, color: _textSecondary)),
                              ],
                            ),
                            Expanded(
                              child: Column(
                                children: [
                                  const Icon(Icons.location_on, color: _secondary, size: 20),
                                  const SizedBox(height: 4),
                                  Text(t['to'], style: GoogleFonts.poppins(fontSize: 15, fontWeight: FontWeight.w700, color: _textPrimary)),
                                  Text('To', style: GoogleFonts.poppins(fontSize: 11, color: _textSecondary)),
                                ],
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 14),
                        const Divider(color: Color(0xFFE5E7EB)),
                        const SizedBox(height: 10),
                        Row(
                          children: [
                            Expanded(
                              child: _routeInfo(Icons.scale, 'Available Weight', '${t['availableWeight']} kg'),
                            ),
                            Expanded(
                              child: _routeInfo(Icons.currency_rupee, 'Price per kg', '₹${t['pricePerKg']}'),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Reviews section
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [
                        BoxShadow(color: Colors.black.withOpacity(0.06), blurRadius: 8, offset: const Offset(0, 2)),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Reviews', style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w700, color: _textPrimary)),
                        const SizedBox(height: 12),
                        ..._mockReviews.map((r) => _buildReviewCard(r)),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Book button
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () => _showBookingSheet(context, t),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: _primary,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                        elevation: 0,
                      ),
                      child: Text(
                        'Book This Traveler',
                        style: GoogleFonts.poppins(fontSize: 17, fontWeight: FontWeight.w700),
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatItem(String value, String label, IconData icon) {
    return Expanded(
      child: Column(
        children: [
          Icon(icon, color: _primary, size: 22),
          const SizedBox(height: 6),
          Text(value, style: GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.w800, color: _textPrimary)),
          Text(label, style: GoogleFonts.poppins(fontSize: 11, color: _textSecondary)),
        ],
      ),
    );
  }

  Widget _vertDivider() {
    return Container(width: 1, height: 50, color: const Color(0xFFE5E7EB));
  }

  Widget _routeInfo(IconData icon, String label, String value) {
    return Row(
      children: [
        Icon(icon, size: 16, color: _primary),
        const SizedBox(width: 6),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(label, style: GoogleFonts.poppins(fontSize: 11, color: _textSecondary)),
            Text(value, style: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.w700, color: _textPrimary)),
          ],
        ),
      ],
    );
  }

  Widget _buildReviewCard(Map r) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 36,
                height: 36,
                decoration: BoxDecoration(
                  color: _primary.withOpacity(0.1),
                  shape: BoxShape.circle,
                ),
                child: Center(
                  child: Text(
                    (r['name'] as String)[0],
                    style: GoogleFonts.poppins(fontWeight: FontWeight.w700, color: _primary),
                  ),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(r['name'], style: GoogleFonts.poppins(fontSize: 13, fontWeight: FontWeight.w700, color: _textPrimary)),
                    Row(children: List.generate(r['rating'] as int, (_) => const Icon(Icons.star, size: 13, color: _warning))),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          Text(
            r['review'],
            style: GoogleFonts.poppins(fontSize: 13, color: _textSecondary, height: 1.5),
          ),
          if (r != _mockReviews.last) const Divider(color: Color(0xFFE5E7EB), height: 20),
        ],
      ),
    );
  }
}
