import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

class RequestDetailsScreen extends StatefulWidget {
  final Map<String, dynamic>? request;
  const RequestDetailsScreen({super.key, this.request});

  @override
  State<RequestDetailsScreen> createState() => _RequestDetailsScreenState();
}

class _RequestDetailsScreenState extends State<RequestDetailsScreen> {
  static const Map<String, dynamic> _fallbackRequest = {
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
  };

  Map<String, dynamic> get _request => widget.request ?? _fallbackRequest;

  void _showAcceptBottomSheet() {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) {
        return Padding(
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
              Container(
                width: 60,
                height: 60,
                decoration: BoxDecoration(
                  color: const Color(0xFF10B981).withOpacity(0.1),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.check_circle, color: Color(0xFF10B981), size: 32),
              ),
              const SizedBox(height: 16),
              Text(
                'Confirm Acceptance',
                style: GoogleFonts.poppins(
                  fontSize: 18,
                  fontWeight: FontWeight.w700,
                  color: const Color(0xFF1A1A2E),
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'You\'re about to accept a delivery request from ${_request['sender']}. You\'ll be responsible for picking up and delivering the parcel.',
                style: GoogleFonts.poppins(fontSize: 13, color: const Color(0xFF6B7280)),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 20),
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: const Color(0xFFF3F4F6),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Your Earnings',
                      style: GoogleFonts.poppins(fontSize: 14, color: const Color(0xFF6B7280)),
                    ),
                    Text(
                      '₹${(_request['price'] * 0.8).toInt()}',
                      style: GoogleFonts.poppins(
                        fontSize: 18,
                        fontWeight: FontWeight.w700,
                        color: const Color(0xFF10B981),
                      ),
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
                        foregroundColor: const Color(0xFF6B7280),
                        side: const BorderSide(color: Color(0xFFE5E7EB)),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        padding: const EdgeInsets.symmetric(vertical: 14),
                      ),
                      child: Text('Cancel', style: GoogleFonts.poppins(fontWeight: FontWeight.w500)),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () {
                        Navigator.pop(ctx);
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text('Request accepted! 🎉', style: GoogleFonts.poppins()),
                            backgroundColor: const Color(0xFF10B981),
                          ),
                        );
                        Future.delayed(const Duration(milliseconds: 400), () {
                          if (mounted) context.go('/traveler/my-trips');
                        });
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF10B981),
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        elevation: 0,
                      ),
                      child: Text('Confirm', style: GoogleFonts.poppins(fontWeight: FontWeight.w600)),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final req = _request;
    final int price = req['price'] as int;
    final int platformFee = (price * 0.2).ceil();
    final int earnings = price - platformFee;
    final double rating = (req['senderRating'] as num).toDouble();
    final String initials = (req['sender'] as String).split(' ').map((e) => e[0]).take(2).join();

    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FE),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: Color(0xFF1A1A2E)),
          onPressed: () => context.pop(),
        ),
        title: Text(
          'Request #${req['id']}',
          style: GoogleFonts.poppins(
            fontSize: 18,
            fontWeight: FontWeight.w600,
            color: const Color(0xFF1A1A2E),
          ),
        ),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            // Sender info card
            _buildCard(
              child: Row(
                children: [
                  CircleAvatar(
                    radius: 28,
                    backgroundColor: const Color(0xFF6C63FF).withOpacity(0.15),
                    child: Text(
                      initials,
                      style: GoogleFonts.poppins(
                        fontSize: 18,
                        fontWeight: FontWeight.w700,
                        color: const Color(0xFF6C63FF),
                      ),
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          req['sender'],
                          style: GoogleFonts.poppins(
                            fontSize: 16,
                            fontWeight: FontWeight.w700,
                            color: const Color(0xFF1A1A2E),
                          ),
                        ),
                        const SizedBox(height: 2),
                        Row(
                          children: List.generate(5, (i) {
                            return Icon(
                              i < rating.floor() ? Icons.star : (i < rating ? Icons.star_half : Icons.star_border),
                              size: 14,
                              color: const Color(0xFFF59E0B),
                            );
                          })
                            ..add(const SizedBox(width: 4))
                            ..add(Text(
                              '$rating',
                              style: GoogleFonts.poppins(fontSize: 12, color: const Color(0xFF6B7280)),
                            )),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          'Member since Jan 2024',
                          style: GoogleFonts.poppins(fontSize: 12, color: const Color(0xFF9CA3AF)),
                        ),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: const Color(0xFF10B981).withOpacity(0.1),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.verified, size: 14, color: Color(0xFF10B981)),
                        const SizedBox(width: 3),
                        Text(
                          'Verified',
                          style: GoogleFonts.poppins(fontSize: 11, color: const Color(0xFF10B981), fontWeight: FontWeight.w500),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 14),

            // Parcel info card
            _buildCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Parcel Details',
                    style: GoogleFonts.poppins(
                      fontSize: 15,
                      fontWeight: FontWeight.w600,
                      color: const Color(0xFF1A1A2E),
                    ),
                  ),
                  const SizedBox(height: 14),
                  Row(
                    children: [
                      _buildInfoChip(Icons.category_outlined, req['category']),
                      const SizedBox(width: 10),
                      _buildInfoChip(Icons.scale, '${req['weight']} kg'),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Text(
                    'Description',
                    style: GoogleFonts.poppins(fontSize: 12, color: const Color(0xFF9CA3AF)),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    req['desc'],
                    style: GoogleFonts.poppins(fontSize: 14, color: const Color(0xFF1A1A2E)),
                  ),
                  const SizedBox(height: 14),
                  const Divider(color: Color(0xFFF3F4F6)),
                  const SizedBox(height: 10),
                  _buildAddressRow(Icons.location_on, 'Pickup Address', req['pickup'], const Color(0xFF6C63FF)),
                  const SizedBox(height: 10),
                  _buildDottedLine(),
                  const SizedBox(height: 10),
                  _buildAddressRow(Icons.flag, 'Delivery Address', req['dropoff'], const Color(0xFFFF6584)),
                ],
              ),
            ),
            const SizedBox(height: 14),

            // Price breakdown
            _buildCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Price Breakdown',
                    style: GoogleFonts.poppins(fontSize: 15, fontWeight: FontWeight.w600, color: const Color(0xFF1A1A2E)),
                  ),
                  const SizedBox(height: 14),
                  _buildPriceRow('Base Price', '₹$price', const Color(0xFF1A1A2E)),
                  const SizedBox(height: 8),
                  _buildPriceRow('Platform Fee (20%)', '-₹$platformFee', const Color(0xFFEF4444)),
                  const SizedBox(height: 10),
                  const Divider(color: Color(0xFFF3F4F6)),
                  const SizedBox(height: 10),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Your Earnings',
                        style: GoogleFonts.poppins(fontSize: 15, fontWeight: FontWeight.w600, color: const Color(0xFF1A1A2E)),
                      ),
                      Text(
                        '₹$earnings',
                        style: GoogleFonts.poppins(fontSize: 20, fontWeight: FontWeight.w700, color: const Color(0xFF10B981)),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
      bottomNavigationBar: Container(
        padding: const EdgeInsets.fromLTRB(16, 12, 16, 24),
        decoration: const BoxDecoration(
          color: Colors.white,
          boxShadow: [BoxShadow(color: Color(0x0A000000), blurRadius: 10, offset: Offset(0, -4))],
        ),
        child: Row(
          children: [
            Expanded(
              child: OutlinedButton(
                onPressed: () => context.pop(),
                style: OutlinedButton.styleFrom(
                  foregroundColor: const Color(0xFFEF4444),
                  side: const BorderSide(color: Color(0xFFEF4444)),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  padding: const EdgeInsets.symmetric(vertical: 14),
                ),
                child: Text('Decline', style: GoogleFonts.poppins(fontWeight: FontWeight.w600, fontSize: 15)),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              flex: 2,
              child: ElevatedButton(
                onPressed: _showAcceptBottomSheet,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF10B981),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  elevation: 0,
                ),
                child: Text('Accept Request', style: GoogleFonts.poppins(fontWeight: FontWeight.w600, fontSize: 15)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCard({required Widget child}) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: child,
    );
  }

  Widget _buildInfoChip(IconData icon, String label) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: const Color(0xFF6C63FF).withOpacity(0.08),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: const Color(0xFF6C63FF)),
          const SizedBox(width: 5),
          Text(
            label,
            style: GoogleFonts.poppins(fontSize: 13, color: const Color(0xFF6C63FF), fontWeight: FontWeight.w500),
          ),
        ],
      ),
    );
  }

  Widget _buildAddressRow(IconData icon, String label, String address, Color color) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: 32,
          height: 32,
          decoration: BoxDecoration(color: color.withOpacity(0.1), shape: BoxShape.circle),
          child: Icon(icon, size: 16, color: color),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(label, style: GoogleFonts.poppins(fontSize: 11, color: const Color(0xFF9CA3AF))),
              const SizedBox(height: 2),
              Text(address, style: GoogleFonts.poppins(fontSize: 13, color: const Color(0xFF1A1A2E), fontWeight: FontWeight.w500)),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildDottedLine() {
    return Padding(
      padding: const EdgeInsets.only(left: 15),
      child: Column(
        children: List.generate(
          3,
          (i) => Container(
            width: 2,
            height: 4,
            margin: const EdgeInsets.only(bottom: 3),
            color: const Color(0xFFE5E7EB),
          ),
        ),
      ),
    );
  }

  Widget _buildPriceRow(String label, String value, Color valueColor) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: GoogleFonts.poppins(fontSize: 13, color: const Color(0xFF6B7280))),
        Text(
          value,
          style: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.w600, color: valueColor),
        ),
      ],
    );
  }
}
