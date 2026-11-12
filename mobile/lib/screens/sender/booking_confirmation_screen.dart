import 'dart:math';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

const Color _primary = Color(0xFF6C63FF);
const Color _secondary = Color(0xFFFF6584);
const Color _background = Color(0xFFF8F9FE);
const Color _textPrimary = Color(0xFF1A1A2E);
const Color _textSecondary = Color(0xFF6B7280);
const Color _success = Color(0xFF10B981);

class BookingConfirmationScreen extends StatefulWidget {
  final dynamic traveler;
  const BookingConfirmationScreen({super.key, this.traveler});

  @override
  State<BookingConfirmationScreen> createState() => _BookingConfirmationScreenState();
}

class _BookingConfirmationScreenState extends State<BookingConfirmationScreen> {
  int _selectedPayment = 0;
  bool _isLoading = false;

  static const _defaultTraveler = {
    'name': 'Rahul Sharma',
    'rating': 4.8,
    'pricePerKg': 50,
    'from': 'Mumbai',
    'to': 'Pune',
    'date': 'Dec 15, 2024',
    'avatar': 'RS',
  };

  final _paymentMethods = [
    {'title': 'Cash on Delivery', 'subtitle': 'Pay when parcel is delivered', 'icon': Icons.money},
    {'title': 'Wallet', 'subtitle': 'Balance: ₹500.00', 'icon': Icons.account_balance_wallet},
    {'title': 'UPI', 'subtitle': 'Google Pay, PhonePe, Paytm', 'icon': Icons.payment},
  ];

