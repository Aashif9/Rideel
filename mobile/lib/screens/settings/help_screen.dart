import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

class HelpScreen extends StatefulWidget {
  const HelpScreen({super.key});

  @override
  State<HelpScreen> createState() => _HelpScreenState();
}

class _HelpScreenState extends State<HelpScreen> {
  final _searchController = TextEditingController();
  String _searchQuery = '';

  final List<Map<String, String>> _faqs = [
    {
      'q': 'How does Rideel work?',
      'a': 'Rideel connects senders with travelers going to the same destination. Senders post their parcel details, and travelers heading that way can accept the delivery. Once accepted, the traveler picks up the parcel and delivers it upon reaching the destination. Payments are handled securely through the Rideel wallet.',
    },
    {
      'q': 'Is my parcel safe?',
      'a': 'All travelers are verified with government-issued ID proof before they can accept deliveries. Parcels are insured up to ₹5000 against loss or damage. We also provide real-time tracking so you always know where your parcel is.',
    },
    {
      'q': 'How do I track my parcel?',
      'a': 'Use the Live Tracking feature in My Deliveries to see real-time updates on your parcel\'s location. You\'ll also receive push notifications at every stage — when picked up, in transit, and upon delivery.',
    },
    {
      'q': 'How do I get paid as a traveler?',
      'a': 'Payments are credited to your Rideel wallet within 24 hours of successful delivery confirmation. From your wallet, you can withdraw funds to your registered bank account or UPI ID. Withdrawals typically process within 1-2 business days.',
    },
    {
      'q': 'What if my parcel is lost or damaged?',
      'a': 'Contact support immediately via email or phone. We cover up to ₹5000 per parcel under our insurance policy. File a claim within 48 hours of the expected delivery date. Our team will investigate and resolve within 5 business days.',
    },
    {
      'q': 'How do I cancel a booking?',
      'a': 'You can cancel a booking before the traveler picks up your parcel. Go to My Deliveries, select the booking, and tap Cancel. Cancellation charges may apply depending on how close to pickup time you cancel. Full refund is provided if cancelled more than 2 hours before scheduled pickup.',
    },
  ];

  List<Map<String, String>> get _filteredFaqs {
    if (_searchQuery.isEmpty) return _faqs;
    return _faqs.where((faq) =>
      faq['q']!.toLowerCase().contains(_searchQuery.toLowerCase()) ||
      faq['a']!.toLowerCase().contains(_searchQuery.toLowerCase())
    ).toList();
  }

