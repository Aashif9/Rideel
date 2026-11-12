import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:rideel/providers/auth_provider.dart';

class RoleSelectionScreen extends StatefulWidget {
  const RoleSelectionScreen({super.key});

  @override
  State<RoleSelectionScreen> createState() => _RoleSelectionScreenState();
}

class _RoleSelectionScreenState extends State<RoleSelectionScreen> {
  String? _selectedRole;
  bool _isLoading = false;

  Future<void> _continue() async {
    if (_selectedRole == null) return;
    setState(() => _isLoading = true);
    try {
      final authProvider = context.read<AuthProvider>();
      await authProvider.setRole(_selectedRole!);
      if (!mounted) return;
      context.go('/$_selectedRole/dashboard');
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error: ${e.toString()}'),
          backgroundColor: const Color(0xFFEF4444),
        ),
      );
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FE),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 48),

              // Header
              Text(
                'I am a...',
                style: GoogleFonts.poppins(
                  fontSize: 32,
                  fontWeight: FontWeight.bold,
                  color: const Color(0xFF1A1A2E),
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Choose your role to get started',
                style: GoogleFonts.poppins(
                  fontSize: 15,
                  color: const Color(0xFF6B7280),
                ),
              ),

              const SizedBox(height: 48),

              // Role cards
              Expanded(
                child: Column(
                  children: [
                    // Sender card
                    _RoleCard(
                      role: 'sender',
                      icon: Icons.inventory_2_rounded,
                      title: 'Sender',
                      subtitle: 'I want to send parcels',
                      description:
                          'Find verified travelers going to your destination and send parcels affordably.',
                      color: const Color(0xFF6C63FF),
                      bgColor: const Color(0xFFEDE9FF),
                      isSelected: _selectedRole == 'sender',
                      onTap: () => setState(() => _selectedRole = 'sender'),
                    ),

                    const SizedBox(height: 20),

                    // Traveler card
                    _RoleCard(
                      role: 'traveler',
                      icon: Icons.directions_car_rounded,
                      title: 'Traveler',
                      subtitle: 'I carry parcels and earn',
                      description:
                          'Accept delivery requests on your route and earn extra income while traveling.',
                      color: const Color(0xFFFF6584),
                      bgColor: const Color(0xFFFFEEF2),
                      isSelected: _selectedRole == 'traveler',
                      onTap: () => setState(() => _selectedRole = 'traveler'),
                    ),

                    const Spacer(),

                    // Continue button
                    SizedBox(
                      width: double.infinity,
                      height: 56,
                      child: ElevatedButton(
                        onPressed:
                            (_selectedRole == null || _isLoading) ? null : _continue,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF6C63FF),
                          foregroundColor: Colors.white,
                          disabledBackgroundColor: const Color(0xFFE5E7EB),
                          disabledForegroundColor: const Color(0xFF9CA3AF),
                          elevation: 0,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                        ),
                        child: _isLoading
                            ? const SizedBox(
                                width: 24,
                                height: 24,
                                child: CircularProgressIndicator(
                                  color: Colors.white,
                                  strokeWidth: 2.5,
                                ),
                              )
                            : Text(
                                'Continue',
                                style: GoogleFonts.poppins(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                      ),
                    ),

                    const SizedBox(height: 32),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _RoleCard extends StatelessWidget {
  final String role;
  final IconData icon;
  final String title;
  final String subtitle;
  final String description;
  final Color color;
  final Color bgColor;
  final bool isSelected;
  final VoidCallback onTap;

  const _RoleCard({
    required this.role,
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.description,
    required this.color,
    required this.bgColor,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        width: double.infinity,
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: isSelected ? color.withOpacity(0.06) : Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isSelected ? color : const Color(0xFFE5E7EB),
            width: isSelected ? 2 : 1,
          ),
          boxShadow: isSelected
              ? [
                  BoxShadow(
                    color: color.withOpacity(0.15),
                    blurRadius: 16,
                    offset: const Offset(0, 4),
                  ),
                ]
              : [
                  const BoxShadow(
                    color: Color(0x0A000000),
                    blurRadius: 8,
                    offset: Offset(0, 2),
                  ),
                ],
        ),
        child: Row(
          children: [
            // Icon container
            Container(
              width: 72,
              height: 72,
              decoration: BoxDecoration(
                color: isSelected ? color.withOpacity(0.12) : bgColor,
                borderRadius: BorderRadius.circular(18),
              ),
              child: Icon(icon, size: 36, color: color),
            ),

            const SizedBox(width: 20),

            // Text
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: GoogleFonts.poppins(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: const Color(0xFF1A1A2E),
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    subtitle,
                    style: GoogleFonts.poppins(
                      fontSize: 13,
                      fontWeight: FontWeight.w500,
                      color: color,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    description,
                    style: GoogleFonts.poppins(
                      fontSize: 12,
                      color: const Color(0xFF6B7280),
                      height: 1.5,
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(width: 12),

            // Checkmark
            AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              width: 28,
              height: 28,
              decoration: BoxDecoration(
                color: isSelected ? color : Colors.transparent,
                shape: BoxShape.circle,
                border: Border.all(
                  color: isSelected ? color : const Color(0xFFD1D5DB),
                  width: 2,
                ),
              ),
              child: isSelected
                  ? const Icon(Icons.check_rounded,
                      size: 16, color: Colors.white)
                  : null,
            ),
          ],
        ),
      ),
    );
  }
}
