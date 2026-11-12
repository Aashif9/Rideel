class UserModel {
  final String id;
  final String name;
  final String email;
  final String phone;
  final String role;
  final String? avatar;
  final double rating;
  final int totalDeliveries;
  final double walletBalance;
  final DateTime createdAt;

  UserModel({
    required this.id,
    required this.name,
    required this.email,
    required this.phone,
    required this.role,
    this.avatar,
    this.rating = 0.0,
    this.totalDeliveries = 0,
    this.walletBalance = 0.0,
    required this.createdAt,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      phone: json['phone'] ?? '',
      role: json['role'] ?? '',
      avatar: json['avatar'],
      rating: (json['rating'] ?? 0.0).toDouble(),
      totalDeliveries: json['totalDeliveries'] ?? 0,
      walletBalance: (json['walletBalance'] ?? 0.0).toDouble(),
      createdAt: DateTime.tryParse(json['createdAt'] ?? '') ?? DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'phone': phone,
      'role': role,
      'avatar': avatar,
      'rating': rating,
      'totalDeliveries': totalDeliveries,
      'walletBalance': walletBalance,
      'createdAt': createdAt.toIso8601String(),
    };
  }

  UserModel copyWith({
    String? id,
    String? name,
    String? email,
    String? phone,
    String? role,
    String? avatar,
    double? rating,
    int? totalDeliveries,
    double? walletBalance,
    DateTime? createdAt,
  }) {
    return UserModel(
      id: id ?? this.id,
      name: name ?? this.name,
      email: email ?? this.email,
      phone: phone ?? this.phone,
      role: role ?? this.role,
      avatar: avatar ?? this.avatar,
      rating: rating ?? this.rating,
      totalDeliveries: totalDeliveries ?? this.totalDeliveries,
      walletBalance: walletBalance ?? this.walletBalance,
      createdAt: createdAt ?? this.createdAt,
    );
  }
}
