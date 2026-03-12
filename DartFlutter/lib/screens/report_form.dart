import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';

import '../models/report.dart';
import '../services/location_service.dart';
import '../services/permission_service.dart';
import '../services/storage_service.dart';

class ReportForm extends StatefulWidget {
  const ReportForm({super.key});

  @override
  State<ReportForm> createState() => _ReportFormState();
}

class _ReportFormState extends State<ReportForm> {
  final _formKey = GlobalKey<FormState>();
  final ImagePicker _picker = ImagePicker();
  final DateTime _createdAt = DateTime.now();
  static const _categories = [
    'Emergency',
    'Crime',
    'Accident',
    'Fire',
    'Medical',
    'Natural Disaster',
    'Infrastructure',
    'Community',
  ];
  static const _urgencyOptions = [
    {'label': 'Critical', 'value': 3},
    {'label': 'High', 'value': 2},
    {'label': 'Medium', 'value': 1},
    {'label': 'Low', 'value': 0},
  ];
  String _category = 'Emergency';
  int _urgency = 3;
  String _description = '';
  final List<String> _photoEvidence = [];
  final List<String> _videoEvidence = [];
  double? _lat;
  double? _lon;
  bool _resolved = false;

  String get _urgencyLabel {
    return _urgencyOptions
        .firstWhere((u) => u['value'] == _urgency)['label'] as String;
  }

  String get _locationLabel {
    return '${_lat?.toStringAsFixed(5) ?? 'unknown'}, ${_lon?.toStringAsFixed(5) ?? 'unknown'}';
  }

  String get _timestampLabel {
    final d = _createdAt;
    String two(int n) => n.toString().padLeft(2, '0');
    return '${d.year}-${two(d.month)}-${two(d.day)} ${two(d.hour)}:${two(d.minute)}:${two(d.second)}';
  }

  void _showMessage(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message)),
    );
  }

  Future<bool> _ensureMediaPermissions() async {
    final cameraOk = await PermissionService.requestCameraPermission();
    if (!mounted) return false;
    if (!cameraOk) {
      _showMessage('Camera permission denied');
      return false;
    }
    final storageOk = await PermissionService.requestStoragePermission();
    if (!mounted) return false;
    if (!storageOk) {
      _showMessage('Storage/photo permission denied');
      return false;
    }
    return true;
  }

  Future<void> _addPhoto() async {
    if (!await _ensureMediaPermissions()) return;
    final XFile? file = await _picker.pickImage(
      source: ImageSource.gallery,
      imageQuality: 75,
    );
    if (!mounted || file == null) return;
    setState(() => _photoEvidence.add(file.path));
  }

  Future<void> _addVideo() async {
    if (!await _ensureMediaPermissions()) return;
    final XFile? file = await _picker.pickVideo(
      source: ImageSource.gallery,
      maxDuration: const Duration(minutes: 3),
    );
    if (!mounted || file == null) return;
    setState(() => _videoEvidence.add(file.path));
  }

  Future<void> _captureLocation() async {
    final pos = await LocationService.getCurrentLocation();
    if (pos != null) {
      setState(() {
        _lat = pos.latitude;
        _lon = pos.longitude;
      });
    }
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    _formKey.currentState!.save();
    if (_lat == null || _lon == null) await _captureLocation();
    final r = Report(
      category: _category,
      urgency: _urgency,
      description: _description,
      mediaPaths: _photoEvidence,
      videoPaths: _videoEvidence,
      latitude: _lat,
      longitude: _lon,
      timestamp: _createdAt,
      resolved: _resolved,
    );
    await StorageService.saveReport(r);
    if (!mounted) return;
    Navigator.of(context).pop(true);
  }

  @override
  void initState() {
    super.initState();
    _captureLocation();
  }

  Widget _buildCategorySection(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Category', style: Theme.of(context).textTheme.titleMedium),
        const SizedBox(height: 8),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: _categories.map((category) {
            return ChoiceChip(
              label: Text(category),
              selected: _category == category,
              onSelected: (_) => setState(() => _category = category),
            );
          }).toList(),
        ),
      ],
    );
  }

  Widget _buildUrgencySection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Urgency: $_urgencyLabel'),
        const SizedBox(height: 8),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: _urgencyOptions.map((option) {
            final selected = _urgency == option['value'];
            return ChoiceChip(
              label: Text(option['label'] as String),
              selected: selected,
              onSelected: (_) => setState(() => _urgency = option['value'] as int),
            );
          }).toList(),
        ),
      ],
    );
  }

  Widget _buildEvidenceList({
    required String title,
    required List<String> items,
    required IconData icon,
  }) {
    if (items.isEmpty) return const SizedBox.shrink();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('$title (${items.length})'),
        const SizedBox(height: 4),
        ...items.map((path) => ListTile(
              dense: true,
              contentPadding: EdgeInsets.zero,
              leading: Icon(icon, size: 20),
              title: Text(path.split('/').last),
            )),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('New Report')),
      body: Padding(
        padding: const EdgeInsets.all(12.0),
        child: Form(
          key: _formKey,
          child: ListView(
            children: [
              _buildCategorySection(context),
              const SizedBox(height: 8),
              _buildUrgencySection(),
              const SizedBox(height: 8),
              TextFormField(
                decoration: InputDecoration(labelText: 'Description'),
                maxLines: 4,
                onSaved: (v) => _description = v ?? '',
                validator: (v) => (v == null || v.trim().isEmpty) ? 'Provide a description' : null,
              ),
              const SizedBox(height: 8),
              ListTile(
                dense: true,
                contentPadding: EdgeInsets.zero,
                leading: const Icon(Icons.access_time),
                title: const Text('Timestamp'),
                subtitle: Text(_timestampLabel),
              ),
              SwitchListTile.adaptive(
                contentPadding: EdgeInsets.zero,
                title: Text('Mark as resolved'),
                subtitle: Text(_resolved ? 'Resolved' : 'Active'),
                value: _resolved,
                onChanged: (v) => setState(() => _resolved = v),
              ),
              const SizedBox(height: 8),
              Text('Location: $_locationLabel'),
              TextButton.icon(
                icon: const Icon(Icons.location_on),
                label: const Text('Refresh Location'),
                onPressed: _captureLocation,
              ),
              const SizedBox(height: 8),
              Text('Evidence', style: Theme.of(context).textTheme.titleMedium),
              const SizedBox(height: 4),
              const Text('Photo Upload and Video Documents'),
              const SizedBox(height: 8),
              Wrap(
                spacing: 12,
                runSpacing: 8,
                children: [
                  ElevatedButton.icon(
                    icon: const Icon(Icons.photo_library_outlined),
                    label: const Text('Upload Photo'),
                    onPressed: _addPhoto,
                  ),
                  ElevatedButton.icon(
                    icon: const Icon(Icons.video_library_outlined),
                    label: const Text('Upload Video'),
                    onPressed: _addVideo,
                  ),
                ],
              ),
              const SizedBox(height: 8),
              _buildEvidenceList(
                title: 'Photos',
                items: _photoEvidence,
                icon: Icons.image,
              ),
              _buildEvidenceList(
                title: 'Videos',
                items: _videoEvidence,
                icon: Icons.videocam,
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: _submit,
                child: const Text('Submit Report'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
