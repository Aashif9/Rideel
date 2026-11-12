import 'dart:async';
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

class LiveTrackingScreen extends StatefulWidget {
  const LiveTrackingScreen({super.key});

  @override
  State<LiveTrackingScreen> createState() => _LiveTrackingScreenState();
}

class _LiveTrackingScreenState extends State<LiveTrackingScreen> with TickerProviderStateMixin {
  late AnimationController _pulseController;
  late Animation<double> _pulseAnimation;
  late AnimationController _truckController;
  late Animation<double> _truckAnimation;

  // ETA countdown (mock - 4 hours from now)
  int _etaSeconds = 4 * 3600;
  Timer? _countdownTimer;

  final _statusUpdates = [
    {'time': '10:30 AM', 'location': 'Package picked up', 'detail': 'Mumbai - Andheri West', 'done': true},
    {'time': '1:45 PM', 'location': 'In transit', 'detail': 'Nashik checkpoint', 'done': true},
    {'time': '6:00 PM', 'location': 'Estimated arrival', 'detail': 'Pune - Kothrud', 'done': false},
  ];

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(vsync: this, duration: const Duration(seconds: 1))
      ..repeat(reverse: true);
    _pulseAnimation = Tween<double>(begin: 0.8, end: 1.2).animate(
      CurvedAnimation(parent: _pulseController, curve: Curves.easeInOut),
    );

    _truckController = AnimationController(vsync: this, duration: const Duration(seconds: 3))
      ..repeat(reverse: true);
    _truckAnimation = Tween<double>(begin: 0.55, end: 0.65).animate(
      CurvedAnimation(parent: _truckController, curve: Curves.easeInOut),
    );

