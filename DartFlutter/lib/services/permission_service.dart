import 'package:flutter/foundation.dart';
import 'package:permission_handler/permission_handler.dart';

class PermissionService {
  static Future<bool> _requestPermission(Permission permission) async {
    final status = await permission.status;
    if (status.isGranted) return true;
    final result = await permission.request();
    return result.isGranted;
  }

  static Future<bool> requestLocationPermission() async {
    if (kIsWeb) return true; // Browser prompts cover permission handling.
    return _requestPermission(Permission.locationWhenInUse);
  }

  static Future<bool> requestCameraPermission() async {
    if (kIsWeb) return true;
    return _requestPermission(Permission.camera);
  }

  static Future<bool> requestStoragePermission() async {
    if (kIsWeb) return true;
    if (defaultTargetPlatform == TargetPlatform.iOS) {
      final result = await Permission.photos.request();
      return result.isGranted;
    }
    return _requestPermission(Permission.storage);
  }
}
