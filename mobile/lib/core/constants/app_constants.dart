class AppConstants {
  static const String appName = 'Rideel';
  static const String appVersion = '1.0.0';
  static const String demoOtp = '1234';
  static const String baseUrl = 'http://10.0.2.2:5000/api';

  // SharedPreferences keys
  static const String keyIsLoggedIn = 'is_logged_in';
  static const String keyUserRole = 'user_role';
  static const String keyUserId = 'user_id';
  static const String keyUserPhone = 'user_phone';
  static const String keyAuthToken = 'auth_token';

  // Cities
  static const List<String> indianCities = [
    'Mumbai',
    'Pune',
    'Delhi',
    'Bangalore',
    'Chennai',
    'Hyderabad',
    'Kolkata',
    'Jaipur',
  ];

  // Delivery statuses
  static const String statusPending = 'pending';
  static const String statusAccepted = 'accepted';
  static const String statusPickedUp = 'picked_up';
  static const String statusInTransit = 'in_transit';
  static const String statusDelivered = 'delivered';

  // Roles
  static const String roleSender = 'sender';
  static const String roleTraveler = 'traveler';
}
