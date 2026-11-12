import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

const Color _primary = Color(0xFF6C63FF);
const Color _background = Color(0xFFF8F9FE);
const Color _textPrimary = Color(0xFF1A1A2E);
const Color _textSecondary = Color(0xFF6B7280);

class CreateParcelScreen extends StatefulWidget {
  const CreateParcelScreen({super.key});

  @override
  State<CreateParcelScreen> createState() => _CreateParcelScreenState();
}

class _CreateParcelScreenState extends State<CreateParcelScreen> {
  final _formKey = GlobalKey<FormState>();

  final List<String> _cities = [
    'Mumbai', 'Pune', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Jaipur', 'Kolkata'
  ];

  String? _pickupCity;
  String? _destinationCity;
  final _pickupAddressCtrl = TextEditingController();
  final _destAddressCtrl = TextEditingController();
  final _descCtrl = TextEditingController();
  final _valueCtrl = TextEditingController();
  String _selectedCategory = 'Documents';
  double _weight = 2.0;

  final List<String> _categories = [
    'Documents', 'Electronics', 'Clothing', 'Food', 'Medicine', 'Other'
  ];

  @override
  void dispose() {
    _pickupAddressCtrl.dispose();
    _destAddressCtrl.dispose();
    _descCtrl.dispose();
    _valueCtrl.dispose();
    super.dispose();
  }

