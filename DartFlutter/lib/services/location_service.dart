import 'package:geolocator/geolocator.dart';

import 'permission_service.dart';

class LocationService {
  static Future<Position?> getCurrentLocation() async {
    // Request location permission using PermissionService first.
    final ok = await PermissionService.requestLocationPermission();
    if (!ok) return null;

    bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) return null;

    try {
      return await Geolocator.getCurrentPosition(
          desiredAccuracy: LocationAccuracy.best);
    } on PermissionDeniedException {
      return null;
    } on LocationServiceDisabledException {
      return null;
    } catch (_) {
      return null;
    }
  }
}
