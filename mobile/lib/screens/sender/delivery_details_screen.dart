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

class DeliveryDetailsScreen extends StatelessWidget {
  final dynamic delivery;
  const DeliveryDetailsScreen({super.key, this.delivery});

  static const _defaultDelivery = {
    'id': 'd1',
    'from': 'Mumbai',
    'to': 'Pune',
    'status': 'in_transit',
    'traveler': 'Rahul Sharma',
    'phone': '9876543210',
    'weight': '2.5 kg',
    'desc': 'Electronics',
    'price': 125,
    'date': 'Dec 15, 2024',
    'eta': 'Dec 15, 2024 6 PM',
    'pickup': 'Andheri West, Mumbai',
    'dropoff': 'Kothrud, Pune',
  };

  Map<String, dynamic> get _d {
    if (delivery != null && delivery is Map) {
      return Map<String, dynamic>.from(delivery);
    }
    return Map<String, dynamic>.from(_defaultDelivery);
  }

  Color _statusColor(String s) {
    switch (s) {
      case 'in_transit': return _primary;
      case 'delivered': return _success;
      case 'pending': return _warning;
      default: return _textSecondary;
    }
  }

  @override
  Widget build(BuildContext context) {
    final d = _d;
    final status = d['status'] as String? ?? 'pending';
    final statusColor = _statusColor(status);

    // Timeline steps
    final steps = [
      {'label': 'Order Placed', 'done': true, 'icon': Icons.receipt_long},
      {'label': 'Traveler Assigned', 'done': status != 'pending', 'icon': Icons.person_pin},
      {'label': 'Picked Up', 'done': status == 'in_transit' || status == 'delivered', 'icon': Icons.inventory},
      {'label': 'In Transit', 'done': status == 'delivered', 'current': status == 'in_transit', 'icon': Icons.local_shipping},
      {'label': 'Delivered', 'done': status == 'delivered', 'icon': Icons.check_circle},
    ];

    return Scaffold(
      backgroundColor: _background,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: _textPrimary),
          onPressed: () => context.go('/sender/my-deliveries'),
        ),
        title: Text(
          'Delivery Details',
          style: GoogleFonts.poppins(fontSize: 20, fontWeight: FontWeight.w700, color: _textPrimary),
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 12),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: statusColor.withOpacity(0.12),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Text(
                status == 'in_transit' ? 'In Transit' : status == 'delivered' ? 'Delivered' : 'Pending',
                style: GoogleFonts.poppins(fontSize: 12, fontWeight: FontWeight.w700, color: statusColor),
              ),
            ),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Order ID header
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [statusColor, statusColor.withOpacity(0.7)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Row(
                children: [
                  const Icon(Icons.receipt, color: Colors.white, size: 32),
                  const SizedBox(width: 14),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Order #${(d['id'] as String).toUpperCase()}',
                        style: GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.w800, color: Colors.white),
                      ),
                      Text(
                        '${d['from']} → ${d['to']}',
                        style: GoogleFonts.poppins(fontSize: 14, color: Colors.white.withOpacity(0.9)),
                      ),
                    ],
                  ),
                  const Spacer(),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text(
                        '₹${d['price']}',
                        style: GoogleFonts.poppins(fontSize: 22, fontWeight: FontWeight.w800, color: Colors.white),
                      ),
                      Text('Total', style: GoogleFonts.poppins(fontSize: 11, color: Colors.white.withOpacity(0.8))),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Status Timeline
            _buildCard(
              title: 'Tracking Timeline',
              icon: Icons.timeline,
              child: Column(
                children: List.generate(steps.length, (i) {
                  final step = steps[i];
                  final isDone = step['done'] as bool? ?? false;
                  final isCurrent = step['current'] as bool? ?? false;
                  final isLast = i == steps.length - 1;
                  final dotColor = isDone ? _success : isCurrent ? _primary : const Color(0xFFE5E7EB);

                  return Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Column(
                        children: [
                          AnimatedContainer(
                            duration: const Duration(milliseconds: 300),
                            width: 36,
                            height: 36,
                            decoration: BoxDecoration(
                              color: dotColor,
                              shape: BoxShape.circle,
                              boxShadow: isCurrent
                                  ? [BoxShadow(color: _primary.withOpacity(0.4), blurRadius: 10, spreadRadius: 2)]
                                  : [],
                            ),
                            child: Center(
                              child: isDone
                                  ? const Icon(Icons.check, color: Colors.white, size: 18)
                                  : isCurrent
                                      ? const Icon(Icons.local_shipping, color: Colors.white, size: 18)
                                      : Icon(step['icon'] as IconData, color: _textSecondary, size: 18),
                            ),
                          ),
                          if (!isLast)
                            Container(
                              width: 2,
                              height: 36,
                              color: isDone ? _success.withOpacity(0.4) : const Color(0xFFE5E7EB),
                            ),
                        ],
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Padding(
                          padding: const EdgeInsets.only(top: 6, bottom: 20),
                          child: Row(
                            children: [
                              Text(
                                step['label'] as String,
                                style: GoogleFonts.poppins(
                                  fontSize: 14,
                                  fontWeight: isCurrent ? FontWeight.w700 : FontWeight.w500,
                                  color: isDone ? _textPrimary : isCurrent ? _primary : _textSecondary,
                                ),
                              ),
                              if (isCurrent) ...[
                                const SizedBox(width: 8),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                  decoration: BoxDecoration(
                                    color: _primary.withOpacity(0.1),
                                    borderRadius: BorderRadius.circular(10),
                                  ),
                                  child: Text(
                                    'Current',
                                    style: GoogleFonts.poppins(fontSize: 10, fontWeight: FontWeight.w700, color: _primary),
                                  ),
                                ),
                              ],
                            ],
                          ),
                        ),
                      ),
                    ],
                  );
                }),
              ),
            ),
            const SizedBox(height: 16),

            // Parcel info
            _buildCard(
              title: 'Parcel Information',
              icon: Icons.inventory_2_outlined,
              child: Column(
                children: [
                  _infoRow('Description', d['desc'] as String? ?? 'N/A'),
                  const SizedBox(height: 10),
                  _infoRow('Weight', d['weight'] as String? ?? 'N/A'),
                  const SizedBox(height: 10),
                  _infoRow('Pickup', d['pickup'] as String? ?? '${d['from']}, India'),
                  const SizedBox(height: 10),
                  _infoRow('Drop-off', d['dropoff'] as String? ?? '${d['to']}, India'),
                  const SizedBox(height: 10),
                  _infoRow('Scheduled Date', d['date'] as String? ?? 'N/A'),
                  const SizedBox(height: 10),
                  _infoRow('ETA', d['eta'] as String? ?? 'N/A'),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Traveler info
            _buildCard(
              title: 'Traveler Information',
              icon: Icons.person_outline,
              child: Row(
                children: [
                  Container(
                    width: 54,
                    height: 54,
                    decoration: const BoxDecoration(color: _primary, shape: BoxShape.circle),
                    child: Center(
                      child: Text(
                        (d['traveler'] as String? ?? 'T').substring(0, 1).toUpperCase() +
                            ((d['traveler'] as String? ?? 'T').contains(' ')
                                ? (d['traveler'] as String).split(' ')[1].substring(0, 1).toUpperCase()
                                : ''),
                        style: GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.w700, color: Colors.white),
                      ),
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          d['traveler'] as String? ?? 'Not Assigned',
                          style: GoogleFonts.poppins(fontSize: 15, fontWeight: FontWeight.w700, color: _textPrimary),
                        ),
                        Row(
                          children: const [
                            Icon(Icons.star, size: 14, color: Color(0xFFF59E0B)),
                            SizedBox(width: 3),
                            Text('4.8', style: TextStyle(fontSize: 13, color: _textSecondary)),
                            SizedBox(width: 6),
                            Icon(Icons.directions_car, size: 14, color: _textSecondary),
                            SizedBox(width: 3),
                            Text('Car', style: TextStyle(fontSize: 13, color: _textSecondary)),
                          ],
                        ),
                      ],
                    ),
                  ),
                  ElevatedButton.icon(
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text('Calling ${d['traveler']}...'),
                          backgroundColor: _success,
                        ),
                      );
                    },
                    icon: const Icon(Icons.call, size: 16),
                    label: Text('Call', style: GoogleFonts.poppins(fontSize: 13, fontWeight: FontWeight.w700)),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: _success,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      elevation: 0,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Price card
            _buildCard(
              title: 'Price Details',
              icon: Icons.currency_rupee,
              child: Column(
                children: [
                  _priceRow('Base Price', '₹${((d['price'] as num).toDouble() / 1.1).toStringAsFixed(0)}'),
                  const SizedBox(height: 8),
                  _priceRow('Platform Fee (10%)', '₹${((d['price'] as num).toDouble() * 0.1 / 1.1).toStringAsFixed(0)}'),
                  const Padding(padding: EdgeInsets.symmetric(vertical: 8), child: Divider(color: Color(0xFFE5E7EB))),
                  _priceRow('Total', '₹${d['price']}', isTotal: true),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Live Track button
            if (status == 'in_transit')
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: () => context.go('/sender/live-tracking'),
                  icon: const Icon(Icons.location_on, size: 20),
                  label: Text(
                    'Live Track',
                    style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w700),
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: _primary,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    elevation: 0,
                  ),
                ),
              ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  Widget _buildCard({required String title, required IconData icon, required Widget child}) {
    return Container(
      width: double.infinity,
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
          Row(
            children: [
              Icon(icon, color: _primary, size: 20),
              const SizedBox(width: 8),
              Text(title, style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w700, color: _textPrimary)),
            ],
          ),
          const SizedBox(height: 12),
          const Divider(color: Color(0xFFE5E7EB)),
          const SizedBox(height: 10),
          child,
        ],
      ),
    );
  }

  Widget _infoRow(String label, String value) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(
          width: 100,
          child: Text(label, style: GoogleFonts.poppins(fontSize: 13, color: _textSecondary, fontWeight: FontWeight.w500)),
        ),
        const SizedBox(width: 8),
        Expanded(
          child: Text(value, style: GoogleFonts.poppins(fontSize: 13, fontWeight: FontWeight.w700, color: _textPrimary)),
        ),
      ],
    );
  }

  Widget _priceRow(String label, String value, {bool isTotal = false}) {
    return Row(
      children: [
        Expanded(
          child: Text(
            label,
            style: GoogleFonts.poppins(
              fontSize: isTotal ? 15 : 13,
              fontWeight: isTotal ? FontWeight.w700 : FontWeight.w500,
              color: isTotal ? _textPrimary : _textSecondary,
            ),
          ),
        ),
        Text(
          value,
          style: GoogleFonts.poppins(
            fontSize: isTotal ? 18 : 14,
            fontWeight: FontWeight.w700,
            color: isTotal ? _primary : _textPrimary,
          ),
        ),
      ],
    );
  }
}