    _countdownTimer = Timer.periodic(const Duration(seconds: 1), (_) {
      if (_etaSeconds > 0) {
        setState(() => _etaSeconds--);
      }
    });
  }

  @override
  void dispose() {
    _pulseController.dispose();
    _truckController.dispose();
    _countdownTimer?.cancel();
    super.dispose();
  }

  String get _etaFormatted {
    final h = _etaSeconds ~/ 3600;
    final m = (_etaSeconds % 3600) ~/ 60;
    final s = _etaSeconds % 60;
    return '${h.toString().padLeft(2, '0')}:${m.toString().padLeft(2, '0')}:${s.toString().padLeft(2, '0')}';
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
          onPressed: () => context.go('/sender/my-deliveries'),
        ),
        title: Text(
          'Live Tracking',
          style: GoogleFonts.poppins(fontSize: 20, fontWeight: FontWeight.w700, color: _textPrimary),
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 12),
            child: ScaleTransition(
              scale: _pulseAnimation,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                decoration: BoxDecoration(
                  color: _success.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      width: 8,
                      height: 8,
                      decoration: const BoxDecoration(color: _success, shape: BoxShape.circle),
                    ),
                    const SizedBox(width: 5),
                    Text('Live', style: GoogleFonts.poppins(fontSize: 12, fontWeight: FontWeight.w700, color: _success)),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Status card
            Container(
              margin: const EdgeInsets.all(16),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF6C63FF), Color(0xFF5A52E0)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(color: _primary.withOpacity(0.35), blurRadius: 16, offset: const Offset(0, 6)),
                ],
              ),
              child: Column(
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: const Icon(Icons.local_shipping, color: Colors.white, size: 24),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'In Transit',
                              style: GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.w800, color: Colors.white),
                            ),
                            Text(
                              'Mumbai → Pune',
                              style: GoogleFonts.poppins(fontSize: 14, color: Colors.white.withOpacity(0.9)),
                            ),
                          ],
                        ),
                      ),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Text('ETA', style: GoogleFonts.poppins(fontSize: 11, color: Colors.white.withOpacity(0.7))),
                          Text(
                            _etaFormatted,
                            style: GoogleFonts.poppins(
                              fontSize: 20,
                              fontWeight: FontWeight.w800,
                              color: Colors.white,
                              fontFeatures: const [FontFeature.tabularFigures()],
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),
                  // Current location pill
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.15),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(Icons.my_location, size: 14, color: Colors.white),
                        const SizedBox(width: 6),
                        Text(
                          'Last seen: Nashik checkpoint • 1:45 PM',
                          style: GoogleFonts.poppins(fontSize: 12, color: Colors.white.withOpacity(0.9)),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            // Map placeholder with route visualization
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 16),
              height: 220,
              decoration: BoxDecoration(
                color: const Color(0xFFE8EAF0),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFFD1D5DB)),
              ),
              child: Stack(
                children: [
                  // Grid background (map effect)
                  ClipRRect(
                    borderRadius: BorderRadius.circular(16),
                    child: CustomPaint(
                      painter: _MapGridPainter(),
                      child: Container(),
                    ),
                  ),

                  // Route line & cities
                  Padding(
                    padding: const EdgeInsets.all(24),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Row(
                          children: [
                            // Mumbai label
                            Column(
                              children: [
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: _success,
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: Text('Mumbai', style: GoogleFonts.poppins(fontSize: 11, fontWeight: FontWeight.w700, color: Colors.white)),
                                ),
                                const SizedBox(height: 4),
                                const Icon(Icons.location_on, color: _success, size: 20),
                              ],
                            ),
                            // Dashed route line with truck
                            Expanded(
                              child: AnimatedBuilder(
                                animation: _truckAnimation,
                                builder: (ctx, child) => Stack(
                                  alignment: Alignment.center,
                                  children: [
                                    CustomPaint(
                                      painter: _DashedLinePainter(),
                                      child: Container(height: 20),
                                    ),
                                    Positioned(
                                      left: MediaQuery.of(context).size.width * _truckAnimation.value - 90,
                                      child: Container(
                                        padding: const EdgeInsets.all(6),
                                        decoration: BoxDecoration(
                                          color: _primary,
                                          borderRadius: BorderRadius.circular(8),
                                          boxShadow: [
                                            BoxShadow(color: _primary.withOpacity(0.4), blurRadius: 8, spreadRadius: 1),
                                          ],
                                        ),
                                        child: const Icon(Icons.local_shipping, color: Colors.white, size: 18),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                            // Pune label
                            Column(
                              children: [
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: _secondary,
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: Text('Pune', style: GoogleFonts.poppins(fontSize: 11, fontWeight: FontWeight.w700, color: Colors.white)),
                                ),
                                const SizedBox(height: 4),
                                const Icon(Icons.flag, color: _secondary, size: 20),
                              ],
                            ),
                          ],
                        ),
                        const SizedBox(height: 20),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(Icons.map_outlined, size: 16, color: _textSecondary),
                            const SizedBox(width: 6),
                            Text(
                              'Live map not available in demo',
                              style: GoogleFonts.poppins(fontSize: 13, color: _textSecondary),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Status updates timeline
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Container(
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
                        const Icon(Icons.update, color: _primary, size: 20),
                        const SizedBox(width: 8),
                        Text('Status Updates', style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w700, color: _textPrimary)),
                        const Spacer(),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: _success.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Text('Auto-refresh', style: GoogleFonts.poppins(fontSize: 10, fontWeight: FontWeight.w700, color: _success)),
                        ),
                      ],
                    ),
                    const SizedBox(height: 14),
                    const Divider(color: Color(0xFFE5E7EB)),
                    const SizedBox(height: 8),
                    ...List.generate(_statusUpdates.length, (i) {
                      final upd = _statusUpdates[i];
                      final isDone = upd['done'] as bool;
                      final isLast = i == _statusUpdates.length - 1;
                      return Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Column(
                            children: [
                              Container(
                                width: 32,
                                height: 32,
                                decoration: BoxDecoration(
                                  color: isDone ? _success : _warning.withOpacity(0.1),
                                  shape: BoxShape.circle,
                                  border: Border.all(
                                    color: isDone ? _success : _warning,
                                    width: 2,
                                  ),
                                ),
                                child: Icon(
                                  isDone ? Icons.check : Icons.access_time,
                                  size: 16,
                                  color: isDone ? Colors.white : _warning,
                                ),
                              ),
                              if (!isLast)
                                Container(
                                  width: 2,
                                  height: 42,
                                  color: isDone ? _success.withOpacity(0.3) : const Color(0xFFE5E7EB),
                                ),
                            ],
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Padding(
                              padding: const EdgeInsets.only(bottom: 20),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      Text(
                                        upd['location'] as String,
                                        style: GoogleFonts.poppins(
                                          fontSize: 14,
                                          fontWeight: FontWeight.w700,
                                          color: isDone ? _textPrimary : _warning,
                                        ),
                                      ),
                                      const Spacer(),
                                      Text(
                                        upd['time'] as String,
                                        style: GoogleFonts.poppins(fontSize: 12, color: _textSecondary),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    upd['detail'] as String,
                                    style: GoogleFonts.poppins(fontSize: 12, color: _textSecondary),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ],
                      );
                    }),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Traveler contact card
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    BoxShadow(color: Colors.black.withOpacity(0.06), blurRadius: 8, offset: const Offset(0, 2)),
                  ],
                ),
                child: Row(
                  children: [
                    Container(
                      width: 52,
                      height: 52,
                      decoration: const BoxDecoration(color: _primary, shape: BoxShape.circle),
                      child: Center(
                        child: Text('RS', style: GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.w700, color: Colors.white)),
                      ),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Rahul Sharma', style: GoogleFonts.poppins(fontSize: 15, fontWeight: FontWeight.w700, color: _textPrimary)),
                          Row(
                            children: const [
                              Icon(Icons.star, size: 14, color: Color(0xFFF59E0B)),
                              SizedBox(width: 3),
                              Text('4.8 • Car', style: TextStyle(fontSize: 12, color: _textSecondary)),
                            ],
                          ),
                        ],
                      ),
                    ),
                    Row(
                      children: [
                        _contactButton(
                          icon: Icons.message,
                          color: _primary,
                          onTap: () => ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Messaging coming soon!')),
                          ),
                        ),
                        const SizedBox(width: 10),
                        _contactButton(
                          icon: Icons.call,
                          color: _success,
                          onTap: () => ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Calling Rahul Sharma...')),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  Widget _contactButton({required IconData icon, required Color color, required VoidCallback onTap}) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 42,
        height: 42,
        decoration: BoxDecoration(
          color: color.withOpacity(0.1),
          shape: BoxShape.circle,
        ),
        child: Icon(icon, color: color, size: 20),
      ),
    );
  }
}

class _DashedLinePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = const Color(0xFF6C63FF)
      ..strokeWidth = 2.5
      ..style = PaintingStyle.stroke;

    const dashWidth = 8.0;
    const dashSpace = 5.0;
    double startX = 0;
    final y = size.height / 2;

    while (startX < size.width) {
      canvas.drawLine(Offset(startX, y), Offset(startX + dashWidth, y), paint);
      startX += dashWidth + dashSpace;
    }
  }

  @override
  bool shouldRepaint(_DashedLinePainter oldDelegate) => false;
}

class _MapGridPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = const Color(0xFFCED4DA)
      ..strokeWidth = 0.5;

    const spacing = 30.0;

    for (double x = 0; x < size.width; x += spacing) {
      canvas.drawLine(Offset(x, 0), Offset(x, size.height), paint);
    }
    for (double y = 0; y < size.height; y += spacing) {
      canvas.drawLine(Offset(0, y), Offset(size.width, y), paint);
    }
  }

  @override
  bool shouldRepaint(_MapGridPainter oldDelegate) => false;
}
