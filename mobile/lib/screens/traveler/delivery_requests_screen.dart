import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

final List<Map<String, dynamic>> _deliveryMockRequests = [
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

class DeliveryRequestsScreen extends StatefulWidget {
  const DeliveryRequestsScreen({super.key});

  @override
  State<DeliveryRequestsScreen> createState() => _DeliveryRequestsScreenState();
}

class _DeliveryRequestsScreenState extends State<DeliveryRequestsScreen> {
  String _selectedFilter = 'All';
  final Set<String> _rejectedIds = {};
  final List<String> _filters = ['All', 'Documents', 'Electronics', 'Clothing', 'Medicine', 'Other'];

  List<Map<String, dynamic>> get _filteredRequests {
    return _deliveryMockRequests.where((r) {
      if (_rejectedIds.contains(r['id'])) return false;
      if (_selectedFilter == 'All') return true;
      return r['category'] == _selectedFilter;
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
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
          'Delivery Requests',
          style: GoogleFonts.poppins(
            fontSize: 18,
            fontWeight: FontWeight.w600,
            color: const Color(0xFF1A1A2E),
          ),
        ),
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.filter_list, color: Color(0xFF6C63FF)),
            onPressed: () {},
          ),
        ],
      ),
      body: Column(
        children: [
          Container(
            color: Colors.white,
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
              child: Row(
                children: _filters.map((f) {
                  final isSelected = _selectedFilter == f;
                  return GestureDetector(
                    onTap: () => setState(() => _selectedFilter = f),
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 200),
                      margin: const EdgeInsets.only(right: 8),
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      decoration: BoxDecoration(
                        color: isSelected ? const Color(0xFF6C63FF) : const Color(0xFFF3F4F6),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        f,
                        style: GoogleFonts.poppins(
                          fontSize: 13,
                          fontWeight: FontWeight.w500,
                          color: isSelected ? Colors.white : const Color(0xFF6B7280),
                        ),
                      ),
                    ),
                  );
                }).toList(),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: BoxDecoration(
                color: const Color(0xFF6C63FF).withOpacity(0.08),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0xFF6C63FF).withOpacity(0.2)),
              ),
              child: Row(
                children: [
                  const Icon(Icons.route, color: Color(0xFF6C63FF), size: 18),
                  const SizedBox(width: 8),
                  Text(
                    'Your trip: ',
                    style: GoogleFonts.poppins(fontSize: 13, color: const Color(0xFF6B7280)),
                  ),
                  Text(
                    'Mumbai → Pune',
                    style: GoogleFonts.poppins(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: const Color(0xFF6C63FF),
                    ),
                  ),
                  const Spacer(),
                  Text(
                    'Dec 15',
                    style: GoogleFonts.poppins(fontSize: 12, color: const Color(0xFF6B7280)),
                  ),
                ],
              ),
            ),
          ),
          Expanded(
            child: _filteredRequests.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.inbox_outlined, size: 64, color: const Color(0xFF9CA3AF)),
                        const SizedBox(height: 12),
                        Text(
                          'No requests found',
                          style: GoogleFonts.poppins(
                            fontSize: 16,
                            color: const Color(0xFF6B7280),
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        Text(
                          'Try a different filter',
                          style: GoogleFonts.poppins(fontSize: 13, color: const Color(0xFF9CA3AF)),
                        ),
                      ],
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                    itemCount: _filteredRequests.length,
                    itemBuilder: (context, index) {
                      final req = _filteredRequests[index];
                      return _buildRequestCard(context, req);
                    },
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildRequestCard(BuildContext context, Map<String, dynamic> req) {
    final initials = (req['sender'] as String).split(' ').map((e) => e[0]).take(2).join();
    final rating = req['senderRating'] as double;

    return Dismissible(
      key: Key(req['id']),
      direction: DismissDirection.endToStart,
      background: Container(
        alignment: Alignment.centerRight,
        padding: const EdgeInsets.only(right: 20),
        margin: const EdgeInsets.only(bottom: 12),
        decoration: BoxDecoration(
          color: const Color(0xFFEF4444).withOpacity(0.1),
          borderRadius: BorderRadius.circular(16),
        ),
        child: const Icon(Icons.close, color: Color(0xFFEF4444)),
      ),
      onDismissed: (_) => setState(() => _rejectedIds.add(req['id'])),
      child: Container(
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
              children: [
                CircleAvatar(
                  radius: 20,
                  backgroundColor: const Color(0xFF6C63FF).withOpacity(0.15),
                  child: Text(
                    initials,
                    style: GoogleFonts.poppins(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: const Color(0xFF6C63FF),
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        req['sender'],
                        style: GoogleFonts.poppins(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          color: const Color(0xFF1A1A2E),
                        ),
                      ),
                      Row(
                        children: [
                          const Icon(Icons.star, size: 13, color: Color(0xFFF59E0B)),
                          const SizedBox(width: 2),
                          Text(
                            '$rating',
                            style: GoogleFonts.poppins(fontSize: 12, color: const Color(0xFF6B7280)),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                Text(
                  '₹${req['price']}',
                  style: GoogleFonts.poppins(
                    fontSize: 18,
                    fontWeight: FontWeight.w700,
                    color: const Color(0xFF10B981),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),
            const Divider(color: Color(0xFFF3F4F6)),
            const SizedBox(height: 8),
            Row(
              children: [
                const Icon(Icons.location_on_outlined, size: 14, color: Color(0xFF6B7280)),
                const SizedBox(width: 4),
                Expanded(
                  child: Text(
                    req['pickup'],
                    style: GoogleFonts.poppins(fontSize: 12, color: const Color(0xFF6B7280)),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 4),
            Row(
              children: [
                const Icon(Icons.flag_outlined, size: 14, color: Color(0xFFFF6584)),
                const SizedBox(width: 4),
                Expanded(
                  child: Text(
                    req['dropoff'],
                    style: GoogleFonts.poppins(fontSize: 12, color: const Color(0xFF6B7280)),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: _categoryColor(req['category']).withOpacity(0.1),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    req['category'],
                    style: GoogleFonts.poppins(
                      fontSize: 11,
                      fontWeight: FontWeight.w500,
                      color: _categoryColor(req['category']),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                Icon(Icons.scale, size: 13, color: const Color(0xFF6B7280)),
                const SizedBox(width: 3),
                Text(
                  '${req['weight']} kg',
                  style: GoogleFonts.poppins(fontSize: 12, color: const Color(0xFF6B7280)),
                ),
                const Spacer(),
                ElevatedButton(
                  onPressed: () => context.push('/traveler/request-details', extra: req),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF6C63FF),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    elevation: 0,
                    minimumSize: Size.zero,
                    tapTargetSize: MaterialTapTargetSize.shrinkWrap,
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
      ),
    );
  }

  Color _categoryColor(String category) {
    switch (category) {
      case 'Electronics': return const Color(0xFF6C63FF);
      case 'Documents': return const Color(0xFF3B82F6);
      case 'Clothing': return const Color(0xFFFF6584);
      case 'Medicine': return const Color(0xFF10B981);
      default: return const Color(0xFFF59E0B);
    }
  }
}
