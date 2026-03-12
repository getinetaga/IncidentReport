import 'package:flutter/material.dart';

import '../models/report.dart';
import '../services/storage_service.dart';
import 'report_form.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  List<Report> _reports = [];

  @override
  void initState() {
    super.initState();
    _loadReports();
  }

  void _loadReports() {
    setState(() {
      _reports = StorageService.getReports();
    });
  }

  String _formatTimestamp(DateTime time) {
    String two(int n) => n.toString().padLeft(2, '0');
    return '${time.year}-${two(time.month)}-${two(time.day)} ${two(time.hour)}:${two(time.minute)}';
  }

  Widget _buildDocumentSection({
    required String label,
    required List<String> paths,
    required IconData icon,
  }) {
    if (paths.isEmpty) {
      return Text('$label: none');
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('$label:'),
        const SizedBox(height: 4),
        Wrap(
          spacing: 6,
          runSpacing: 6,
          children: paths
              .map((path) => Chip(
                    visualDensity: VisualDensity.compact,
                    avatar: Icon(icon, size: 16),
                    label: Text(path.split('/').last),
                  ))
              .toList(),
        ),
      ],
    );
  }

  Future<void> _openReportForm() async {
    final created = await Navigator.of(context).push<bool>(
      MaterialPageRoute(builder: (_) => const ReportForm()),
    );
    if (!mounted || created != true) return;
    _loadReports();
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
            const SizedBox(height: 20),
            Text(
              'Incident History',
              style: Theme.of(context).textTheme.titleMedium,
            ),
            const SizedBox(height: 8),
            Expanded(
              child: _reports.isEmpty
                  ? const Center(
                      child: Text('No incidents yet. Submit a report to see history.'),
                    )
                  : ListView.separated(
                      itemCount: _reports.length,
                      separatorBuilder: (_, __) => const SizedBox(height: 8),
                      itemBuilder: (context, index) {
                        final report = _reports[index];
                        return Card(
                          child: ListTile(
                            title: Text('${report.category} • Urgency ${report.urgency}'),
                            subtitle: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                const SizedBox(height: 4),
                                Text(_formatTimestamp(report.timestamp)),
                                Text(
                                  report.description,
                                  maxLines: 2,
                                  overflow: TextOverflow.ellipsis,
                                ),
                                const SizedBox(height: 4),
                                _buildDocumentSection(
                                  label: 'Photo Documents',
                                  paths: report.mediaPaths,
                                  icon: Icons.image_outlined,
                                ),
                                const SizedBox(height: 4),
                                _buildDocumentSection(
                                  label: 'Video Documents',
                                  paths: report.videoPaths,
                                  icon: Icons.videocam_outlined,
                                ),
                              ],
                            ),
                            trailing: Icon(
                              report.resolved ? Icons.check_circle : Icons.warning_amber_rounded,
                              color: report.resolved ? Colors.green : Colors.orange,
                            ),
                          ),
                        );
                      },
                    ),
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
