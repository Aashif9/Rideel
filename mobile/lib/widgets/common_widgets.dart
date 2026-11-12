import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

const Color _primary = Color(0xFF6C63FF);
const Color _textPrimary = Color(0xFF1A1A2E);
const Color _textSecondary = Color(0xFF6B7280);
const Color _error = Color(0xFFEF4444);

// ─── RideelButton ─────────────────────────────────────────────────────────────
class RideelButton extends StatelessWidget {
  final String label;
  final VoidCallback? onPressed;
  final bool isLoading;
  final bool fullWidth;
  final double? width;
  final IconData? icon;

  const RideelButton({
    super.key,
    required this.label,
    this.onPressed,
    this.isLoading = false,
    this.fullWidth = true,
    this.width,
    this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: fullWidth ? double.infinity : width,
      height: 52,
      child: ElevatedButton(
        onPressed: isLoading ? null : onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: _primary,
          foregroundColor: Colors.white,
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
        ),
        child: isLoading
            ? const SizedBox(
                width: 24,
                height: 24,
                child: CircularProgressIndicator(
                  color: Colors.white,
                  strokeWidth: 2.5,
                ),
              )
            : Row(
                mainAxisAlignment: MainAxisAlignment.center,
                mainAxisSize: MainAxisSize.min,
                children: [
                  if (icon != null) ...[
                    Icon(icon, size: 20),
                    const SizedBox(width: 8),
                  ],
                  Text(
                    label,
                    style: GoogleFonts.poppins(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: Colors.white,
                    ),
                  ),
                ],
              ),
      ),
    );
  }
}

// ─── RideelOutlineButton ──────────────────────────────────────────────────────
class RideelOutlineButton extends StatelessWidget {
  final String label;
  final VoidCallback? onPressed;
  final bool fullWidth;
  final IconData? icon;
  final Color? color;

  const RideelOutlineButton({
    super.key,
    required this.label,
    this.onPressed,
    this.fullWidth = true,
    this.icon,
    this.color,
  });

  @override
  Widget build(BuildContext context) {
    final c = color ?? _primary;
    return SizedBox(
      width: fullWidth ? double.infinity : null,
      height: 52,
      child: OutlinedButton(
        onPressed: onPressed,
        style: OutlinedButton.styleFrom(
          foregroundColor: c,
          side: BorderSide(color: c, width: 1.5),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          mainAxisSize: MainAxisSize.min,
          children: [
            if (icon != null) ...[
              Icon(icon, size: 20, color: c),
              const SizedBox(width: 8),
            ],
            Text(
              label,
              style: GoogleFonts.poppins(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: c,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ─── RideelTextField ──────────────────────────────────────────────────────────
class RideelTextField extends StatelessWidget {
  final String? label;
  final String? hint;
  final IconData? prefixIcon;
  final Widget? suffix;
  final String? errorText;
  final bool obscureText;
  final TextInputType? keyboardType;
  final TextEditingController? controller;
  final String? Function(String?)? validator;
  final void Function(String)? onChanged;
  final int? maxLines;
  final bool enabled;
  final TextInputAction? textInputAction;

  const RideelTextField({
    super.key,
    this.label,
    this.hint,
    this.prefixIcon,
    this.suffix,
    this.errorText,
    this.obscureText = false,
    this.keyboardType,
    this.controller,
    this.validator,
    this.onChanged,
    this.maxLines = 1,
    this.enabled = true,
    this.textInputAction,
  });

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: controller,
      obscureText: obscureText,
      keyboardType: keyboardType,
      validator: validator,
      onChanged: onChanged,
      maxLines: maxLines,
      enabled: enabled,
      textInputAction: textInputAction,
      style: GoogleFonts.poppins(fontSize: 14, color: _textPrimary),
      decoration: InputDecoration(
        labelText: label,
        hintText: hint,
        errorText: errorText,
        prefixIcon: prefixIcon != null ? Icon(prefixIcon, color: _textSecondary, size: 20) : null,
        suffixIcon: suffix,
        filled: true,
        fillColor: const Color(0xFFF3F4F6),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: _primary, width: 1.5),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: _error, width: 1.5),
        ),
        hintStyle: GoogleFonts.poppins(fontSize: 14, color: const Color(0xFF9CA3AF)),
        labelStyle: GoogleFonts.poppins(fontSize: 14, color: _textSecondary),
      ),
    );
  }
}

// ─── RideelCard ───────────────────────────────────────────────────────────────
class RideelCard extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry? padding;
  final VoidCallback? onTap;
  final double borderRadius;

  const RideelCard({
    super.key,
    required this.child,
    this.padding,
    this.onTap,
    this.borderRadius = 16,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(borderRadius),
          boxShadow: const [
            BoxShadow(
              color: Color(0x0A000000),
              blurRadius: 8,
              offset: Offset(0, 2),
            ),
          ],
        ),
        child: Padding(
          padding: padding ?? const EdgeInsets.all(16),
          child: child,
        ),
      ),
    );
  }
}

// ─── StatusChip ───────────────────────────────────────────────────────────────
class StatusChip extends StatelessWidget {
  final String status;

  const StatusChip({super.key, required this.status});

