import 'dart:convert';

import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:hive_flutter/hive_flutter.dart';

import '../models/report.dart';

class StorageService {
  static const _boxName = 'reports_box';
  static const _keyName = 'hive_key';

  static Future<void> init() async {
    await Hive.initFlutter();
    final secure = FlutterSecureStorage();
    String? key = await secure.read(key: _keyName);
    if (key == null) {
      final newKey = Hive.generateSecureKey();
      await secure.write(key: _keyName, value: base64UrlEncode(newKey));
      key = base64UrlEncode(newKey);
    }
    final encryptionKey = base64Url.decode(key);
    await Hive.openBox(_boxName, encryptionCipher: HiveAesCipher(encryptionKey));
  }

  static Box<dynamic> _box() => Hive.box(_boxName);

  static Future<void> saveReport(Report r) async {
    await _box().put(r.id, r.toMap());
  }

  static List<Report> getReports() {
    final box = _box();
    final values = box.values
        .map((e) => Report.fromMap(Map<String, dynamic>.from(e)))
        .toList();
    values.sort((a, b) {
      final p = b.urgency.compareTo(a.urgency);
      return p != 0 ? p : b.timestamp.compareTo(a.timestamp);
    });
    return values;
  }

  static Future<void> deleteReport(String id) async {
    await _box().delete(id);
  }
}
