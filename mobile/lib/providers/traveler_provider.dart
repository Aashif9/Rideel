import 'package:flutter/material.dart';

class TravelerProvider extends ChangeNotifier {
  List<Map<String, dynamic>> availableRequests = [
    {
      'id': 'req1',
      'description': 'Electronics (Phone)',
      'weight': 1.2,
      'category': 'Electronics',
      'fromCity': 'Mumbai',
      'toCity': 'Pune',
      'pickupAddress': 'Andheri West, Mumbai',
      'destinationAddress': 'Kothrud, Pune',
      'estimatedPrice': 80.0,
      'senderName': 'Vikram Singh',
      'createdAt': 'Dec 15, 2024',
    },
    {
      'id': 'req2',
      'description': 'Documents (Legal Papers)',
      'weight': 0.5,
      'category': 'Documents',
      'fromCity': 'Delhi',
      'toCity': 'Jaipur',
      'pickupAddress': 'Connaught Place, Delhi',
      'destinationAddress': 'MI Road, Jaipur',
      'estimatedPrice': 50.0,
      'senderName': 'Meera Kapoor',
      'createdAt': 'Dec 15, 2024',
    },
    {
      'id': 'req3',
      'description': 'Clothing (Winter Jackets)',
      'weight': 3.0,
      'category': 'Clothing',
      'fromCity': 'Bangalore',
      'toCity': 'Chennai',
      'pickupAddress': 'Koramangala, Bangalore',
      'destinationAddress': 'T. Nagar, Chennai',
      'estimatedPrice': 120.0,
      'senderName': 'Arjun Reddy',
      'createdAt': 'Dec 14, 2024',
    },
    {
      'id': 'req4',
      'description': 'Books (Textbooks)',
      'weight': 4.5,
      'category': 'Books',
      'fromCity': 'Hyderabad',
      'toCity': 'Kolkata',
      'pickupAddress': 'Banjara Hills, Hyderabad',
      'destinationAddress': 'Salt Lake, Kolkata',
      'estimatedPrice': 200.0,
      'senderName': 'Sneha Das',
      'createdAt': 'Dec 14, 2024',
    },
  ];

  List<Map<String, dynamic>> myTrips = [
    {
      'id': 'trip1',
      'fromCity': 'Mumbai',
      'toCity': 'Pune',
      'departureDate': 'Dec 16, 2024',
      'availableWeight': 10.0,
      'pricePerKg': 40.0,
      'status': 'active',
      'acceptedParcels': 1,
    },
    {
      'id': 'trip2',
      'fromCity': 'Delhi',
      'toCity': 'Jaipur',
      'departureDate': 'Dec 20, 2024',
      'availableWeight': 15.0,
      'pricePerKg': 35.0,
      'status': 'active',
      'acceptedParcels': 0,
    },
  ];

  Set<String> rejectedIds = {};

  void rejectRequest(String id) {
    rejectedIds.add(id);
    notifyListeners();
  }

  void acceptRequest(String id) {
    final req = availableRequests.firstWhere(
      (r) => r['id'] == id,
      orElse: () => {},
    );
    if (req.isNotEmpty && myTrips.isNotEmpty) {
      final trip = myTrips.first;
      trip['acceptedParcels'] = (trip['acceptedParcels'] as int) + 1;
    }
    notifyListeners();
  }
}
