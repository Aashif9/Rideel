import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

class TripDetailsScreen extends StatefulWidget {
  final Map<String, dynamic>? trip;
  const TripDetailsScreen({super.key, this.trip});

  @override
  State<TripDetailsScreen> createState() => _TripDetailsScreenState();
}

class _TripDetailsScreenState extends State<TripDetailsScreen> {
  static const Map<String, dynamic> _fallbackTrip = {
    'id': 'trip1',
    'from': 'Mumbai',
    'to': 'Pune',
    'date': 'Dec 15, 2024',
    'status': 'active',
    'availableWeight': 7.5,
    'pricePerKg': 50,
    'acceptedCount': 2,
    'earnings': 200,
  };

  late Map<String, dynamic> _trip;

  static const List<Map<String, dynamic>> _acceptedParcels = [
    {
      'desc': 'Electronics (Laptop)',
      'weight': 2.5,
      'pickup': 'Andheri West, Mumbai',
      'price': 125,
      'sender': 'Aashi Gupta',
    },
    {
      'desc': 'Documents',
      'weight': 0.5,
      'pickup': 'Bandra, Mumbai',
      'price': 75,
      'sender': 'Ravi Verma',
    },
  ];

  @override
  void initState() {
    super.initState();
    _trip = Map<String, dynamic>.from(widget.trip ?? _fallbackTrip);
  }

