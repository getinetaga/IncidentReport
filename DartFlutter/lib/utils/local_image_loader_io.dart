import 'dart:io';

import 'package:flutter/widgets.dart';

Widget? buildLocalImage(
  String path, {
  double? width,
  double? height,
  BoxFit fit = BoxFit.cover,
}) {
  final file = File(path);
  if (!file.existsSync()) return null;
  return Image.file(file, width: width, height: height, fit: fit, filterQuality: FilterQuality.medium);
}
