class TripModel {
  final String id;
  final String travelerId;
  final String fromCity;
  final String toCity;
  final DateTime departureDate;
  final double availableWeight;
  final double pricePerKg;
  final String status;
  final List<String> acceptedParcels;

  TripModel({
    required this.id,
    required this.travelerId,
    required this.fromCity,
    required this.toCity,
    required this.departureDate,
    required this.availableWeight,
    required this.pricePerKg,
    required this.status,
    this.acceptedParcels = const [],
  });

  factory TripModel.fromJson(Map<String, dynamic> json) {
    return TripModel(
      id: json['id'] ?? '',
      travelerId: json['travelerId'] ?? '',
      fromCity: json['fromCity'] ?? '',
      toCity: json['toCity'] ?? '',
      departureDate:
          DateTime.tryParse(json['departureDate'] ?? '') ?? DateTime.now(),
      availableWeight: (json['availableWeight'] ?? 0.0).toDouble(),
      pricePerKg: (json['pricePerKg'] ?? 0.0).toDouble(),
      status: json['status'] ?? 'active',
      acceptedParcels: List<String>.from(json['acceptedParcels'] ?? []),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'travelerId': travelerId,
      'fromCity': fromCity,
      'toCity': toCity,
      'departureDate': departureDate.toIso8601String(),
      'availableWeight': availableWeight,
      'pricePerKg': pricePerKg,
      'status': status,
      'acceptedParcels': acceptedParcels,
    };
  }

  TripModel copyWith({
    String? id,
    String? travelerId,
    String? fromCity,
    String? toCity,
    DateTime? departureDate,
    double? availableWeight,
    double? pricePerKg,
    String? status,
    List<String>? acceptedParcels,
  }) {
    return TripModel(
      id: id ?? this.id,
      travelerId: travelerId ?? this.travelerId,
      fromCity: fromCity ?? this.fromCity,
      toCity: toCity ?? this.toCity,
      departureDate: departureDate ?? this.departureDate,
      availableWeight: availableWeight ?? this.availableWeight,
      pricePerKg: pricePerKg ?? this.pricePerKg,
      status: status ?? this.status,
      acceptedParcels: acceptedParcels ?? this.acceptedParcels,
    );
  }
}
