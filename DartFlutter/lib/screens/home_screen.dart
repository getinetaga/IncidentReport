import 'package:flutter/material.dart';

import 'report_form.dart';

class HomeScreen extends StatefulWidget {
	const HomeScreen({super.key});

	@override
	State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
	Future<void> _openReportForm() async {
		final created = await Navigator.of(context).push<bool>(
			MaterialPageRoute(builder: (_) => const ReportForm()),
		);
		if (!mounted || created != true) return;
		ScaffoldMessenger.of(context).showSnackBar(
			const SnackBar(content: Text('Report submitted successfully')),
		);
	}

	@override
	Widget build(BuildContext context) {
		return Scaffold(
			appBar: AppBar(title: const Text('Incident Reporter')),
			body: Padding(
				padding: const EdgeInsets.all(16),
				child: Column(
					crossAxisAlignment: CrossAxisAlignment.stretch,
					children: [
						const Text(
							'Welcome',
							style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
						),
						const SizedBox(height: 8),
						const Text('Create and submit an incident report.'),
						const SizedBox(height: 20),
						ElevatedButton.icon(
							onPressed: _openReportForm,
							icon: const Icon(Icons.note_add_outlined),
							label: const Text('New Report'),
						),
					],
				),
			),
			floatingActionButton: FloatingActionButton(
				onPressed: _openReportForm,
				tooltip: 'New Report',
				child: const Icon(Icons.edit_note),
			),
		);
	}
}
