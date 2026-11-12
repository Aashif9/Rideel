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

final List<Map<String, dynamic>> _mockDeliveries = [
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
    'eta': 'Dec 15, 2024 6 PM',
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
    'eta': 'Delivered',
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
    'eta': 'Pending',
  },
];

class MyDeliveriesScreen extends StatefulWidget {
  const MyDeliveriesScreen({super.key});

  @override
  State<MyDeliveriesScreen> createState() => _MyDeliveriesScreenState();
}

class _MyDeliveriesScreenState extends State<MyDeliveriesScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  List<Map<String, dynamic>> get _active =>
      _mockDeliveries.where((d) => d['status'] == 'pending' || d['status'] == 'in_transit').toList();

  List<Map<String, dynamic>> get _completed =>
      _mockDeliveries.where((d) => d['status'] == 'delivered').toList();

  Color _statusColor(String s) {
    switch (s) {
      case 'in_transit': return _primary;
      case 'delivered': return _success;
      case 'pending': return _warning;
      default: return _textSecondary;
    }
  }

  String _statusLabel(String s) {
    switch (s) {
      case 'in_transit': return 'In Transit';
      case 'delivered': return 'Delivered';
      case 'pending': return 'Pending';
      default: return s;
    }
  }

  IconData _statusIcon(String s) {
    switch (s) {
      case 'in_transit': return Icons.local_shipping;
      case 'delivered': return Icons.check_circle;
      case 'pending': return Icons.access_time;
      default: return Icons.info;
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
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: _textPrimary),
          onPressed: () => context.go('/sender/dashboard'),
        ),
        title: Text(
          'My Deliveries',
          style: GoogleFonts.poppins(fontSize: 20, fontWeight: FontWeight.w700, color: _textPrimary),
        ),
        bottom: TabBar(
          controller: _tabController,
          labelColor: _primary,
          unselectedLabelColor: _textSecondary,
          indicatorColor: _primary,
          indicatorWeight: 3,
          labelStyle: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.w700),
          unselectedLabelStyle: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.w500),
          tabs: [
            Tab(text: 'Active (${_active.length})'),
            Tab(text: 'Completed (${_completed.length})'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildDeliveryList(_active, isActive: true),
          _buildDeliveryList(_completed, isActive: false),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => context.go('/sender/create-parcel'),
        backgroundColor: _primary,
        child: const Icon(Icons.add, color: Colors.white),
      ),
    );
  }

  Widget _buildDeliveryList(List<Map<String, dynamic>> deliveries, {required bool isActive}) {
    if (deliveries.isEmpty) {
      return _buildEmptyState(isActive);
    }
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: deliveries.length,
      itemBuilder: (ctx, i) => _buildDeliveryCard(deliveries[i]),
    );
  }

  Widget _buildEmptyState(bool isActive) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
              color: _primary.withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(
              isActive ? Icons.local_shipping_outlined : Icons.check_circle_outline,
              size: 40,
              color: _primary,
            ),
          ),
          const SizedBox(height: 20),
          Text(
            isActive ? 'No Active Deliveries' : 'No Completed Deliveries',
            style: GoogleFonts.poppins(
              fontSize: 18,
              fontWeight: FontWeight.w700,
              color: _textPrimary,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            isActive
                ? 'Create a new parcel to get started'
                : 'Your completed deliveries will appear here',
            textAlign: TextAlign.center,
            style: GoogleFonts.poppins(fontSize: 14, color: _textSecondary),
          ),
          if (isActive) ...[
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () => context.go('/sender/create-parcel'),
              style: ElevatedButton.styleFrom(
                backgroundColor: _primary,
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                elevation: 0,
              ),
              child: Text('Send a Parcel', style: GoogleFonts.poppins(fontWeight: FontWeight.w700, color: Colors.white)),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildDeliveryCard(Map<String, dynamic> d) {
    final statusColor = _statusColor(d['status']);
    final statusLabel = _statusLabel(d['status']);
    final statusIcon = _statusIcon(d['status']);

    return Container(
      margin: const EdgeInsets.only(bottom: 14),
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
        children: [
          // Top header
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: statusColor.withOpacity(0.07),
              borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
            ),
            child: Row(
              children: [
                Icon(statusIcon, size: 16, color: statusColor),
                const SizedBox(width: 6),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                  decoration: BoxDecoration(
                    color: statusColor.withOpacity(0.15),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    statusLabel,
                    style: GoogleFonts.poppins(fontSize: 11, fontWeight: FontWeight.w700, color: statusColor),
                  ),
                ),
                const Spacer(),
                Text(
                  'Order #${d['id'].toString().toUpperCase()}',
                  style: GoogleFonts.poppins(fontSize: 12, fontWeight: FontWeight.w700, color: _textSecondary),
                ),
              ],
            ),
          ),

          // Body
          Padding(
            padding: const EdgeInsets.all(14),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Route
                Row(
                  children: [
                    Expanded(
                      child: Row(
                        children: [
                          Text(
                            d['from'],
                            style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w800, color: _textPrimary),
                          ),
                          const Padding(
                            padding: EdgeInsets.symmetric(horizontal: 8),
                            child: Icon(Icons.arrow_forward, size: 18, color: _textSecondary),
                          ),
                          Text(
                            d['to'],
                            style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w800, color: _textPrimary),
                          ),
                        ],
                      ),
                    ),
                    Text(
                      '₹${d['price']}',
                      style: GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.w800, color: _primary),
                    ),
                  ],
                ),
                const SizedBox(height: 8),

                // Details
                Row(
                  children: [
                    const Icon(Icons.inventory_2_outlined, size: 14, color: _textSecondary),
                    const SizedBox(width: 4),
                    Text('${d['desc']} • ${d['weight']}', style: GoogleFonts.poppins(fontSize: 12, color: _textSecondary)),
                    const Spacer(),
                    const Icon(Icons.calendar_today, size: 13, color: _textSecondary),
                    const SizedBox(width: 4),
                    Text(d['date'], style: GoogleFonts.poppins(fontSize: 12, color: _textSecondary)),
                  ],
                ),
                const SizedBox(height: 6),
                Row(
                  children: [
                    const Icon(Icons.person_outline, size: 14, color: _textSecondary),
                    const SizedBox(width: 4),
                    Text(
                      d['traveler'],
                      style: GoogleFonts.poppins(fontSize: 13, fontWeight: FontWeight.w600, color: _textPrimary),
                    ),
                    const Spacer(),
                    if (d['status'] != 'delivered')
                      TextButton.icon(
                        onPressed: () => context.go('/sender/live-tracking'),
                        icon: const Icon(Icons.location_on, size: 14),
                        label: Text('Track', style: GoogleFonts.poppins(fontSize: 13, fontWeight: FontWeight.w700)),
                        style: TextButton.styleFrom(
                          foregroundColor: _primary,
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                          tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                        ),
                      )
                    else
                      TextButton.icon(
                        onPressed: () => context.go('/sender/delivery-details', extra: d),
                        icon: const Icon(Icons.info_outline, size: 14),
                        label: Text('Details', style: GoogleFonts.poppins(fontSize: 13, fontWeight: FontWeight.w700)),
                        style: TextButton.styleFrom(
                          foregroundColor: _success,
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                          tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                        ),
                      ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
