import 'package:flutter/widgets.dart';

import 'local_image_loader_stub.dart'
    if (dart.library.io) 'local_image_loader_io.dart' as loader;

Widget? buildLocalImage(
  String path, {
  double? width,
  double? height,
  BoxFit fit = BoxFit.cover,
}) {
  return loader.buildLocalImage(
    path,
    width: width,
    height: height,
    fit: fit,
  );
}
