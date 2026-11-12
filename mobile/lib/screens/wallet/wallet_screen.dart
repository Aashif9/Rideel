import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

class WalletScreen extends StatefulWidget {
  const WalletScreen({super.key});

  @override
  State<WalletScreen> createState() => _WalletScreenState();
}

class _WalletScreenState extends State<WalletScreen> {
  final _amountController = TextEditingController();

  final List<Map<String, dynamic>> transactions = [
    {'type': 'credit', 'desc': 'Delivery Payment - Mumbai to Pune', 'amount': 125, 'date': 'Dec 15, 2024', 'icon': 'arrow_downward'},
    {'type': 'debit', 'desc': 'Platform Fee', 'amount': 15, 'date': 'Dec 15, 2024', 'icon': 'arrow_upward'},
    {'type': 'credit', 'desc': 'Delivery Payment - Delhi to Jaipur', 'amount': 200, 'date': 'Dec 10, 2024', 'icon': 'arrow_downward'},
    {'type': 'debit', 'desc': 'Withdrawal to Bank', 'amount': 500, 'date': 'Dec 8, 2024', 'icon': 'arrow_upward'},
    {'type': 'credit', 'desc': 'Referral Bonus', 'amount': 50, 'date': 'Dec 1, 2024', 'icon': 'card_giftcard'},
  ];

  @override
  void dispose() {
    _amountController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FE),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios, color: Color(0xFF1A1A2E), size: 20),
          onPressed: () => context.pop(),
        ),
        title: Text(
          'My Wallet',
          style: GoogleFonts.poppins(
            fontSize: 18,
            fontWeight: FontWeight.w600,
            color: const Color(0xFF1A1A2E),
          ),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildBalanceCard(context),
            const SizedBox(height: 24),
            Text(
              'Recent Transactions',
              style: GoogleFonts.poppins(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: const Color(0xFF1A1A2E),
              ),
            ),
            const SizedBox(height: 12),
            ...transactions.map((tx) => _buildTransactionTile(tx)),
          ],
        ),
      ),
    );
  }

  Widget _buildBalanceCard(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFF6C63FF), Color(0xFF5A52E0)],
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF6C63FF).withOpacity(0.35),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Total Balance',
                style: GoogleFonts.poppins(
                  color: Colors.white.withOpacity(0.85),
                  fontSize: 14,
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  'Rideel Pay',
                  style: GoogleFonts.poppins(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w500),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            '₹650.00',
            style: GoogleFonts.poppins(
              fontSize: 36,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 20),
          Row(
            children: [
              _buildWalletAction(context, Icons.add, 'Add Money', () => _showAddMoneySheet(context)),
              const SizedBox(width: 10),
              _buildWalletAction(context, Icons.arrow_upward, 'Withdraw', () {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('Withdrawal feature coming soon!', style: GoogleFonts.poppins()),
                    backgroundColor: const Color(0xFF6C63FF),
                    behavior: SnackBarBehavior.floating,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                );
              }),
              const SizedBox(width: 10),
              _buildWalletAction(context, Icons.send, 'Send', () {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('Send money feature coming soon!', style: GoogleFonts.poppins()),
                    backgroundColor: const Color(0xFF6C63FF),
                    behavior: SnackBarBehavior.floating,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                );
              }),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildWalletAction(BuildContext context, IconData icon, String label, VoidCallback onTap) {
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 10),
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.2),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Column(
            children: [
              Icon(icon, color: Colors.white, size: 20),
              const SizedBox(height: 4),
              Text(
                label,
                style: GoogleFonts.poppins(
                  color: Colors.white,
                  fontSize: 11,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTransactionTile(Map<String, dynamic> tx) {
    final isCredit = tx['type'] == 'credit';
    final isGiftcard = tx['icon'] == 'card_giftcard';
    final iconData = isGiftcard ? Icons.card_giftcard : (isCredit ? Icons.arrow_downward : Icons.arrow_upward);
    final color = isCredit ? const Color(0xFF10B981) : Colors.red;

    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(iconData, color: color, size: 20),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  tx['desc'] as String,
                  style: GoogleFonts.poppins(
                    fontSize: 13,
                    fontWeight: FontWeight.w500,
                    color: const Color(0xFF1A1A2E),
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 2),
                Text(
                  tx['date'] as String,
                  style: GoogleFonts.poppins(
                    fontSize: 11,
                    color: const Color(0xFF6B7280),
                  ),
                ),
              ],
            ),
          ),
          Text(
            '${isCredit ? '+' : '-'}₹${tx['amount']}',
            style: GoogleFonts.poppins(
              fontSize: 15,
              fontWeight: FontWeight.w600,
              color: color,
            ),
          ),
        ],
      ),
    );
  }

  void _showAddMoneySheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => Padding(
        padding: EdgeInsets.only(
          left: 20,
          right: 20,
          top: 20,
          bottom: MediaQuery.of(ctx).viewInsets.bottom + 20,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: const Color(0xFFE5E7EB),
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: 16),
            Text(
              'Add Money',
              style: GoogleFonts.poppins(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: const Color(0xFF1A1A2E),
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _amountController,
              keyboardType: TextInputType.number,
              style: GoogleFonts.poppins(fontSize: 15),
              decoration: InputDecoration(
                labelText: 'Enter Amount',
                labelStyle: GoogleFonts.poppins(color: const Color(0xFF6B7280)),
                prefixText: '₹ ',
                prefixStyle: GoogleFonts.poppins(fontSize: 15, color: const Color(0xFF1A1A2E)),
                filled: true,
                fillColor: const Color(0xFFF8F9FE),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: const BorderSide(color: Color(0xFF6C63FF), width: 1.5),
                ),
              ),
            ),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              children: [500, 1000, 2000, 5000].map((amt) => ActionChip(
                label: Text('₹$amt', style: GoogleFonts.poppins(fontSize: 12)),
                onPressed: () => _amountController.text = amt.toString(),
                backgroundColor: const Color(0xFFEEEDFF),
                labelStyle: const TextStyle(color: Color(0xFF6C63FF)),
              )).toList(),
            ),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF6C63FF),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                onPressed: () {
                  Navigator.pop(ctx);
                  _amountController.clear();
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Row(
                        children: [
                          const Icon(Icons.check_circle, color: Colors.white),
                          const SizedBox(width: 8),
                          Text('Money added successfully!', style: GoogleFonts.poppins()),
                        ],
                      ),
                      backgroundColor: const Color(0xFF10B981),
                      behavior: SnackBarBehavior.floating,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                  );
                },
                child: Text('Add Money', style: GoogleFonts.poppins(color: Colors.white, fontWeight: FontWeight.w600)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
