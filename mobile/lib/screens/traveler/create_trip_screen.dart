import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';

class CreateTripScreen extends StatefulWidget {
  const CreateTripScreen({super.key});

  @override
  State<CreateTripScreen> createState() => _CreateTripScreenState();
}

class _CreateTripScreenState extends State<CreateTripScreen> {
  final _formKey = GlobalKey<FormState>();

  final List<String> _cities = [
    'Mumbai', 'Pune', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Jaipur', 'Kolkata'
  ];
  final List<String> _vehicleTypes = ['Car', 'Train', 'Bus', 'Bike', 'Flight'];

  String? _fromCity;
  String? _toCity;
  DateTime? _departureDate;
  TimeOfDay? _departureTime;
  String _vehicleType = 'Car';
  double _availableWeight = 10.0;
  final _priceController = TextEditingController();
  final _notesController = TextEditingController();

  @override
  void dispose() {
    _priceController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  Future<void> _pickDate() async {
    final now = DateTime.now();
    final picked = await showDatePicker(
      context: context,
      initialDate: now,
      firstDate: now,
      lastDate: now.add(const Duration(days: 365)),
      builder: (context, child) => Theme(
        data: Theme.of(context).copyWith(
          colorScheme: const ColorScheme.light(primary: Color(0xFF6C63FF)),
        ),
        child: child!,
      ),
    );
    if (picked != null) setState(() => _departureDate = picked);
  }

  Future<void> _pickTime() async {
    final picked = await showTimePicker(
      context: context,
      initialTime: TimeOfDay.now(),
      builder: (context, child) => Theme(
        data: Theme.of(context).copyWith(
          colorScheme: const ColorScheme.light(primary: Color(0xFF6C63FF)),
        ),
        child: child!,
      ),
    );
    if (picked != null) setState(() => _departureTime = picked);
  }

  void _submit() {
    if (!_formKey.currentState!.validate()) return;
    if (_fromCity == null || _toCity == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Please select From and To cities', style: GoogleFonts.poppins()),
          backgroundColor: const Color(0xFFEF4444),
        ),
      );
      return;
    }
    if (_departureDate == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Please select a departure date', style: GoogleFonts.poppins()),
          backgroundColor: const Color(0xFFEF4444),
        ),
      );
      return;
    }

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Trip posted successfully! 🎉', style: GoogleFonts.poppins()),
        backgroundColor: const Color(0xFF10B981),
        duration: const Duration(seconds: 2),
      ),
    );
    Future.delayed(const Duration(milliseconds: 500), () {
      if (mounted) context.go('/traveler/my-trips');
    });
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
          'Create Trip',
          style: GoogleFonts.poppins(
            fontSize: 18,
            fontWeight: FontWeight.w600,
            color: const Color(0xFF1A1A2E),
          ),
        ),
        centerTitle: true,
      ),
      body: Form(
        key: _formKey,
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildSection(
                'Route Details',
                Column(
                  children: [
                    _buildDropdown('From City', _fromCity, (val) => setState(() => _fromCity = val)),
                    const SizedBox(height: 12),
                    _buildDropdown('To City', _toCity, (val) => setState(() => _toCity = val)),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              _buildSection(
                'Travel Details',
                Column(
                  children: [
                    _buildTapField(
                      'Departure Date',
                      _departureDate == null
                          ? 'Select date'
                          : DateFormat('MMM d, yyyy').format(_departureDate!),
                      Icons.calendar_today,
                      _pickDate,
                    ),
                    const SizedBox(height: 12),
                    _buildTapField(
                      'Departure Time',
                      _departureTime == null
                          ? 'Select time'
                          : _departureTime!.format(context),
                      Icons.access_time,
                      _pickTime,
                    ),
                    const SizedBox(height: 16),
                    Align(
                      alignment: Alignment.centerLeft,
                      child: Text(
                        'Vehicle Type',
                        style: GoogleFonts.poppins(
                          fontSize: 13,
                          fontWeight: FontWeight.w500,
                          color: const Color(0xFF6B7280),
                        ),
                      ),
                    ),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: _vehicleTypes.map((v) {
                        final selected = _vehicleType == v;
                        return GestureDetector(
                          onTap: () => setState(() => _vehicleType = v),
                          child: AnimatedContainer(
                            duration: const Duration(milliseconds: 200),
                            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                            decoration: BoxDecoration(
                              color: selected ? const Color(0xFF6C63FF) : Colors.white,
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(
                                color: selected ? const Color(0xFF6C63FF) : const Color(0xFFE5E7EB),
                              ),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Icon(
                                  _vehicleIcon(v),
                                  size: 16,
                                  color: selected ? Colors.white : const Color(0xFF6B7280),
                                ),
                                const SizedBox(width: 6),
                                Text(
                                  v,
                                  style: GoogleFonts.poppins(
                                    fontSize: 13,
                                    fontWeight: FontWeight.w500,
                                    color: selected ? Colors.white : const Color(0xFF1A1A2E),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              _buildSection(
                'Parcel Capacity',
                Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Available Weight',
                          style: GoogleFonts.poppins(fontSize: 13, color: const Color(0xFF6B7280)),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                          decoration: BoxDecoration(
                            color: const Color(0xFF6C63FF).withOpacity(0.1),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            '${_availableWeight.toStringAsFixed(0)} kg',
                            style: GoogleFonts.poppins(
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                              color: const Color(0xFF6C63FF),
                            ),
                          ),
                        ),
                      ],
                    ),
                    Slider(
                      value: _availableWeight,
                      min: 1,
                      max: 30,
                      divisions: 29,
                      activeColor: const Color(0xFF6C63FF),
                      inactiveColor: const Color(0xFFE5E7EB),
                      onChanged: (v) => setState(() => _availableWeight = v),
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('1 kg', style: GoogleFonts.poppins(fontSize: 11, color: const Color(0xFF9CA3AF))),
                        Text('30 kg', style: GoogleFonts.poppins(fontSize: 11, color: const Color(0xFF9CA3AF))),
                      ],
                    ),
                    const SizedBox(height: 12),
                    TextFormField(
                      controller: _priceController,
                      keyboardType: TextInputType.number,
                      style: GoogleFonts.poppins(fontSize: 14, color: const Color(0xFF1A1A2E)),
                      decoration: InputDecoration(
                        labelText: 'Price per kg',
                        labelStyle: GoogleFonts.poppins(color: const Color(0xFF6B7280), fontSize: 13),
                        prefixText: '₹ ',
                        prefixStyle: GoogleFonts.poppins(color: const Color(0xFF1A1A2E), fontWeight: FontWeight.w500),
                        filled: true,
                        fillColor: const Color(0xFFF3F4F6),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: BorderSide.none,
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: const BorderSide(color: Color(0xFF6C63FF), width: 1.5),
                        ),
                      ),
                      validator: (v) {
                        if (v == null || v.isEmpty) return 'Enter price per kg';
                        if (double.tryParse(v) == null) return 'Enter a valid number';
                        return null;
                      },
                    ),
                    const SizedBox(height: 12),
                    TextFormField(
                      controller: _notesController,
                      maxLines: 3,
                      style: GoogleFonts.poppins(fontSize: 14, color: const Color(0xFF1A1A2E)),
                      decoration: InputDecoration(
                        labelText: 'Additional Notes (optional)',
                        labelStyle: GoogleFonts.poppins(color: const Color(0xFF6B7280), fontSize: 13),
                        filled: true,
                        fillColor: const Color(0xFFF3F4F6),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: BorderSide.none,
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                          borderSide: const BorderSide(color: Color(0xFF6C63FF), width: 1.5),
                        ),
                        hintText: 'e.g., No fragile items, prefer documents...',
                        hintStyle: GoogleFonts.poppins(fontSize: 13, color: const Color(0xFF9CA3AF)),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              _buildPreviewCard(),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  onPressed: _submit,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF6C63FF),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    elevation: 0,
                  ),
                  child: Text(
                    'Post Trip',
                    style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w600),
                  ),
                ),
              ),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSection(String title, Widget content) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: GoogleFonts.poppins(
              fontSize: 15,
              fontWeight: FontWeight.w600,
              color: const Color(0xFF1A1A2E),
            ),
          ),
          const SizedBox(height: 14),
          content,
        ],
      ),
    );
  }

  Widget _buildDropdown(String label, String? value, ValueChanged<String?> onChanged) {
    return DropdownButtonFormField<String>(
      value: value,
      onChanged: onChanged,
      style: GoogleFonts.poppins(fontSize: 14, color: const Color(0xFF1A1A2E)),
      decoration: InputDecoration(
        labelText: label,
        labelStyle: GoogleFonts.poppins(color: const Color(0xFF6B7280), fontSize: 13),
        filled: true,
        fillColor: const Color(0xFFF3F4F6),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Color(0xFF6C63FF), width: 1.5),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      ),
      items: _cities.map((c) => DropdownMenuItem(value: c, child: Text(c, style: GoogleFonts.poppins(fontSize: 14)))).toList(),
      validator: (v) => v == null ? 'Please select a city' : null,
    );
  }

  Widget _buildTapField(String label, String value, IconData icon, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        decoration: BoxDecoration(
          color: const Color(0xFFF3F4F6),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(label, style: GoogleFonts.poppins(fontSize: 11, color: const Color(0xFF6B7280))),
                  const SizedBox(height: 2),
                  Text(
                    value,
                    style: GoogleFonts.poppins(
                      fontSize: 14,
                      color: value.contains('Select') ? const Color(0xFF9CA3AF) : const Color(0xFF1A1A2E),
                    ),
                  ),
                ],
              ),
            ),
            Icon(icon, size: 18, color: const Color(0xFF6C63FF)),
          ],
        ),
      ),
    );
  }

  Widget _buildPreviewCard() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF6C63FF), Color(0xFF3F37C9)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Trip Preview',
            style: GoogleFonts.poppins(
              fontSize: 14,
              fontWeight: FontWeight.w600,
              color: Colors.white.withOpacity(0.8),
            ),
          ),
          const SizedBox(height: 10),
          Row(
            children: [
              Text(
                _fromCity ?? '---',
                style: GoogleFonts.poppins(
                  fontSize: 20,
                  fontWeight: FontWeight.w700,
                  color: Colors.white,
                ),
              ),
              const Padding(
                padding: EdgeInsets.symmetric(horizontal: 8),
                child: Icon(Icons.arrow_forward, color: Colors.white, size: 20),
              ),
              Text(
                _toCity ?? '---',
                style: GoogleFonts.poppins(
                  fontSize: 20,
                  fontWeight: FontWeight.w700,
                  color: Colors.white,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              Icon(Icons.calendar_today, size: 14, color: Colors.white.withOpacity(0.8)),
              const SizedBox(width: 4),
              Text(
                _departureDate == null ? 'Date not selected' : DateFormat('MMM d, yyyy').format(_departureDate!),
                style: GoogleFonts.poppins(fontSize: 12, color: Colors.white.withOpacity(0.8)),
              ),
              const SizedBox(width: 12),
              if (_departureTime != null) ...[
                Icon(Icons.access_time, size: 14, color: Colors.white.withOpacity(0.8)),
                const SizedBox(width: 4),
                Text(
                  _departureTime!.format(context),
                  style: GoogleFonts.poppins(fontSize: 12, color: Colors.white.withOpacity(0.8)),
                ),
              ],
            ],
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              Icon(_vehicleIcon(_vehicleType), size: 14, color: Colors.white.withOpacity(0.8)),
              const SizedBox(width: 4),
              Text(_vehicleType, style: GoogleFonts.poppins(fontSize: 12, color: Colors.white.withOpacity(0.8))),
              const SizedBox(width: 12),
              Icon(Icons.scale, size: 14, color: Colors.white.withOpacity(0.8)),
              const SizedBox(width: 4),
              Text('${_availableWeight.toStringAsFixed(0)} kg available', style: GoogleFonts.poppins(fontSize: 12, color: Colors.white.withOpacity(0.8))),
              const Spacer(),
              if (_priceController.text.isNotEmpty)
                Text(
                  '₹${_priceController.text}/kg',
                  style: GoogleFonts.poppins(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                    color: Colors.white,
                  ),
                ),
            ],
          ),
        ],
      ),
    );
  }

  IconData _vehicleIcon(String type) {
    switch (type) {
      case 'Car': return Icons.directions_car;
      case 'Train': return Icons.train;
      case 'Bus': return Icons.directions_bus;
      case 'Bike': return Icons.two_wheeler;
      case 'Flight': return Icons.flight;
      default: return Icons.directions_car;
    }
  }
}