  void _markCompleted() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Text(
          'Mark as Completed?',
          style: GoogleFonts.poppins(fontWeight: FontWeight.w600, fontSize: 17),
        ),
        content: Text(
          'This will mark the trip as completed and finalize your earnings.',
          style: GoogleFonts.poppins(fontSize: 13, color: const Color(0xFF6B7280)),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: Text('Cancel', style: GoogleFonts.poppins(color: const Color(0xFF6B7280))),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(ctx);
              setState(() => _trip = {..._trip, 'status': 'completed'});
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('Trip marked as completed! 🎉', style: GoogleFonts.poppins()),
                  backgroundColor: const Color(0xFF10B981),
                ),
              );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF10B981),
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              elevation: 0,
            ),
            child: Text('Confirm', style: GoogleFonts.poppins(fontWeight: FontWeight.w600)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isActive = _trip['status'] == 'active';
    final int earnings = (_trip['earnings'] as num).toInt();
    final int platformFee = (earnings * 0.2).ceil();
    final int netEarnings = earnings - platformFee;

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
          'Trip Details',
          style: GoogleFonts.poppins(
            fontSize: 18,
            fontWeight: FontWeight.w600,
            color: const Color(0xFF1A1A2E),
          ),
        ),
        centerTitle: true,
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 12),
            child: Center(
              child: Text(
                '#${_trip['id']}',
                style: GoogleFonts.poppins(fontSize: 12, color: const Color(0xFF6B7280)),
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
            // Route card
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: isActive
                      ? [const Color(0xFF6C63FF), const Color(0xFF3F37C9)]
                      : [const Color(0xFF6B7280), const Color(0xFF374151)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xFF6C63FF).withOpacity(isActive ? 0.3 : 0.1),
                    blurRadius: 12,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              _trip['from'],
                              style: GoogleFonts.poppins(
                                fontSize: 28,
                                fontWeight: FontWeight.w700,
                                color: Colors.white,
                              ),
                            ),
                            Text(
                              'Origin',
                              style: GoogleFonts.poppins(
                                fontSize: 11,
                                color: Colors.white.withOpacity(0.7),
                              ),
                            ),
                          ],
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.2),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.arrow_forward, color: Colors.white, size: 20),
                      ),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            Text(
                              _trip['to'],
                              style: GoogleFonts.poppins(
                                fontSize: 28,
                                fontWeight: FontWeight.w700,
                                color: Colors.white,
                              ),
                            ),
                            Text(
                              'Destination',
                              style: GoogleFonts.poppins(
                                fontSize: 11,
                                color: Colors.white.withOpacity(0.7),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Icon(Icons.calendar_today, size: 14, color: Colors.white.withOpacity(0.8)),
                      const SizedBox(width: 5),
                      Text(
                        _trip['date'],
                        style: GoogleFonts.poppins(fontSize: 12, color: Colors.white.withOpacity(0.8)),
                      ),
                      const SizedBox(width: 16),
                      Icon(Icons.directions_car, size: 14, color: Colors.white.withOpacity(0.8)),
                      const SizedBox(width: 5),
                      Text(
                        'Car',
                        style: GoogleFonts.poppins(fontSize: 12, color: Colors.white.withOpacity(0.8)),
                      ),
                      const Spacer(),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: isActive ? const Color(0xFF10B981) : Colors.white.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          isActive ? 'Active' : 'Completed',
                          style: GoogleFonts.poppins(
                            fontSize: 11,
                            fontWeight: FontWeight.w600,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Stats row
            Container(
              padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 8),
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
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _buildStat('${_trip['availableWeight']} kg', 'Available', Icons.scale, const Color(0xFFF59E0B)),
                  _buildVertDivider(),
                  _buildStat('${_trip['acceptedCount']}', 'Parcels', Icons.inventory_2_outlined, const Color(0xFF6C63FF)),
                  _buildVertDivider(),
                  _buildStat('₹$earnings', 'Earnings', Icons.currency_rupee, const Color(0xFF10B981)),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Accepted parcels
            Text(
              'Accepted Parcels',
              style: GoogleFonts.poppins(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: const Color(0xFF1A1A2E),
              ),
            ),
            const SizedBox(height: 10),
            ..._acceptedParcels.map((p) => _buildParcelCard(p)),
            const SizedBox(height: 16),

            // Status timeline
            Text(
              'Trip Status',
              style: GoogleFonts.poppins(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: const Color(0xFF1A1A2E),
              ),
            ),
            const SizedBox(height: 10),
            _buildTimeline(isActive),
            const SizedBox(height: 16),

            // Earnings card
            Container(
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
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Earnings Breakdown',
                    style: GoogleFonts.poppins(fontSize: 15, fontWeight: FontWeight.w600, color: const Color(0xFF1A1A2E)),
                  ),
                  const SizedBox(height: 14),
                  _buildEarningsRow('Total Collected', '₹$earnings', const Color(0xFF1A1A2E)),
                  const SizedBox(height: 8),
                  _buildEarningsRow('Platform Fee (20%)', '-₹$platformFee', const Color(0xFFEF4444)),
                  const SizedBox(height: 10),
                  const Divider(color: Color(0xFFF3F4F6)),
                  const SizedBox(height: 10),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Net Earnings', style: GoogleFonts.poppins(fontSize: 15, fontWeight: FontWeight.w700, color: const Color(0xFF1A1A2E))),
                      Text('₹$netEarnings', style: GoogleFonts.poppins(fontSize: 22, fontWeight: FontWeight.w700, color: const Color(0xFF10B981))),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Mark as completed button
            if (isActive)
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton.icon(
                  onPressed: _markCompleted,
                  icon: const Icon(Icons.check_circle_outline),
                  label: Text(
                    'Mark as Completed',
                    style: GoogleFonts.poppins(fontSize: 15, fontWeight: FontWeight.w600),
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF10B981),
                    foregroundColor: Colors.white,
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

  Widget _buildStat(String value, String label, IconData icon, Color color) {
    return Column(
      children: [
        Icon(icon, size: 18, color: color),
        const SizedBox(height: 4),
        Text(value, style: GoogleFonts.poppins(fontSize: 15, fontWeight: FontWeight.w700, color: const Color(0xFF1A1A2E))),
        Text(label, style: GoogleFonts.poppins(fontSize: 11, color: const Color(0xFF9CA3AF))),
      ],
    );
  }

  Widget _buildVertDivider() {
    return Container(width: 1, height: 44, color: const Color(0xFFE5E7EB));
  }

  Widget _buildParcelCard(Map<String, dynamic> p) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFFE5E7EB)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: const Color(0xFF6C63FF).withOpacity(0.1),
              borderRadius: BorderRadius.circular(10),
            ),
            child: const Icon(Icons.inventory_2_outlined, color: Color(0xFF6C63FF), size: 20),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  p['desc'],
                  style: GoogleFonts.poppins(fontSize: 13, fontWeight: FontWeight.w600, color: const Color(0xFF1A1A2E)),
                ),
                const SizedBox(height: 2),
                Row(
                  children: [
                    const Icon(Icons.location_on_outlined, size: 12, color: Color(0xFF6B7280)),
                    const SizedBox(width: 3),
                    Expanded(
                      child: Text(
                        p['pickup'],
                        style: GoogleFonts.poppins(fontSize: 11, color: const Color(0xFF6B7280)),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 2),
                Row(
                  children: [
                    Icon(Icons.scale, size: 12, color: const Color(0xFF9CA3AF)),
                    const SizedBox(width: 3),
                    Text('${p['weight']} kg', style: GoogleFonts.poppins(fontSize: 11, color: const Color(0xFF9CA3AF))),
                  ],
                ),
              ],
            ),
          ),
          Text(
            '₹${p['price']}',
            style: GoogleFonts.poppins(fontSize: 15, fontWeight: FontWeight.w700, color: const Color(0xFF10B981)),
          ),
        ],
      ),
    );
  }

  Widget _buildTimeline(bool isActive) {
    final steps = [
      {'label': 'Trip Created', 'done': true, 'current': false},
      {'label': 'Ready for Pickup', 'done': false, 'current': isActive},
      {'label': 'In Transit', 'done': false, 'current': false},
      {'label': 'Completed', 'done': !isActive, 'current': false},
    ];

    return Container(
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
      child: Column(
        children: steps.asMap().entries.map((entry) {
          final i = entry.key;
          final step = entry.value;
          final isDone = step['done'] as bool;
          final isCurrent = step['current'] as bool;
          final isLast = i == steps.length - 1;

          Color dotColor = const Color(0xFFE5E7EB);
          if (isDone) dotColor = const Color(0xFF10B981);
          if (isCurrent) dotColor = const Color(0xFF6C63FF);

          return Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Column(
                children: [
                  Container(
                    width: 28,
                    height: 28,
                    decoration: BoxDecoration(
                      color: dotColor.withOpacity(isDone || isCurrent ? 0.15 : 0.1),
                      shape: BoxShape.circle,
                      border: Border.all(
                        color: dotColor,
                        width: isCurrent ? 2 : 1,
                      ),
                    ),
                    child: Center(
                      child: isDone
                          ? Icon(Icons.check, size: 14, color: dotColor)
                          : isCurrent
                              ? Container(
                                  width: 10,
                                  height: 10,
                                  decoration: BoxDecoration(color: dotColor, shape: BoxShape.circle),
                                )
                              : const SizedBox.shrink(),
                    ),
                  ),
                  if (!isLast)
                    Container(
                      width: 2,
                      height: 28,
                      color: isDone ? const Color(0xFF10B981).withOpacity(0.3) : const Color(0xFFE5E7EB),
                    ),
                ],
              ),
              const SizedBox(width: 12),
              Padding(
                padding: const EdgeInsets.only(top: 4, bottom: 16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      step['label'] as String,
                      style: GoogleFonts.poppins(
                        fontSize: 13,
                        fontWeight: isCurrent ? FontWeight.w600 : FontWeight.w500,
                        color: isCurrent
                            ? const Color(0xFF6C63FF)
                            : isDone
                                ? const Color(0xFF1A1A2E)
                                : const Color(0xFF9CA3AF),
                      ),
                    ),
                    if (isCurrent)
                      Text(
                        'Current status',
                        style: GoogleFonts.poppins(fontSize: 11, color: const Color(0xFF6C63FF).withOpacity(0.7)),
                      ),
                    if (isDone && i == 0)
                      Text(
                        _trip['date'],
                        style: GoogleFonts.poppins(fontSize: 11, color: const Color(0xFF9CA3AF)),
                      ),
                  ],
                ),
              ),
            ],
          );
        }).toList(),
      ),
    );
  }

  Widget _buildEarningsRow(String label, String value, Color valueColor) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: GoogleFonts.poppins(fontSize: 13, color: const Color(0xFF6B7280))),
        Text(value, style: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.w600, color: valueColor)),
      ],
    );
  }
}
