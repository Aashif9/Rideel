import 'package:flutter/material.dart';
import '../models/delivery_model.dart';

class SenderProvider extends ChangeNotifier {
  static final _mockDeliveries = [
    const DeliveryModel(
      id: 'd1',
      parcelId: 'p1',
      travelerId: 't1',
      senderId: 'u1',
      status: 'in_transit',
      estimatedArrival: 'Dec 15, 2024 6:00 PM',
      currentLocation: 'Nashik',
      totalAmount: 125,
      createdAt: 'Dec 15, 2024',
      fromCity: 'Mumbai',
      toCity: 'Pune',
      description: 'Electronics (Laptop)',
      travelerName: 'Rahul Sharma',
    ),
    const DeliveryModel(
      id: 'd2',
      parcelId: 'p2',
      travelerId: 't2',
      senderId: 'u1',
      status: 'delivered',
      estimatedArrival: 'Dec 10, 2024',
      currentLocation: 'Pune',
      totalAmount: 75,
      createdAt: 'Dec 10, 2024',
      fromCity: 'Delhi',
      toCity: 'Jaipur',
      description: 'Documents',
      travelerName: 'Priya Patel',
    ),
    const DeliveryModel(
      id: 'd3',
      parcelId: 'p3',
      travelerId: '',
      senderId: 'u1',
      status: 'pending',
      estimatedArrival: 'Dec 18, 2024',
      currentLocation: '',
      totalAmount: 90,
      createdAt: 'Dec 18, 2024',
      fromCity: 'Bangalore',
      toCity: 'Chennai',
      description: 'Clothing',
      travelerName: 'Not assigned',
    ),
  ];

  List<DeliveryModel> myDeliveries = List.from(_mockDeliveries);
  DeliveryModel? selectedDelivery;

  Future<void> loadDeliveries() async {
    await Future.delayed(const Duration(milliseconds: 500));
    myDeliveries = List.from(_mockDeliveries);
    notifyListeners();
  }

  void selectDelivery(DeliveryModel delivery) {
    selectedDelivery = delivery;
    notifyListeners();
  }
}