  void _findTravelers() {
    if (_formKey.currentState!.validate()) {
      if (_pickupCity == null || _destinationCity == null) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Please select pickup and destination cities')),
        );
        return;
      }
      if (_pickupCity == _destinationCity) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Pickup and destination cities cannot be the same')),
        );
        return;
      }
      context.go('/sender/available-travelers', extra: {
        'from': _pickupCity,
        'to': _destinationCity,
        'weight': _weight,
        'desc': _descCtrl.text,
        'category': _selectedCategory,
      });
    }
  }

  InputDecoration _inputDecoration(String label, {String? hint, IconData? icon}) {
    return InputDecoration(
      labelText: label,
      hintText: hint,
      prefixIcon: icon != null ? Icon(icon, color: _textSecondary) : null,
      labelStyle: GoogleFonts.poppins(color: _textSecondary, fontSize: 14),
      hintStyle: GoogleFonts.poppins(color: _textSecondary.withOpacity(0.6), fontSize: 13),
      filled: true,
      fillColor: Colors.white,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: Color(0xFFE5E7EB)),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: Color(0xFFE5E7EB)),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: _primary, width: 2),
      ),
      errorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: Colors.red),
      ),
    );
  }

  Widget _sectionLabel(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Text(
        text,
        style: GoogleFonts.poppins(
          fontSize: 15,
          fontWeight: FontWeight.w600,
          color: _textPrimary,
        ),
      ),
    );
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
          onPressed: () => context.go('/sender/dashboard'),
        ),
        title: Text(
          'Create Parcel',
          style: GoogleFonts.poppins(
            fontSize: 20,
            fontWeight: FontWeight.w700,
            color: _textPrimary,
          ),
        ),
      ),
      body: Form(
        key: _formKey,
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Step indicator
              _buildStepIndicator(),
              const SizedBox(height: 24),

              // Route Section
              Container(
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
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: _primary.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: const Icon(Icons.route, color: _primary, size: 20),
                        ),
                        const SizedBox(width: 10),
                        Text(
                          'Route Details',
                          style: GoogleFonts.poppins(
                            fontSize: 16,
                            fontWeight: FontWeight.w700,
                            color: _textPrimary,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    _sectionLabel('Pickup City'),
                    DropdownButtonFormField<String>(
                      value: _pickupCity,
                      decoration: _inputDecoration('Select pickup city', icon: Icons.location_on_outlined),
                      style: GoogleFonts.poppins(fontSize: 14, color: _textPrimary),
                      items: _cities.map((c) => DropdownMenuItem(value: c, child: Text(c))).toList(),
                      onChanged: (v) => setState(() => _pickupCity = v),
                      validator: (v) => v == null ? 'Please select pickup city' : null,
                    ),
                    const SizedBox(height: 16),
                    _sectionLabel('Destination City'),
                    DropdownButtonFormField<String>(
                      value: _destinationCity,
                      decoration: _inputDecoration('Select destination city', icon: Icons.flag_outlined),
                      style: GoogleFonts.poppins(fontSize: 14, color: _textPrimary),
                      items: _cities.map((c) => DropdownMenuItem(value: c, child: Text(c))).toList(),
                      onChanged: (v) => setState(() => _destinationCity = v),
                      validator: (v) => v == null ? 'Please select destination city' : null,
                    ),
                    const SizedBox(height: 16),
                    _sectionLabel('Pickup Address'),
                    TextFormField(
                      controller: _pickupAddressCtrl,
                      decoration: _inputDecoration('Enter pickup address', icon: Icons.home_outlined),
                      style: GoogleFonts.poppins(fontSize: 14),
                      validator: (v) => (v == null || v.isEmpty) ? 'Please enter pickup address' : null,
                    ),
                    const SizedBox(height: 16),
                    _sectionLabel('Destination Address'),
                    TextFormField(
                      controller: _destAddressCtrl,
                      decoration: _inputDecoration('Enter destination address', icon: Icons.location_city_outlined),
                      style: GoogleFonts.poppins(fontSize: 14),
                      validator: (v) => (v == null || v.isEmpty) ? 'Please enter destination address' : null,
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // Parcel Details Section
              Container(
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
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: _primary.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: const Icon(Icons.inventory_2_outlined, color: _primary, size: 20),
                        ),
                        const SizedBox(width: 10),
                        Text(
                          'Parcel Details',
                          style: GoogleFonts.poppins(
                            fontSize: 16,
                            fontWeight: FontWeight.w700,
                            color: _textPrimary,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    _sectionLabel('Parcel Description'),
                    TextFormField(
                      controller: _descCtrl,
                      decoration: _inputDecoration('What are you sending?', icon: Icons.description_outlined),
                      style: GoogleFonts.poppins(fontSize: 14),
                      maxLines: 2,
                      validator: (v) => (v == null || v.isEmpty) ? 'Please describe the parcel' : null,
                    ),
                    const SizedBox(height: 16),
                    _sectionLabel('Category'),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: _categories.map((cat) {
                        final selected = _selectedCategory == cat;
                        return GestureDetector(
                          onTap: () => setState(() => _selectedCategory = cat),
                          child: AnimatedContainer(
                            duration: const Duration(milliseconds: 200),
                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                            decoration: BoxDecoration(
                              color: selected ? _primary : _primary.withOpacity(0.08),
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(
                                color: selected ? _primary : _primary.withOpacity(0.3),
                              ),
                            ),
                            child: Text(
                              cat,
                              style: GoogleFonts.poppins(
                                fontSize: 13,
                                fontWeight: FontWeight.w600,
                                color: selected ? Colors.white : _primary,
                              ),
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                    const SizedBox(height: 20),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        _sectionLabel('Weight'),
                        Text(
                          '${_weight.toStringAsFixed(1)} kg',
                          style: GoogleFonts.poppins(
                            fontSize: 15,
                            fontWeight: FontWeight.w700,
                            color: _primary,
                          ),
                        ),
                      ],
                    ),
                    SliderTheme(
                      data: SliderTheme.of(context).copyWith(
                        activeTrackColor: _primary,
                        inactiveTrackColor: _primary.withOpacity(0.2),
                        thumbColor: _primary,
                        overlayColor: _primary.withOpacity(0.1),
                        valueIndicatorColor: _primary,
                        valueIndicatorTextStyle: GoogleFonts.poppins(color: Colors.white),
                      ),
                      child: Slider(
                        value: _weight,
                        min: 0.5,
                        max: 20.0,
                        divisions: 39,
                        label: '${_weight.toStringAsFixed(1)} kg',
                        onChanged: (v) => setState(() => _weight = v),
                      ),
                    ),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('0.5 kg', style: GoogleFonts.poppins(fontSize: 11, color: _textSecondary)),
                        Text('20 kg', style: GoogleFonts.poppins(fontSize: 11, color: _textSecondary)),
                      ],
                    ),
                    const SizedBox(height: 16),
                    _sectionLabel('Estimated Value (₹)'),
                    TextFormField(
                      controller: _valueCtrl,
                      decoration: _inputDecoration('Enter parcel value', icon: Icons.currency_rupee),
                      keyboardType: TextInputType.number,
                      style: GoogleFonts.poppins(fontSize: 14),
                      validator: (v) => (v == null || v.isEmpty) ? 'Please enter estimated value' : null,
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // Find Travelers Button
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _findTravelers,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: _primary,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    elevation: 0,
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.search, size: 20),
                      const SizedBox(width: 8),
                      Text(
                        'Find Travelers',
                        style: GoogleFonts.poppins(
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ],
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

  Widget _buildStepIndicator() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: _primary.withOpacity(0.08),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          _stepDot(1, 'Route', true),
          _stepLine(true),
          _stepDot(2, 'Parcel', true),
          _stepLine(true),
          _stepDot(3, 'Confirm', false),
        ],
      ),
    );
  }

  Widget _stepDot(int number, String label, bool active) {
    return Column(
      children: [
        Container(
          width: 28,
          height: 28,
          decoration: BoxDecoration(
            color: active ? _primary : _textSecondary.withOpacity(0.3),
            shape: BoxShape.circle,
          ),
          child: Center(
            child: Text(
              '$number',
              style: GoogleFonts.poppins(
                fontSize: 13,
                fontWeight: FontWeight.w700,
                color: Colors.white,
              ),
            ),
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: GoogleFonts.poppins(
            fontSize: 11,
            fontWeight: FontWeight.w600,
            color: active ? _primary : _textSecondary,
          ),
        ),
      ],
    );
  }

  Widget _stepLine(bool active) {
    return Expanded(
      child: Container(
        height: 2,
        margin: const EdgeInsets.only(bottom: 20, left: 4, right: 4),
        color: active ? _primary.withOpacity(0.4) : _textSecondary.withOpacity(0.2),
      ),
    );
  }
}
