import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user_model.dart';

class AuthProvider extends ChangeNotifier {
  UserModel? currentUser;
  bool isLoggedIn = false;
  String userRole = '';
  bool isLoading = false;

  Future<void> init() async {
    final prefs = await SharedPreferences.getInstance();
    isLoggedIn = prefs.getBool('is_logged_in') ?? false;
    userRole = prefs.getString('user_role') ?? '';
    final userId = prefs.getString('user_id') ?? '';
    final userPhone = prefs.getString('user_phone') ?? '';
    if (isLoggedIn && userId.isNotEmpty) {
      currentUser = UserModel(
        id: userId,
        name: 'Aashi Gupta',
        email: 'aashi@example.com',
        phone: userPhone,
        role: userRole,
        rating: 4.8,
        totalDeliveries: 15,
        walletBalance: 650.0,
        createdAt: DateTime.now(),
      );
    }
    notifyListeners();
  }

  Future<bool> login(String phone) async {
    isLoading = true;
    notifyListeners();
    await Future.delayed(const Duration(milliseconds: 1500));
    isLoading = false;
    notifyListeners();
    return true;
  }

  Future<bool> verifyOtp(String phone, String otp) async {
    isLoading = true;
    notifyListeners();
    await Future.delayed(const Duration(milliseconds: 1000));
    isLoading = false;
    if (otp == '1234') {
      isLoggedIn = true;
      currentUser = UserModel(
        id: 'u1',
        name: 'Aashi Gupta',
        email: 'aashi@example.com',
        phone: phone,
        role: userRole,
        rating: 4.8,
        totalDeliveries: 15,
        walletBalance: 650.0,
        createdAt: DateTime.now(),
      );
      final prefs = await SharedPreferences.getInstance();
      await prefs.setBool('is_logged_in', true);
      await prefs.setString('user_id', 'u1');
      await prefs.setString('user_phone', phone);
      notifyListeners();
      return true;
    }
    notifyListeners();
    return false;
  }

  Future<void> setRole(String role) async {
    userRole = role;
    if (currentUser != null) {
      currentUser = currentUser!.copyWith(role: role);
    }
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('user_role', role);
    notifyListeners();
  }

  Future<void> logout() async {
    isLoggedIn = false;
    userRole = '';
    currentUser = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('is_logged_in');
    await prefs.remove('user_role');
    await prefs.remove('user_id');
    await prefs.remove('user_phone');
    notifyListeners();
  }
}
