# IncidentReport

This repository contains two incident-reporting clients plus a simple Node server:

1. Flutter app in `DartFlutter/`
2. React/Expo-style web/mobile code in the root `src/` app
3. Example backend in `server/`

## Flutter App (`DartFlutter/`)

Run:

```bash
cd DartFlutter
flutter pub get
flutter run -d chrome
```

Notes:
- Reports are saved locally in an encrypted Hive box.
- Location/media permissions are requested at runtime.

## React/Expo App (root)

Run:

```bash
npm install
npm run dev
```

Notes:
- Uses location/media features from the app services and components in `src/`.
- Set backend `API_URL` in `src/services/api.js` if needed.

## Example Server (`server/`)

Run:

```bash
cd server
npm install
npm start
```

Server endpoint:
- `POST /reports`

## Quick Troubleshooting

1. Verify Flutter setup with `flutter doctor`.
2. Verify Node setup with `node -v` and `npm -v`.
3. If `flutter` is not recognized, add Flutter `bin` to PATH and restart the terminal.
