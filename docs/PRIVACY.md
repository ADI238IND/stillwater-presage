# Consent and data handling

Live capture starts only after an explicit in-app checkbox, a user click and the OS camera permission. Browser preview never asks for a camera. Live SDK mode is visibly labeled separately from the synthetic preview.

The app stores no measurement files, camera recordings, persistent API keys, or analytics. Session measurements and baseline stay in memory and are reset on Stop. SDK teardown is requested and SDK-owned camera tracks are released. The preview video is removed and its tracks stopped explicitly as a fallback. Closing Electron tears down the per-window SDK connection.

The API key is submitted to Presage through the official SDK for authentication. The renderer passes frames through the SDK's preload/IPC bridge to the local native SDK; the app does not implement its own remote frame upload. Presage's own service requests and data handling remain governed by its current policies. We do not claim the complete SDK works offline, or promise deletion of vendor-managed service data. Review https://presagetech.com/legal/privacy-policy before using a key or camera.

Optional aggregate SDK diagnostic telemetry is disabled with `enableTelemetry:false`. This setting is distinct from core SDK authentication and service processing.

There are no runtime LLM calls. Custom reading text stays in memory inside the UI and is not supplied to Presage. Pasted text remains until the app closes. Avoid pasting confidential text into a public screen recording.

The public repository contains source and tests, not user sessions or credentials. A published demo must use a consenting participant and exclude secrets and bystanders. The app is an experimental reading interaction and must not be used for diagnosis, treatment, medical decisions or non-consensual monitoring.