  @override
  Widget build(BuildContext context) {
    Color bgColor;
    Color textColor;
    String label;
    IconData icon;

    switch (status.toLowerCase()) {
      case 'pending':
        bgColor = const Color(0xFFFFF3CD);
        textColor = const Color(0xFF856404);
        label = 'Pending';
        icon = Icons.schedule;
        break;
      case 'accepted':
        bgColor = const Color(0xFFD1FAE5);
        textColor = const Color(0xFF065F46);
        label = 'Accepted';
        icon = Icons.check_circle_outline;
        break;
      case 'picked_up':
        bgColor = const Color(0xFFDBEAFE);
        textColor = const Color(0xFF1E40AF);
        label = 'Picked Up';
        icon = Icons.inventory_2_outlined;
        break;
      case 'in_transit':
        bgColor = const Color(0xFFDBEAFE);
        textColor = const Color(0xFF1E40AF);
        label = 'In Transit';
        icon = Icons.local_shipping_outlined;
        break;
      case 'delivered':
        bgColor = const Color(0xFFF3F4F6);
        textColor = const Color(0xFF6B7280);
        label = 'Delivered';
        icon = Icons.done_all;
        break;
      case 'active':
        bgColor = const Color(0xFFD1FAE5);
        textColor = const Color(0xFF065F46);
        label = 'Active';
        icon = Icons.radio_button_checked;
        break;
      case 'completed':
        bgColor = const Color(0xFFF3F4F6);
        textColor = const Color(0xFF6B7280);
        label = 'Completed';
        icon = Icons.done_all;
        break;
      default:
        bgColor = const Color(0xFFF3F4F6);
        textColor = const Color(0xFF6B7280);
        label = status;
        icon = Icons.info_outline;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 12, color: textColor),
          const SizedBox(width: 4),
          Text(
            label,
            style: GoogleFonts.poppins(
              fontSize: 11,
              fontWeight: FontWeight.w600,
              color: textColor,
            ),
          ),
        ],
      ),
    );
  }
}

// ─── LoadingOverlay ───────────────────────────────────────────────────────────
class LoadingOverlay extends StatelessWidget {
  final bool isLoading;
  final Widget child;

  const LoadingOverlay({
    super.key,
    required this.isLoading,
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        child,
        if (isLoading)
          Container(
            color: Colors.black.withOpacity(0.3),
            child: const Center(
              child: CircularProgressIndicator(
                color: _primary,
              ),
            ),
          ),
      ],
    );
  }
}

// ─── EmptyState ───────────────────────────────────────────────────────────────
class EmptyState extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final String? buttonLabel;
  final VoidCallback? onButtonPressed;

  const EmptyState({
    super.key,
    required this.icon,
    required this.title,
    required this.subtitle,
    this.buttonLabel,
    this.onButtonPressed,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 100,
              height: 100,
              decoration: BoxDecoration(
                color: _primary.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, size: 48, color: _primary),
            ),
            const SizedBox(height: 20),
            Text(
              title,
              style: GoogleFonts.poppins(
                fontSize: 18,
                fontWeight: FontWeight.w600,
                color: _textPrimary,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            Text(
              subtitle,
              style: GoogleFonts.poppins(
                fontSize: 14,
                color: _textSecondary,
              ),
              textAlign: TextAlign.center,
            ),
            if (buttonLabel != null && onButtonPressed != null) ...[
              const SizedBox(height: 24),
              RideelButton(
                label: buttonLabel!,
                onPressed: onButtonPressed,
                fullWidth: false,
                width: 180,
              ),
            ],
          ],
        ),
      ),
    );
  }
}

// ─── SectionHeader ────────────────────────────────────────────────────────────
class SectionHeader extends StatelessWidget {
  final String title;
  final String? actionLabel;
  final VoidCallback? onAction;

  const SectionHeader({
    super.key,
    required this.title,
    this.actionLabel,
    this.onAction,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          title,
          style: GoogleFonts.poppins(
            fontSize: 16,
            fontWeight: FontWeight.w600,
            color: _textPrimary,
          ),
        ),
        if (actionLabel != null)
          TextButton(
            onPressed: onAction,
            child: Text(
              actionLabel!,
              style: GoogleFonts.poppins(
                fontSize: 13,
                fontWeight: FontWeight.w500,
                color: _primary,
              ),
            ),
          ),
      ],
    );
  }
}

// ─── RideelAppBar ─────────────────────────────────────────────────────────────
class RideelAppBar extends StatelessWidget implements PreferredSizeWidget {
  final String title;
  final bool showBack;
  final List<Widget>? actions;
  final VoidCallback? onBack;

  const RideelAppBar({
    super.key,
    required this.title,
    this.showBack = true,
    this.actions,
    this.onBack,
  });

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);

  @override
  Widget build(BuildContext context) {
    return AppBar(
      backgroundColor: Colors.white,
      elevation: 0,
      centerTitle: true,
      leading: showBack
          ? IconButton(
              icon: Container(
                width: 36,
                height: 36,
                decoration: BoxDecoration(
                  color: const Color(0xFFF3F4F6),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Icon(Icons.arrow_back_ios_new, size: 16, color: _textPrimary),
              ),
              onPressed: onBack ?? () => Navigator.of(context).pop(),
            )
          : null,
      title: Text(
        title,
        style: GoogleFonts.poppins(
          fontSize: 18,
          fontWeight: FontWeight.w600,
          color: _textPrimary,
        ),
      ),
      actions: actions,
    );
  }
}
