import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

final List<Map<String, dynamic>> _myTripsMock = [
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

class MyTripsScreen extends StatefulWidget {
  const MyTripsScreen({super.key});

  @override
  State<MyTripsScreen> createState() => _MyTripsScreenState();
}

class _MyTripsScreenState extends State<MyTripsScreen> with SingleTickerProviderStateMixin {
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

  List<Map<String, dynamic>> get _activeTrips =>
      _myTripsMock.where((t) => t['status'] == 'active').toList();

  List<Map<String, dynamic>> get _completedTrips =>
      _myTripsMock.where((t) => t['status'] == 'completed').toList();

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
          'My Trips',
          style: GoogleFonts.poppins(
            fontSize: 18,
            fontWeight: FontWeight.w600,
            color: const Color(0xFF1A1A2E),
          ),
        ),
        centerTitle: true,
        bottom: TabBar(
          controller: _tabController,
          labelStyle: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.w600),
          unselectedLabelStyle: GoogleFonts.poppins(fontSize: 14),
          labelColor: const Color(0xFF6C63FF),
          unselectedLabelColor: const Color(0xFF6B7280),
          indicatorColor: const Color(0xFF6C63FF),
          indicatorWeight: 3,
          tabs: [
            Tab(
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text('Active'),
                  const SizedBox(width: 6),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                    decoration: BoxDecoration(
                      color: const Color(0xFF6C63FF),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Text(
                      '${_activeTrips.length}',
                      style: GoogleFonts.poppins(fontSize: 11, color: Colors.white, fontWeight: FontWeight.w600),
                    ),
                  ),
                ],
              ),
            ),
            const Tab(text: 'Completed'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildTripList(_activeTrips),
          _buildTripList(_completedTrips),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => context.push('/traveler/create-trip'),
        backgroundColor: const Color(0xFF6C63FF),
        child: const Icon(Icons.add, color: Colors.white),
      ),
    );
  }

  Widget _buildTripList(List<Map<String, dynamic>> trips) {
    if (trips.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.luggage_outlined,
              size: 72,
              color: const Color(0xFF9CA3AF),
            ),
            const SizedBox(height: 16),
            Text(
              'No trips yet',
              style: GoogleFonts.poppins(
                fontSize: 18,
                fontWeight: FontWeight.w600,
                color: const Color(0xFF6B7280),
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Create a new trip to start earning!',
              style: GoogleFonts.poppins(fontSize: 13, color: const Color(0xFF9CA3AF)),
            ),
            const SizedBox(height: 20),
            ElevatedButton.icon(
              onPressed: () => context.push('/traveler/create-trip'),
              icon: const Icon(Icons.add),
              label: Text('Create Trip', style: GoogleFonts.poppins(fontWeight: FontWeight.w600)),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF6C63FF),
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                elevation: 0,
              ),
            ),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: trips.length,
      itemBuilder: (context, index) => _buildTripCard(context, trips[index]),
    );
  }

  Widget _buildTripCard(BuildContext context, Map<String, dynamic> trip) {
    final isActive = trip['status'] == 'active';

    return Container(
      margin: const EdgeInsets.only(bottom: 14),
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
        children: [
          // Header gradient
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: isActive
                    ? [const Color(0xFF6C63FF), const Color(0xFF3F37C9)]
                    : [const Color(0xFF6B7280), const Color(0xFF4B5563)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
            ),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Text(
                            trip['from'],
                            style: GoogleFonts.poppins(
                              fontSize: 18,
                              fontWeight: FontWeight.w700,
                              color: Colors.white,
                            ),
                          ),
                          const Padding(
                            padding: EdgeInsets.symmetric(horizontal: 8),
                            child: Icon(Icons.arrow_forward, color: Colors.white, size: 16),
                          ),
                          Text(
                            trip['to'],
                            style: GoogleFonts.poppins(
                              fontSize: 18,
                              fontWeight: FontWeight.w700,
                              color: Colors.white,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(
                        trip['date'],
                        style: GoogleFonts.poppins(fontSize: 12, color: Colors.white.withOpacity(0.8)),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                  decoration: BoxDecoration(
                    color: isActive
                        ? const Color(0xFF10B981)
                        : Colors.white.withOpacity(0.2),
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
          ),
          // Body
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    _buildTripStat(
                      '${trip['acceptedCount']}',
                      'Parcels',
                      Icons.inventory_2_outlined,
                      const Color(0xFF6C63FF),
                    ),
                    _buildVerticalDivider(),
                    _buildTripStat(
                      '${trip['availableWeight']} kg',
                      'Available',
                      Icons.scale,
                      const Color(0xFFF59E0B),
                    ),
                    _buildVerticalDivider(),
                    _buildTripStat(
                      '₹${trip['earnings']}',
                      'Earnings',
                      Icons.currency_rupee,
                      const Color(0xFF10B981),
                    ),
                  ],
                ),
                const SizedBox(height: 14),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () => context.push('/traveler/trip-details', extra: trip),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: isActive ? const Color(0xFF6C63FF) : const Color(0xFFF3F4F6),
                      foregroundColor: isActive ? Colors.white : const Color(0xFF6B7280),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      elevation: 0,
                      padding: const EdgeInsets.symmetric(vertical: 12),
                    ),
                    child: Text(
                      'View Details',
                      style: GoogleFonts.poppins(fontWeight: FontWeight.w600, fontSize: 14),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTripStat(String value, String label, IconData icon, Color color) {
    return Column(
      children: [
        Icon(icon, size: 18, color: color),
        const SizedBox(height: 4),
        Text(
          value,
          style: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.w700, color: const Color(0xFF1A1A2E)),
        ),
        Text(
          label,
          style: GoogleFonts.poppins(fontSize: 11, color: const Color(0xFF9CA3AF)),
        ),
      ],
    );
  }

  Widget _buildVerticalDivider() {
    return Container(width: 1, height: 40, color: const Color(0xFFE5E7EB));
  }
}