  @override
  void dispose() {
    _searchController.dispose();
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
          'Help & Support',
          style: GoogleFonts.poppins(
            fontSize: 18,
            fontWeight: FontWeight.w600,
            color: const Color(0xFF1A1A2E),
          ),
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _buildSearchBar(),
          const SizedBox(height: 20),
          _buildFaqSection(),
          const SizedBox(height: 24),
          _buildContactCard(context),
          const SizedBox(height: 32),
        ],
      ),
    );
  }

  Widget _buildSearchBar() {
    return TextField(
      controller: _searchController,
      style: GoogleFonts.poppins(fontSize: 14),
      onChanged: (val) => setState(() => _searchQuery = val),
      decoration: InputDecoration(
        hintText: 'Search FAQ...',
        hintStyle: GoogleFonts.poppins(color: const Color(0xFF9CA3AF), fontSize: 14),
        prefixIcon: const Icon(Icons.search, color: Color(0xFF6B7280)),
        suffixIcon: _searchQuery.isNotEmpty
            ? IconButton(
                icon: const Icon(Icons.clear, color: Color(0xFF6B7280), size: 18),
                onPressed: () {
                  _searchController.clear();
                  setState(() => _searchQuery = '');
                },
              )
            : null,
        filled: true,
        fillColor: Colors.white,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: Color(0xFFE5E7EB)),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: Color(0xFFE5E7EB)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: Color(0xFF6C63FF), width: 1.5),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      ),
    );
  }

  Widget _buildFaqSection() {
    final faqs = _filteredFaqs;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Text(
              'Frequently Asked Questions',
              style: GoogleFonts.poppins(
                fontSize: 15,
                fontWeight: FontWeight.w600,
                color: const Color(0xFF1A1A2E),
              ),
            ),
            const SizedBox(width: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
              decoration: BoxDecoration(
                color: const Color(0xFF6C63FF).withOpacity(0.1),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Text(
                '${faqs.length}',
                style: GoogleFonts.poppins(fontSize: 11, color: const Color(0xFF6C63FF), fontWeight: FontWeight.w600),
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        if (faqs.isEmpty)
          Center(
            child: Padding(
              padding: const EdgeInsets.symmetric(vertical: 24),
              child: Column(
                children: [
                  const Icon(Icons.search_off, size: 40, color: Color(0xFF9CA3AF)),
                  const SizedBox(height: 8),
                  Text(
                    'No results for "$_searchQuery"',
                    style: GoogleFonts.poppins(fontSize: 14, color: const Color(0xFF6B7280)),
                  ),
                ],
              ),
            ),
          )
        else
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.04),
                  blurRadius: 10,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(16),
              child: Column(
                children: faqs.asMap().entries.map((entry) {
                  final index = entry.key;
                  final faq = entry.value;
                  return Column(
                    children: [
                      Theme(
                        data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
                        child: ExpansionTile(
                          tilePadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                          childrenPadding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                          leading: Container(
                            width: 32,
                            height: 32,
                            decoration: BoxDecoration(
                              color: const Color(0xFF6C63FF).withOpacity(0.1),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Center(
                              child: Text(
                                'Q',
                                style: GoogleFonts.poppins(
                                  fontSize: 13,
                                  fontWeight: FontWeight.bold,
                                  color: const Color(0xFF6C63FF),
                                ),
                              ),
                            ),
                          ),
                          title: Text(
                            faq['q']!,
                            style: GoogleFonts.poppins(
                              fontSize: 13,
                              fontWeight: FontWeight.w600,
                              color: const Color(0xFF1A1A2E),
                            ),
                          ),
                          iconColor: const Color(0xFF6C63FF),
                          collapsedIconColor: const Color(0xFF6B7280),
                          children: [
                            Text(
                              faq['a']!,
                              style: GoogleFonts.poppins(
                                fontSize: 13,
                                color: const Color(0xFF6B7280),
                                height: 1.6,
                              ),
                            ),
                          ],
                        ),
                      ),
                      if (index < faqs.length - 1)
                        Divider(height: 1, indent: 16, endIndent: 16, color: const Color(0xFFE5E7EB)),
                    ],
                  );
                }).toList(),
              ),
            ),
          ),
      ],
    );
  }

  Widget _buildContactCard(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFF6C63FF), Color(0xFF5A52E0)],
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF6C63FF).withOpacity(0.3),
            blurRadius: 16,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Contact Support',
            style: GoogleFonts.poppins(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            'We\'re here to help you 24/7',
            style: GoogleFonts.poppins(fontSize: 12, color: Colors.white.withOpacity(0.8)),
          ),
          const SizedBox(height: 16),
          _buildContactInfo(Icons.email_outlined, 'support@rideel.com'),
          const SizedBox(height: 8),
          _buildContactInfo(Icons.phone_outlined, '1800-RIDEEL (Toll Free)'),
          const SizedBox(height: 20),
          Row(
            children: [
              Expanded(
                child: ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.white,
                    foregroundColor: const Color(0xFF6C63FF),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    elevation: 0,
                  ),
                  icon: const Icon(Icons.chat_bubble_outline, size: 18),
                  label: Text('Live Chat', style: GoogleFonts.poppins(fontWeight: FontWeight.w600, fontSize: 13)),
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('Chat coming soon!', style: GoogleFonts.poppins()),
                        backgroundColor: const Color(0xFF6C63FF),
                        behavior: SnackBarBehavior.floating,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                    );
                  },
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF25D366),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    elevation: 0,
                  ),
                  icon: const Icon(Icons.message_outlined, size: 18),
                  label: Text('WhatsApp', style: GoogleFonts.poppins(fontWeight: FontWeight.w600, fontSize: 13)),
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('Opening WhatsApp...', style: GoogleFonts.poppins()),
                        backgroundColor: const Color(0xFF25D366),
                        behavior: SnackBarBehavior.floating,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                    );
                  },
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildContactInfo(IconData icon, String text) {
    return Row(
      children: [
        Icon(icon, color: Colors.white.withOpacity(0.9), size: 18),
        const SizedBox(width: 10),
        Text(
          text,
          style: GoogleFonts.poppins(
            fontSize: 13,
            color: Colors.white,
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }
}
