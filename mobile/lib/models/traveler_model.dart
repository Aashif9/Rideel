class TravelerModel {
  final String id;
  final String name;
  final String phone;
  final String? avatar;
  final double rating;
  final int totalTrips;
  final String vehicleType;
  final bool verified;
  final String departureCity;
  final String destinationCity;
  final DateTime departureDate;
  final double availableWeight;
  final double pricePerKg;

  TravelerModel({
    required this.id,
    required this.name,
    required this.phone,
    this.avatar,
    this.rating = 0.0,
    this.totalTrips = 0,
    required this.vehicleType,
    this.verified = false,
    required this.departureCity,
    required this.destinationCity,
    required this.departureDate,
    required this.availableWeight,
    required this.pricePerKg,
  });

  factory TravelerModel.fromJson(Map<String, dynamic> json) {
    return TravelerModel(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      phone: json['phone'] ?? '',
      avatar: json['avatar'],
      rating: (json['rating'] ?? 0.0).toDouble(),
      totalTrips: json['totalTrips'] ?? 0,
      vehicleType: json['vehicleType'] ?? '',
      verified: json['verified'] ?? false,
      departureCity: json['departureCity'] ?? '',
      destinationCity: json['destinationCity'] ?? '',
      departureDate:
          DateTime.tryParse(json['departureDate'] ?? '') ?? DateTime.now(),
      availableWeight: (json['availableWeight'] ?? 0.0).toDouble(),
      pricePerKg: (json['pricePerKg'] ?? 0.0).toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'phone': phone,
      'avatar': avatar,
      'rating': rating,
      'totalTrips': totalTrips,
      'vehicleType': vehicleType,
      'verified': verified,
      'departureCity': departureCity,
      'destinationCity': destinationCity,
      'departureDate': departureDate.toIso8601String(),
      'availableWeight': availableWeight,
      'pricePerKg': pricePerKg,
    };
  }
}
