class ParcelModel {
  final String id;
  final String senderId;
  final String description;
  final double weight;
  final String category;
  final String status;
  final String pickupCity;
  final String destinationCity;
  final String pickupAddress;
  final String destinationAddress;
  final double estimatedPrice;
  final DateTime createdAt;
  final String? travelerId;

  ParcelModel({
    required this.id,
    required this.senderId,
    required this.description,
    required this.weight,
    required this.category,
    required this.status,
    required this.pickupCity,
    required this.destinationCity,
    required this.pickupAddress,
    required this.destinationAddress,
    required this.estimatedPrice,
    required this.createdAt,
    this.travelerId,
  });

  factory ParcelModel.fromJson(Map<String, dynamic> json) {
    return ParcelModel(
      id: json['id'] ?? '',
      senderId: json['senderId'] ?? '',
      description: json['description'] ?? '',
      weight: (json['weight'] ?? 0.0).toDouble(),
      category: json['category'] ?? '',
      status: json['status'] ?? 'pending',
      pickupCity: json['pickupCity'] ?? '',
      destinationCity: json['destinationCity'] ?? '',
      pickupAddress: json['pickupAddress'] ?? '',
      destinationAddress: json['destinationAddress'] ?? '',
      estimatedPrice: (json['estimatedPrice'] ?? 0.0).toDouble(),
      createdAt: DateTime.tryParse(json['createdAt'] ?? '') ?? DateTime.now(),
      travelerId: json['travelerId'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'senderId': senderId,
      'description': description,
      'weight': weight,
      'category': category,
      'status': status,
      'pickupCity': pickupCity,
      'destinationCity': destinationCity,
      'pickupAddress': pickupAddress,
      'destinationAddress': destinationAddress,
      'estimatedPrice': estimatedPrice,
      'createdAt': createdAt.toIso8601String(),
      'travelerId': travelerId,
    };
  }

  ParcelModel copyWith({
    String? id,
    String? senderId,
    String? description,
    double? weight,
    String? category,
    String? status,
    String? pickupCity,
    String? destinationCity,
    String? pickupAddress,
    String? destinationAddress,
    double? estimatedPrice,
    DateTime? createdAt,
    String? travelerId,
  }) {
    return ParcelModel(
      id: id ?? this.id,
      senderId: senderId ?? this.senderId,
      description: description ?? this.description,
      weight: weight ?? this.weight,
      category: category ?? this.category,
      status: status ?? this.status,
      pickupCity: pickupCity ?? this.pickupCity,
      destinationCity: destinationCity ?? this.destinationCity,
      pickupAddress: pickupAddress ?? this.pickupAddress,
      destinationAddress: destinationAddress ?? this.destinationAddress,
      estimatedPrice: estimatedPrice ?? this.estimatedPrice,
      createdAt: createdAt ?? this.createdAt,
      travelerId: travelerId ?? this.travelerId,
    );
  }
}
