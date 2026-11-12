import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:rideel/providers/auth_provider.dart';
import 'dart:async';

class OtpScreen extends StatefulWidget {
  final String phone;

  const OtpScreen({super.key, required this.phone});

  @override
  State<OtpScreen> createState() => _OtpScreenState();
}

class _OtpScreenState extends State<OtpScreen> {
  final List<TextEditingController> _controllers =
      List.generate(4, (_) => TextEditingController());
  final List<FocusNode> _focusNodes = List.generate(4, (_) => FocusNode());

  bool _isLoading = false;
  bool _hasError = false;
  String _errorMessage = '';

  int _resendSeconds = 60;
  Timer? _resendTimer;

  @override
  void initState() {
    super.initState();
    _startResendTimer();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _focusNodes[0].requestFocus();
    });
  }

  void _startResendTimer() {
    _resendTimer?.cancel();
    setState(() => _resendSeconds = 60);
    _resendTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_resendSeconds == 0) {
        timer.cancel();
      } else {
        if (mounted) setState(() => _resendSeconds--);
      }
    });
  }

  @override
  void dispose() {
    for (final c in _controllers) {
      c.dispose();
    }
    for (final f in _focusNodes) {
      f.dispose();
    }
    _resendTimer?.cancel();
    super.dispose();
  }

  String get _otp => _controllers.map((c) => c.text).join();

  void _onDigitChanged(int index, String value) {
    if (value.length == 1) {
      if (index < 3) {
        _focusNodes[index + 1].requestFocus();
      } else {
        _focusNodes[index].unfocus();
      }
    } else if (value.isEmpty && index > 0) {
      _focusNodes[index - 1].requestFocus();
    }
    setState(() {
      _hasError = false;
      _errorMessage = '';
    });
  }

  Future<void> _verifyOtp() async {
    if (_otp.length < 4) {
      setState(() {
        _hasError = true;
        _errorMessage = 'Please enter all 4 digits';
      });
      return;
    }

    setState(() => _isLoading = true);

    try {
      final authProvider = context.read<AuthProvider>();
      final success = await authProvider.verifyOtp(widget.phone, _otp);
      if (!mounted) return;

      if (success) {
        context.go('/role-selection');
      } else {
        setState(() {
          _hasError = true;
          _errorMessage = 'Invalid OTP. Please try again.';
        });
        // Clear fields
        for (final c in _controllers) {
          c.clear();
        }
        _focusNodes[0].requestFocus();
      }
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _hasError = true;
        _errorMessage = 'Something went wrong. Please try again.';
      });
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  void _resendOtp() {
    if (_resendSeconds > 0) return;
    for (final c in _controllers) {
      c.clear();
    }
    _focusNodes[0].requestFocus();
    _startResendTimer();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          'OTP resent! (Demo OTP: 1234)',
          style: GoogleFonts.poppins(fontSize: 14),
        ),
        backgroundColor: const Color(0xFF10B981),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      ),
    );
  }

  String _maskedPhone(String phone) {
    if (phone.length < 4) return phone;
    return phone.replaceRange(0, phone.length - 4, 'X' * (phone.length - 4));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FE),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_rounded,
              color: Color(0xFF1A1A2E)),
          onPressed: () {
            if (context.canPop()) {
              context.pop();
            } else {
              context.go('/login');
            }
          },
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 20),

                // Icon
                Container(
                  width: 64,
                  height: 64,
                  decoration: BoxDecoration(
                    color: const Color(0xFFEDE9FF),
                    borderRadius: BorderRadius.circular(18),
                  ),
                  child: const Icon(
                    Icons.sms_rounded,
                    size: 32,
                    color: Color(0xFF6C63FF),
                  ),
                ),

                const SizedBox(height: 24),

                Text(
                  'Enter OTP',
                  style: GoogleFonts.poppins(
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                    color: const Color(0xFF1A1A2E),
                  ),
                ),
                const SizedBox(height: 8),
                RichText(
                  text: TextSpan(
                    style: GoogleFonts.poppins(
                      fontSize: 15,
                      color: const Color(0xFF6B7280),
                    ),
                    children: [
                      const TextSpan(text: 'We sent a 4-digit OTP to\n'),
                      TextSpan(
                        text: '+91 ${_maskedPhone(widget.phone)}',
                        style: GoogleFonts.poppins(
                          fontWeight: FontWeight.w600,
                          color: const Color(0xFF1A1A2E),
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 40),

                // OTP input boxes
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: List.generate(4, (index) {
                    return _OtpBox(
                      controller: _controllers[index],
                      focusNode: _focusNodes[index],
                      hasError: _hasError,
                      onChanged: (value) => _onDigitChanged(index, value),
                      onKeyEvent: (event) {
                        if (event is KeyDownEvent &&
                            event.logicalKey == LogicalKeyboardKey.backspace &&
                            _controllers[index].text.isEmpty &&
                            index > 0) {
                          _focusNodes[index - 1].requestFocus();
                        }
                      },
                    );
                  }),
                ),

                // Error message
                if (_hasError) ...[
                  const SizedBox(height: 12),
                  Text(
                    _errorMessage,
                    style: GoogleFonts.poppins(
                      fontSize: 13,
                      color: const Color(0xFFEF4444),
                    ),
                  ),
                ],

                const SizedBox(height: 32),

                // Verify button
                SizedBox(
                  width: double.infinity,
                  height: 56,
                  child: ElevatedButton(
                    onPressed: _isLoading ? null : _verifyOtp,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF6C63FF),
                      foregroundColor: Colors.white,
                      disabledBackgroundColor:
                          const Color(0xFF6C63FF).withOpacity(0.6),
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
                            'Verify OTP',
                            style: GoogleFonts.poppins(
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                  ),
                ),

                const SizedBox(height: 24),

                // Resend OTP
                Center(
                  child: GestureDetector(
                    onTap: _resendSeconds == 0 ? _resendOtp : null,
                    child: RichText(
                      text: TextSpan(
                        style: GoogleFonts.poppins(
                          fontSize: 14,
                          color: const Color(0xFF6B7280),
                        ),
                        children: [
                          const TextSpan(text: "Didn't receive the OTP? "),
                          if (_resendSeconds > 0)
                            TextSpan(
                              text: 'Resend in ${_resendSeconds}s',
                              style: GoogleFonts.poppins(
                                fontWeight: FontWeight.w600,
                                color: const Color(0xFF9CA3AF),
                              ),
                            )
                          else
                            TextSpan(
                              text: 'Resend OTP',
                              style: GoogleFonts.poppins(
                                fontWeight: FontWeight.w600,
                                color: const Color(0xFF6C63FF),
                                decoration: TextDecoration.underline,
                                decorationColor: const Color(0xFF6C63FF),
                              ),
                            ),
                        ],
                      ),
                    ),
                  ),
                ),

                const SizedBox(height: 20),

                // Demo hint
                Center(
                  child: Text(
                    'Demo OTP: 1234',
                    style: GoogleFonts.poppins(
                      fontSize: 13,
                      color: const Color(0xFF9CA3AF),
                      fontStyle: FontStyle.italic,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _OtpBox extends StatelessWidget {
  final TextEditingController controller;
  final FocusNode focusNode;
  final bool hasError;
  final ValueChanged<String> onChanged;
  final Function(KeyEvent) onKeyEvent;

  const _OtpBox({
    required this.controller,
    required this.focusNode,
    required this.hasError,
    required this.onChanged,
    required this.onKeyEvent,
  });

  @override
  Widget build(BuildContext context) {
    return KeyboardListener(
      focusNode: FocusNode(),
      onKeyEvent: onKeyEvent,
      child: SizedBox(
        width: 64,
        height: 64,
        child: TextField(
          controller: controller,
          focusNode: focusNode,
          keyboardType: TextInputType.number,
          textAlign: TextAlign.center,
          maxLength: 1,
          inputFormatters: [FilteringTextInputFormatter.digitsOnly],
          style: GoogleFonts.poppins(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: const Color(0xFF1A1A2E),
          ),
          decoration: InputDecoration(
            counterText: '',
            filled: true,
            fillColor: Colors.white,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(
                color:
                    hasError ? const Color(0xFFEF4444) : const Color(0xFFE5E7EB),
              ),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(
                color:
                    hasError ? const Color(0xFFEF4444) : const Color(0xFFE5E7EB),
              ),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide(
                color: hasError
                    ? const Color(0xFFEF4444)
                    : const Color(0xFF6C63FF),
                width: 2,
              ),
            ),
          ),
          onChanged: onChanged,
        ),
      ),
    );
  }
}
