class Validators {
  static String? validatePhone(String? value) {
    if (value == null || value.isEmpty) {
      return 'Phone number is required';
    }
    final cleaned = value.replaceAll(RegExp(r'\s+'), '');
    if (!RegExp(r'^\+?[0-9]{10,13}$').hasMatch(cleaned)) {
      return 'Enter a valid phone number';
    }
    return null;
  }

  static String? validateOtp(String? value) {
    if (value == null || value.isEmpty) {
      return 'OTP is required';
    }
    if (value.length != 4) {
      return 'OTP must be 4 digits';
    }
    if (!RegExp(r'^[0-9]{4}$').hasMatch(value)) {
      return 'OTP must contain only digits';
    }
    return null;
  }

  static String? validateName(String? value) {
    if (value == null || value.isEmpty) {
      return 'Name is required';
    }
    if (value.trim().length < 2) {
      return 'Name must be at least 2 characters';
    }
    return null;
  }

  static String? validateEmail(String? value) {
    if (value == null || value.isEmpty) {
      return 'Email is required';
    }
    if (!RegExp(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
        .hasMatch(value)) {
      return 'Enter a valid email address';
    }
    return null;
  }

  static String? validateRequired(String? value, [String field = 'Field']) {
    if (value == null || value.trim().isEmpty) {
      return '$field is required';
    }
    return null;
  }

  static String? validateWeight(String? value) {
    if (value == null || value.isEmpty) {
      return 'Weight is required';
    }
    final weight = double.tryParse(value);
    if (weight == null) {
      return 'Enter a valid weight';
    }
    if (weight <= 0) {
      return 'Weight must be greater than 0';
    }
    if (weight > 50) {
      return 'Weight cannot exceed 50 kg';
    }
    return null;
  }

  static String? validatePrice(String? value) {
    if (value == null || value.isEmpty) {
      return 'Price is required';
    }
    final price = double.tryParse(value);
    if (price == null) {
      return 'Enter a valid price';
    }
    if (price <= 0) {
      return 'Price must be greater than 0';
    }
    return null;
  }
}
