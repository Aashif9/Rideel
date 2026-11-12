import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

class NotificationsScreen extends StatefulWidget {
  const NotificationsScreen({super.key});

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  late List<Map<String, dynamic>> _notifications;

  @override
  void initState() {
    super.initState();
    _notifications = [
      {'id': 'n1', 'title': 'Traveler Assigned!', 'body': 'Rahul Sharma has accepted your parcel for Mumbai to Pune', 'time': '2 hours ago', 'read': false, 'icon': Icons.local_shipping, 'color': const Color(0xFF6C63FF)},
      {'id': 'n2', 'title': 'Parcel Picked Up', 'body': 'Your parcel has been picked up from Andheri West', 'time': '3 hours ago', 'read': false, 'icon': Icons.inventory_2_outlined, 'color': const Color(0xFF10B981)},
      {'id': 'n3', 'title': 'In Transit', 'body': 'Your parcel is on the way to Pune. ETA: 6:00 PM', 'time': '5 hours ago', 'read': true, 'icon': Icons.directions_car_outlined, 'color': const Color(0xFFF59E0B)},
      {'id': 'n4', 'title': 'Delivery Complete', 'body': 'Your parcel has been delivered successfully in Pune!', 'time': '2 days ago', 'read': true, 'icon': Icons.check_circle_outline, 'color': const Color(0xFF10B981)},
      {'id': 'n5', 'title': 'New Delivery Request', 'body': 'Someone wants to send a parcel on your Mumbai-Pune route', 'time': '3 days ago', 'read': true, 'icon': Icons.add_box_outlined, 'color': const Color(0xFFFF6584)},
    ];
  }

  void _markAllRead() {
    setState(() {
      for (final n in _notifications) {
        n['read'] = true;
      }
    });
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('All notifications marked as read', style: GoogleFonts.poppins()),
        backgroundColor: const Color(0xFF6C63FF),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      ),
    );
  }

  void _markRead(String id) {
    setState(() {
      final n = _notifications.firstWhere((n) => n['id'] == id);
      n['read'] = true;
    });
  }

  @override
  Widget build(BuildContext context) {
    final unreadCount = _notifications.where((n) => !(n['read'] as bool)).length;

    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FE),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: Color(0xFF1A1A2E), size: 20),
          onPressed: () => context.pop(),
        ),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Notifications',
              style: GoogleFonts.poppins(
                fontSize: 18,
                fontWeight: FontWeight.w600,
                color: const Color(0xFF1A1A2E),
              ),
            ),
            if (unreadCount > 0)
              Text(
                '$unreadCount unread',
                style: GoogleFonts.poppins(
                  fontSize: 11,
                  color: const Color(0xFF6C63FF),
                ),
              ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: unreadCount > 0 ? _markAllRead : null,
            child: Text(
              'Mark all read',
              style: GoogleFonts.poppins(
                color: unreadCount > 0 ? const Color(0xFF6C63FF) : const Color(0xFF9CA3AF),
                fontSize: 13,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        ],
      ),
      body: _notifications.isEmpty
          ? _buildEmptyState()
          : ListView.builder(
              padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
              itemCount: _notifications.length,
              itemBuilder: (context, index) {
                final n = _notifications[index];
                return _buildNotificationTile(n);
              },
            ),
    );
  }

  Widget _buildNotificationTile(Map<String, dynamic> n) {
    final isRead = n['read'] as bool;
    final color = n['color'] as Color;
    final icon = n['icon'] as IconData;

    return GestureDetector(
      onTap: () => _markRead(n['id'] as String),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 300),
        margin: const EdgeInsets.only(bottom: 10),
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: isRead ? Colors.white : const Color(0xFFEEEDFF),
          borderRadius: BorderRadius.circular(14),
          border: Border.all(
            color: isRead ? const Color(0xFFE5E7EB) : const Color(0xFF6C63FF).withOpacity(0.3),
            width: isRead ? 1 : 1.5,
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.04),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: color.withOpacity(0.12),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: color, size: 22),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(
                          n['title'] as String,
                          style: GoogleFonts.poppins(
                            fontSize: 14,
                            fontWeight: isRead ? FontWeight.w500 : FontWeight.w700,
                            color: const Color(0xFF1A1A2E),
                          ),
                        ),
                      ),
                      if (!isRead)
                        Container(
                          width: 8,
                          height: 8,
                          decoration: const BoxDecoration(
                            color: Color(0xFF6C63FF),
                            shape: BoxShape.circle,
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(
                    n['body'] as String,
                    style: GoogleFonts.poppins(
                      fontSize: 12,
                      color: const Color(0xFF6B7280),
                      height: 1.4,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 6),
                  Text(
                    n['time'] as String,
                    style: GoogleFonts.poppins(
                      fontSize: 11,
                      color: const Color(0xFF9CA3AF),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 90,
            height: 90,
            decoration: BoxDecoration(
              color: const Color(0xFF6C63FF).withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.notifications_none, size: 44, color: Color(0xFF6C63FF)),
          ),
          const SizedBox(height: 20),
          Text(
            'All caught up!',
            style: GoogleFonts.poppins(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: const Color(0xFF1A1A2E),
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'No notifications yet.',
            style: GoogleFonts.poppins(fontSize: 14, color: const Color(0xFF6B7280)),
          ),
        ],
      ),
    );
  }
}
