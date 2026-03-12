import 'package:uuid/uuid.dart';

class Report {
  String id;
  String category;
  int urgency; // 0 low - 3 highest/emergency
  String description;
      List<String> mediaPaths;
      List<String> videoPaths;
  double? latitude;
  double? longitude;
  DateTime timestamp;
  bool resolved;

  Report({
    String? id,
    required this.category,
    required this.urgency,
    required this.description,
    this.mediaPaths = const [],
            this.videoPaths = const [],
    this.latitude,
    this.longitude,
    DateTime? timestamp,
        this.resolved = false,
  })  : id = id ?? Uuid().v4(),
        timestamp = timestamp ?? DateTime.now();

  Map<String, dynamic> toMap() => {
        'id': id,
        'category': category,
        'urgency': urgency,
        'description': description,
        'mediaPaths': mediaPaths,
                        'videoPaths': videoPaths,
        'latitude': latitude,
        'longitude': longitude,
        'timestamp': timestamp.toIso8601String(),
        'resolved': resolved,
      };

  factory Report.fromMap(Map m) => Report(
        id: m['id'],
        category: m['category'] ?? 'other',
        urgency: m['urgency'] ?? 0,
        description: m['description'] ?? '',
        mediaPaths: List<String>.from(m['mediaPaths'] ?? []),
      videoPaths: List<String>.from(m['videoPaths'] ?? []),
        latitude: m['latitude']?.toDouble(),
        longitude: m['longitude']?.toDouble(),
        timestamp: DateTime.parse(m['timestamp']),
        resolved: m['resolved'] ?? false,
      );
}
