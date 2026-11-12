class NotificationModel {
  final String id;
  final String title;
  final String body;
  final String type;
  bool read;
  final String createdAt;

  NotificationModel({
    required this.id,
    required this.title,
    required this.body,
    required this.type,
    required this.read,
    required this.createdAt,
  });
}
