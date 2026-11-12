class DeliveryModel {
  final String id;
  final String parcelId;
  final String travelerId;
  final String senderId;
  final String status; // pending, accepted, picked_up, in_transit, delivered
  final String estimatedArrival;
  final String currentLocation;
  final double totalAmount;
  final String createdAt;
  final String fromCity;
  final String toCity;
  final String description;
  final String travelerName;

  const DeliveryModel({
    required this.id,
    required this.parcelId,
    required this.travelerId,
    required this.senderId,
    required this.status,
    required this.estimatedArrival,
    required this.currentLocation,
    required this.totalAmount,
    required this.createdAt,
    required this.fromCity,
    required this.toCity,
    required this.description,
    required this.travelerName,
  });

  factory DeliveryModel.fromJson(Map<String, dynamic> j) => DeliveryModel(
        id: j['id'] ?? '',
        parcelId: j['parcelId'] ?? '',
        travelerId: j['travelerId'] ?? '',
        senderId: j['senderId'] ?? '',
        status: j['status'] ?? 'pending',
        estimatedArrival: j['estimatedArrival'] ?? '',
        currentLocation: j['currentLocation'] ?? '',
        totalAmount: (j['totalAmount'] ?? 0).toDouble(),
        createdAt: j['createdAt'] ?? '',
        fromCity: j['fromCity'] ?? '',
        toCity: j['toCity'] ?? '',
        description: j['description'] ?? '',
        travelerName: j['travelerName'] ?? '',
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'parcelId': parcelId,
        'travelerId': travelerId,
        'senderId': senderId,
        'status': status,
        'estimatedArrival': estimatedArrival,
        'currentLocation': currentLocation,
        'totalAmount': totalAmount,
        'createdAt': createdAt,
        'fromCity': fromCity,
        'toCity': toCity,
        'description': description,
        'travelerName': travelerName,
      };
}