  String _generateOrderId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    final rng = Random();
    return List.generate(6, (_) => chars[rng.nextInt(chars.length)]).join();
  }

  Map<String, dynamic> get _t {
    if (widget.traveler != null && widget.traveler is Map) {
      return Map<String, dynamic>.from(widget.traveler);
    }
    return Map<String, dynamic>.from(_defaultTraveler);
  }

  double get _basePrice {
    final pkgStr = 2.5; // mock weight
    return pkgStr * (_t['pricePerKg'] as num).toDouble();
  }

  double get _platformFee => _basePrice * 0.1;
  double get _total => _basePrice + _platformFee;

  void _confirmBooking() async {
    setState(() => _isLoading = true);
    await Future.delayed(const Duration(seconds: 1));
    setState(() => _isLoading = false);

    if (!mounted) return;
    final orderId = _generateOrderId();
    _showSuccessDialog(orderId);
  }

  void _showSuccessDialog(String orderId) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                color: _success.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.check_circle, color: _success, size: 50),
            ),
            const SizedBox(height: 20),
            Text(
              'Booking Confirmed!',
              style: GoogleFonts.poppins(
                fontSize: 20,
                fontWeight: FontWeight.w800,
                color: _textPrimary,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Your parcel booking has been confirmed.',
              textAlign: TextAlign.center,
              style: GoogleFonts.poppins(fontSize: 14, color: _textSecondary),
            ),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
              decoration: BoxDecoration(
                color: _primary.withOpacity(0.08),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Column(
                children: [
                  Text(
                    'Order ID',
                    style: GoogleFonts.poppins(fontSize: 12, color: _textSecondary),
                  ),
                  Text(
                    '#$orderId',
                    style: GoogleFonts.poppins(
                      fontSize: 22,
                      fontWeight: FontWeight.w800,
                      color: _primary,
                      letterSpacing: 3,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  Navigator.pop(ctx);
                  context.go('/sender/my-deliveries');
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: _primary,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  elevation: 0,
                ),
                child: Text(
                  'Track My Delivery',
                  style: GoogleFonts.poppins(fontWeight: FontWeight.w700, color: Colors.white),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final t = _t;
    return Scaffold(
      backgroundColor: _background,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: _textPrimary),
          onPressed: () => context.go('/sender/traveler-profile'),
        ),
        title: Text(
          'Booking Confirmation',
          style: GoogleFonts.poppins(
            fontSize: 20,
            fontWeight: FontWeight.w700,
            color: _textPrimary,
          ),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Booking summary card
            _buildCard(
              title: 'Booking Summary',
              icon: Icons.receipt_long,
              child: Column(
                children: [
                  _summaryRow('📦', 'Parcel', 'Electronics • 2.5 kg'),
                  const SizedBox(height: 10),
                  _summaryRow('📍', 'Route', '${t['from']} → ${t['to']}'),
                  const SizedBox(height: 10),
                  _summaryRow('🏠', 'Pickup', 'Andheri West, ${t['from']}'),
                  const SizedBox(height: 10),
                  _summaryRow('🏁', 'Drop-off', 'Kothrud, ${t['to']}'),
                  const SizedBox(height: 10),
                  _summaryRow('👤', 'Traveler', t['name']),
                  const SizedBox(height: 10),
                  _summaryRow('⭐', 'Rating', '${t['rating']} / 5.0'),
                  const SizedBox(height: 10),
                  _summaryRow('📅', 'Est. Delivery', t['date']),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Price breakdown
            _buildCard(
              title: 'Price Breakdown',
              icon: Icons.currency_rupee,
              child: Column(
                children: [
                  _priceRow('Base Price (2.5 kg × ₹${t['pricePerKg']}/kg)', '₹${_basePrice.toStringAsFixed(0)}', false),
                  const SizedBox(height: 8),
                  _priceRow('Platform Fee (10%)', '₹${_platformFee.toStringAsFixed(0)}', false),
                  const Padding(
                    padding: EdgeInsets.symmetric(vertical: 10),
                    child: Divider(color: Color(0xFFE5E7EB)),
                  ),
                  _priceRow('Total Amount', '₹${_total.toStringAsFixed(0)}', true),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Payment method
            _buildCard(
              title: 'Payment Method',
              icon: Icons.payment,
              child: Column(
                children: List.generate(_paymentMethods.length, (i) {
                  final pm = _paymentMethods[i];
                  return GestureDetector(
                    onTap: () => setState(() => _selectedPayment = i),
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 200),
                      margin: const EdgeInsets.only(bottom: 10),
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: _selectedPayment == i ? _primary.withOpacity(0.07) : Colors.grey.shade50,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: _selectedPayment == i ? _primary : const Color(0xFFE5E7EB),
                          width: _selectedPayment == i ? 2 : 1,
                        ),
                      ),
                      child: Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(10),
                            decoration: BoxDecoration(
                              color: _selectedPayment == i ? _primary.withOpacity(0.1) : Colors.grey.shade100,
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: Icon(pm['icon'] as IconData, color: _selectedPayment == i ? _primary : _textSecondary, size: 22),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  pm['title'] as String,
                                  style: GoogleFonts.poppins(
                                    fontSize: 14,
                                    fontWeight: FontWeight.w700,
                                    color: _selectedPayment == i ? _primary : _textPrimary,
                                  ),
                                ),
                                Text(
                                  pm['subtitle'] as String,
                                  style: GoogleFonts.poppins(fontSize: 12, color: _textSecondary),
                                ),
                              ],
                            ),
                          ),
                          Radio<int>(
                            value: i,
                            groupValue: _selectedPayment,
                            onChanged: (v) => setState(() => _selectedPayment = v!),
                            activeColor: _primary,
                          ),
                        ],
                      ),
                    ),
                  );
                }),
              ),
            ),
            const SizedBox(height: 24),

            // Confirm button
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _isLoading ? null : _confirmBooking,
                style: ElevatedButton.styleFrom(
                  backgroundColor: _primary,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  elevation: 0,
                ),
                child: _isLoading
                    ? const SizedBox(
                        width: 24,
                        height: 24,
                        child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2.5),
                      )
                    : Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(Icons.check_circle_outline, size: 20),
                          const SizedBox(width: 8),
                          Text(
                            'Confirm Booking  •  ₹${_total.toStringAsFixed(0)}',
                            style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w700),
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

  Widget _buildCard({required String title, required IconData icon, required Widget child}) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.06),
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
              Icon(icon, color: _primary, size: 20),
              const SizedBox(width: 8),
              Text(
                title,
                style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w700, color: _textPrimary),
              ),
            ],
          ),
          const SizedBox(height: 14),
          const Divider(color: Color(0xFFE5E7EB)),
          const SizedBox(height: 10),
          child,
        ],
      ),
    );
  }

  Widget _summaryRow(String emoji, String label, String value) {
    return Row(
      children: [
        SizedBox(width: 24, child: Text(emoji, style: const TextStyle(fontSize: 16))),
        const SizedBox(width: 8),
        Text(label, style: GoogleFonts.poppins(fontSize: 13, color: _textSecondary, fontWeight: FontWeight.w500)),
        const Spacer(),
        Flexible(
          child: Text(
            value,
            textAlign: TextAlign.right,
            style: GoogleFonts.poppins(fontSize: 13, fontWeight: FontWeight.w700, color: _textPrimary),
          ),
        ),
      ],
    );
  }

  Widget _priceRow(String label, String value, bool isTotal) {
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
