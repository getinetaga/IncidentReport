import 'package:flutter/material.dart';

import 'screens/home_screen.dart';
import 'services/storage_service.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await StorageService.init();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Incident Reporter',
      theme: ThemeData(
        colorSchemeSeed: const Color.fromARGB(255, 73, 35, 156),
        useMaterial3: true,
      ),
      home: const HomeScreen(),
    );
  }
}
