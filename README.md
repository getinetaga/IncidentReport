# Incident Reporter (Flutter)

A minimal Flutter app to report incidents with GPS location, urgency categorization, photos, and local encrypted storage.

Run:

1. Ensure Flutter is installed and configured for your platform.
2. From the project directory run:

```bash
flutter pub get
flutter run
```

Android permissions: add `ACCESS_FINE_LOCATION`, `ACCESS_COARSE_LOCATION`, `CAMERA`, and file permissions to `android/app/src/main/AndroidManifest.xml` as needed.

Notes:
- Reports are stored locally in an encrypted Hive box. For production, implement secure backend upload and stronger privacy controls.
- Prioritization: reports are ordered by `urgency` (3 highest).

Troubleshooting (Windows)

- Install Flutter: download the latest stable SDK from https://flutter.dev and extract it (for example to `C:\src\flutter`).
- Add Flutter to PATH: add `%USERPROFILE%\src\flutter\bin` (or your install path) to the system `PATH`, then restart your terminal.
- Verify setup: open a new PowerShell or cmd and run:

```bash
flutter doctor
```

	- Resolve any issues `flutter doctor` reports (install Android Studio for Android tooling and accept Android licenses with `flutter doctor --android-licenses`).
	- Ensure an Android device/emulator is available; enable USB debugging on a physical device.

- Common fixes if `flutter` is not recognized:
	- Confirm the `bin` folder is on PATH and you restarted the terminal.
	- Use the full path to the `flutter` executable to test: `C:\src\flutter\bin\flutter.bat doctor`.

- Quick run commands from project root:

```bash
flutter pub get
flutter devices        # lists available devices/emulators
flutter run -d <id>   # run on selected device
```

- If you see permission or build errors on Android, open the Android project in Android Studio and allow Gradle/SDK updates, or run `flutter doctor` to follow specific suggestions.

If you want, I can also add an in-app permission helper and runtime prompts to the codebase.
