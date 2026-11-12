import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  bool _pushNotifications = true;
  bool _emailNotifications = true;
  bool _smsAlerts = false;
  bool _darkMode = false;

  final _oldPasswordController = TextEditingController();
  final _newPasswordController = TextEditingController();
  bool _obscureOld = true;
  bool _obscureNew = true;

  @override
  void dispose() {
    _oldPasswordController.dispose();
    _newPasswordController.dispose();
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
          'Settings',
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
          _buildSectionHeader('ACCOUNT'),
          _buildSettingsCard([
            _buildTapTile(
              icon: Icons.lock_outline,
              label: 'Change Password',
              onTap: () => _showChangePasswordDialog(context),
            ),
            _buildDivider(),
            _buildInfoTile(
              icon: Icons.phone_outlined,
              label: 'Linked Phone',
              value: '+91 9876543210',
            ),
            _buildDivider(),
            _buildTapTile(
              icon: Icons.credit_card_outlined,
              label: 'Manage Payment Methods',
              onTap: () => _showPaymentMethodsSheet(context),
            ),
          ]),
          const SizedBox(height: 20),
          _buildSectionHeader('NOTIFICATIONS'),
          _buildSettingsCard([
            _buildSwitchTile(
              icon: Icons.notifications_outlined,
              label: 'Push Notifications',
              value: _pushNotifications,
              onChanged: (v) => setState(() => _pushNotifications = v),
            ),
            _buildDivider(),
            _buildSwitchTile(
              icon: Icons.email_outlined,
              label: 'Email Notifications',
              value: _emailNotifications,
              onChanged: (v) => setState(() => _emailNotifications = v),
            ),
            _buildDivider(),
            _buildSwitchTile(
              icon: Icons.sms_outlined,
              label: 'SMS Alerts',
              value: _smsAlerts,
              onChanged: (v) => setState(() => _smsAlerts = v),
            ),
          ]),
          const SizedBox(height: 20),
          _buildSectionHeader('PREFERENCES'),
          _buildSettingsCard([
            _buildTapTile(
              icon: Icons.language_outlined,
              label: 'Language',
              trailing: Text('English', style: GoogleFonts.poppins(fontSize: 13, color: const Color(0xFF6B7280))),
              onTap: () => _showLanguageSheet(context),
            ),
            _buildDivider(),
            _buildSwitchTile(
              icon: Icons.dark_mode_outlined,
              label: 'Dark Mode',
              value: _darkMode,
              onChanged: (v) {
                setState(() => _darkMode = v);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('Dark mode coming soon!', style: GoogleFonts.poppins()),
                    backgroundColor: const Color(0xFF6C63FF),
                    behavior: SnackBarBehavior.floating,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                );
              },
            ),
            _buildDivider(),
            _buildInfoTile(
              icon: Icons.currency_rupee,
              label: 'Currency',
              value: 'INR (₹)',
            ),
          ]),
          const SizedBox(height: 20),
          _buildSectionHeader('LEGAL'),
          _buildSettingsCard([
            _buildTapTile(
              icon: Icons.description_outlined,
              label: 'Terms of Service',
              onTap: () => _showLegalDialog(context, 'Terms of Service',
                  'By using Rideel, you agree to our terms. You must be 18+ to use the platform. All deliveries are subject to availability and traveler acceptance. Rideel is not responsible for prohibited items.\n\nUsers must provide accurate information and comply with all applicable laws.'),
            ),
            _buildDivider(),
            _buildTapTile(
              icon: Icons.privacy_tip_outlined,
              label: 'Privacy Policy',
              onTap: () => _showLegalDialog(context, 'Privacy Policy',
                  'Rideel collects personal data to provide its services. We collect your name, phone number, email, and location data.\n\nYour data is never sold to third parties. We use industry-standard encryption to protect your information. You may request data deletion at any time.'),
            ),
            _buildDivider(),
            _buildTapTile(
              icon: Icons.article_outlined,
              label: 'Licenses',
              onTap: () => _showLegalDialog(context, 'Open Source Licenses',
                  'Rideel uses the following open source packages:\n\n• Flutter (BSD License)\n• Provider (MIT License)\n• go_router (BSD License)\n• Google Fonts (Apache 2.0)\n• shared_preferences (BSD License)\n• http (BSD License)\n\nFull license texts available at rideel.com/licenses'),
            ),
          ]),
          const SizedBox(height: 20),
          _buildSectionHeader('DANGER ZONE'),
          _buildSettingsCard([
            ListTile(
              leading: Container(
                width: 38,
                height: 38,
                decoration: BoxDecoration(
                  color: Colors.red.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Icon(Icons.delete_forever_outlined, color: Colors.red, size: 20),
              ),
              title: Text(
                'Delete Account',
                style: GoogleFonts.poppins(
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                  color: Colors.red,
                ),
              ),
              trailing: const Icon(Icons.chevron_right, color: Colors.red, size: 20),
              onTap: () => _showDeleteAccountDialog(context),
            ),
          ]),
          const SizedBox(height: 32),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Padding(
      padding: const EdgeInsets.only(left: 4, bottom: 8),
      child: Text(
        title,
        style: GoogleFonts.poppins(
          fontSize: 11,
          fontWeight: FontWeight.w700,
          color: const Color(0xFF6B7280),
          letterSpacing: 1.0,
        ),
      ),
    );
  }

  Widget _buildSettingsCard(List<Widget> children) {
    return Container(
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
      child: Column(children: children),
    );
  }

  Widget _buildDivider() => Divider(height: 1, indent: 16, endIndent: 16, color: const Color(0xFFE5E7EB));

  Widget _buildTapTile({
    required IconData icon,
    required String label,
    required VoidCallback onTap,
    Widget? trailing,
  }) {
    return ListTile(
      onTap: onTap,
      leading: Container(
        width: 38,
        height: 38,
        decoration: BoxDecoration(
          color: const Color(0xFF6C63FF).withOpacity(0.1),
          borderRadius: BorderRadius.circular(10),
        ),
        child: Icon(icon, color: const Color(0xFF6C63FF), size: 20),
      ),
      title: Text(
        label,
        style: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.w500, color: const Color(0xFF1A1A2E)),
      ),
      trailing: trailing ?? const Icon(Icons.chevron_right, color: Color(0xFF6B7280), size: 20),
    );
  }

  Widget _buildInfoTile({required IconData icon, required String label, required String value}) {
    return ListTile(
      leading: Container(
        width: 38,
        height: 38,
        decoration: BoxDecoration(
          color: const Color(0xFF6C63FF).withOpacity(0.1),
          borderRadius: BorderRadius.circular(10),
        ),
        child: Icon(icon, color: const Color(0xFF6C63FF), size: 20),
      ),
      title: Text(label, style: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.w500, color: const Color(0xFF1A1A2E))),
      trailing: Text(value, style: GoogleFonts.poppins(fontSize: 13, color: const Color(0xFF6B7280))),
    );
  }

  Widget _buildSwitchTile({
    required IconData icon,
    required String label,
    required bool value,
    required ValueChanged<bool> onChanged,
  }) {
    return SwitchListTile(
      activeColor: const Color(0xFF6C63FF),
      secondary: Container(
        width: 38,
        height: 38,
        decoration: BoxDecoration(
          color: const Color(0xFF6C63FF).withOpacity(0.1),
          borderRadius: BorderRadius.circular(10),
        ),
        child: Icon(icon, color: const Color(0xFF6C63FF), size: 20),
      ),
      title: Text(label, style: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.w500, color: const Color(0xFF1A1A2E))),
      value: value,
      onChanged: onChanged,
    );
  }

  void _showChangePasswordDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setDialogState) => AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          title: Text('Change Password', style: GoogleFonts.poppins(fontWeight: FontWeight.bold)),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: _oldPasswordController,
                obscureText: _obscureOld,
                style: GoogleFonts.poppins(fontSize: 14),
                decoration: InputDecoration(
                  labelText: 'Current Password',
                  labelStyle: GoogleFonts.poppins(fontSize: 13),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                  suffixIcon: IconButton(
                    icon: Icon(_obscureOld ? Icons.visibility_off_outlined : Icons.visibility_outlined),
                    onPressed: () => setDialogState(() => _obscureOld = !_obscureOld),
                  ),
                ),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: _newPasswordController,
                obscureText: _obscureNew,
                style: GoogleFonts.poppins(fontSize: 14),
                decoration: InputDecoration(
                  labelText: 'New Password',
                  labelStyle: GoogleFonts.poppins(fontSize: 13),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                  suffixIcon: IconButton(
                    icon: Icon(_obscureNew ? Icons.visibility_off_outlined : Icons.visibility_outlined),
                    onPressed: () => setDialogState(() => _obscureNew = !_obscureNew),
                  ),
                ),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: Text('Cancel', style: GoogleFonts.poppins(color: const Color(0xFF6B7280))),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF6C63FF),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
              ),
              onPressed: () {
                _oldPasswordController.clear();
                _newPasswordController.clear();
                Navigator.pop(ctx);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('Password updated!', style: GoogleFonts.poppins()),
                    backgroundColor: const Color(0xFF10B981),
                    behavior: SnackBarBehavior.floating,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                );
              },
              child: Text('Update', style: GoogleFonts.poppins(color: Colors.white)),
            ),
          ],
        ),
      ),
    );
  }

  void _showPaymentMethodsSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (ctx) => Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(width: 40, height: 4, decoration: BoxDecoration(color: const Color(0xFFE5E7EB), borderRadius: BorderRadius.circular(2))),
            ),
            const SizedBox(height: 16),
            Text('Payment Methods', style: GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            _buildPaymentTile(icon: Icons.account_balance_outlined, label: 'HDFC Bank', subtitle: '****4521', color: const Color(0xFF10B981)),
            const SizedBox(height: 10),
            _buildPaymentTile(icon: Icons.credit_card, label: 'Visa Card', subtitle: '****8743', color: const Color(0xFF6C63FF)),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: OutlinedButton.icon(
                icon: const Icon(Icons.add, color: Color(0xFF6C63FF)),
                label: Text('Add New Method', style: GoogleFonts.poppins(color: const Color(0xFF6C63FF))),
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: Color(0xFF6C63FF)),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  padding: const EdgeInsets.symmetric(vertical: 12),
                ),
                onPressed: () => Navigator.pop(ctx),
              ),
            ),
            const SizedBox(height: 8),
          ],
        ),
      ),
    );
  }

  Widget _buildPaymentTile({required IconData icon, required String label, required String subtitle, required Color color}) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: const Color(0xFFF8F9FE),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFE5E7EB)),
      ),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(color: color.withOpacity(0.1), borderRadius: BorderRadius.circular(10)),
            child: Icon(icon, color: color, size: 20),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label, style: GoogleFonts.poppins(fontWeight: FontWeight.w600, fontSize: 14)),
                Text(subtitle, style: GoogleFonts.poppins(fontSize: 12, color: const Color(0xFF6B7280))),
              ],
            ),
          ),
          const Icon(Icons.check_circle, color: Color(0xFF10B981), size: 20),
        ],
      ),
    );
  }

  void _showLanguageSheet(BuildContext context) {
    final languages = ['English', 'Hindi', 'Marathi', 'Gujarati', 'Tamil', 'Telugu'];
    String selected = 'English';
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setS) => Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(child: Container(width: 40, height: 4, decoration: BoxDecoration(color: const Color(0xFFE5E7EB), borderRadius: BorderRadius.circular(2)))),
              const SizedBox(height: 16),
              Text('Select Language', style: GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.bold)),
              const SizedBox(height: 12),
              ...languages.map((lang) => RadioListTile<String>(
                activeColor: const Color(0xFF6C63FF),
                value: lang,
                groupValue: selected,
                title: Text(lang, style: GoogleFonts.poppins(fontSize: 14)),
                onChanged: (v) {
                  setS(() => selected = v!);
                  Navigator.pop(ctx);
                },
              )),
            ],
          ),
        ),
      ),
    );
  }

  void _showLegalDialog(BuildContext context, String title, String content) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Text(title, style: GoogleFonts.poppins(fontWeight: FontWeight.bold, fontSize: 16)),
        content: SingleChildScrollView(
          child: Text(content, style: GoogleFonts.poppins(fontSize: 13, color: const Color(0xFF6B7280), height: 1.6)),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: Text('Close', style: GoogleFonts.poppins(color: const Color(0xFF6C63FF))),
          ),
        ],
      ),
    );
  }

  void _showDeleteAccountDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Row(
          children: [
            const Icon(Icons.warning_amber_rounded, color: Colors.red, size: 24),
            const SizedBox(width: 8),
            Text('Delete Account', style: GoogleFonts.poppins(fontWeight: FontWeight.bold, color: Colors.red)),
          ],
        ),
        content: Text(
          'This action is permanent and cannot be undone. All your data, deliveries, and wallet balance will be lost.\n\nAre you absolutely sure?',
          style: GoogleFonts.poppins(fontSize: 13, color: const Color(0xFF6B7280)),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: Text('Cancel', style: GoogleFonts.poppins(color: const Color(0xFF6B7280))),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8))),
            onPressed: () {
              Navigator.pop(ctx);
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('Account deletion request submitted.', style: GoogleFonts.poppins()),
                  backgroundColor: Colors.red,
                  behavior: SnackBarBehavior.floating,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                ),
              );
            },
            child: Text('Delete', style: GoogleFonts.poppins(color: Colors.white)),
          ),
        ],
      ),
    );
  }
}
