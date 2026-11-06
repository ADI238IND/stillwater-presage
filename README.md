# Stillwater
### Room to read. Space to breathe.

A living reading landscape shaped by live **Presage SmartSpectra** breathing signals. A new individual project for the November 2026 DEV challenge, by Aditya Singhal. Built with AI assistance from ChatGPT/Codex.

## What makes it different
Instead of grading your body, Stillwater makes the interface adapt to it. The lake responds to breathing; a reading spotlight moves through paragraphs at a gently adjusted personal pace. There are no goals, inferred emotions, medical claims, or performance scores.

- Live breathing rate and chest trace through the official native SDK.
- Personal median baseline from 30 valid readings, with gradual, bounded pace changes.
- Readiness gating, five-second stale-data cutoff, and confidence filtering.
- Explicit camera consent, stop/reset, no app recording or persistence, disabled SDK aggregate telemetry.
- Manual reading, local custom text, reduced motion, and separately labeled synthetic preview.

## Run on Windows (PowerShell)
Install Node.js 24 LTS and Git, then:

```powershell
git clone https://github.com/ADI238IND/stillwater-presage.git
cd stillwater-presage
npm ci
npm start
```

macOS Apple Silicon and Linux x64/ARM64 are also supported by the SDK. Linux requires glibc >=2.35. Windows x64 is supported. Electron downloads during normal `npm ci`; do not use `--ignore-scripts` on your own machine.

1. Select **Explore preview** first if you want to look around without camera access. This mode uses synthetic signals and is not proof of live SDK operation.
2. Stop preview, select **Connect live camera**, and paste your own developer API key from https://physiology.presagetech.com. Never add the key to source control, video, screenshots, or the DEV post.
3. Read the consent explanation, check consent, and start. Allow the camera when your OS requests it. Use a private setting, steady camera, even lighting, and visible upper torso.
4. Wait for valid measurements and baseline calibration. Read naturally. Start reading to see paragraph highlighting and pace adaptation.
5. **Stop** releases SDK-owned camera capture and clears app measurements and baseline.

If no live measurements arrive, check camera availability, key validity, free credits, network access, lighting and SDK positioning hints. Close other camera apps. Slow first startup can involve SDK model initialization. The app does not automatically switch to synthetic readings if live mode fails.

## Development and verification
```sh
npm test
npm run check
npm run build
npm run preview
```
`preview` serves the interface only. Live sensing requires `npm start` in Electron.

Six Node tests cover consent-independent signal readiness, invalid/low-confidence samples, stale data, camera warnings, bounded personal adaptation, and reset deletion. These are controller tests, not evidence of camera accuracy.

### Verified in the development environment
- Production Vite build passes.
- Six signal-controller tests pass.
- Rendered browser preview verified: synthetic signals, reading start/pause, Stop, and custom-text dialog.
- Native SmartSpectra 3.4.0 loads successfully.
- Camera discovery returned **zero cameras** in the remote development environment.
- **Live camera integration and demo video are pending local verification. This repository is not yet a completed challenge submission.**

## Integration
`electron/main.cjs` binds the official IPC bridge with `contextIsolation: true`, `sandbox: true`, and Node disabled in the renderer. `src/app.js` loads the renderer SDK and generated protobuf decoder. It requests only `CHEST_BREATHING` and `BREATHING_RATE`, subscribes to validation/metrics/error/stream events, and starts only after consent.

`src/engine.js` uses breathing rate relative to the individual's median baseline to adjust paragraph dwell time. Ratio is clamped to 0.75–1.10 and smoothed with a 0.12 update coefficient. Chest trace shapes an artistic lake response; the rate drives ripple timing. This is not a precise breath-phase reconstruction. Warnings or data older than five seconds return timing to its manual default.

## Privacy and limitations
- No app-level video recording, metric saving, analytics, account, or runtime LLM calls.
- API key exists in memory only; SDK receives it for authentication. No localStorage or key file.
- SDK `enableTelemetry: false` disables its optional aggregate diagnostic telemetry. This does **not** mean the SDK operates offline or that no data reaches Presage. Authentication and the SDK's service processing still involve Presage; consult its current privacy policy and SDK documentation for server-side data handling and retention.
- SDK processing buffers are owned by the SDK; the app does not promise to control vendor retention. App buffers are cleared on Stop, and closing the window destroys its SDK session.
- Custom text stays in the window; it is not sent to the SDK. It remains visible until you close the app.
- No diagnosis, treatment, medical decisions, or covert monitoring. Readings vary with camera, lighting, movement and positioning. Do not use for health or safety decisions.
- The personal adaptation rule is a design heuristic, not a validated measure of comprehension or mental state.

See [demo recording guide](docs/DEMO_GUIDE.md), [submission draft](docs/DEV_SUBMISSION_DRAFT.md), and [privacy details](docs/PRIVACY.md).

## Upstream references
- https://smartspectra.presagetech.com/docs/nodejs
- https://smartspectra.presagetech.com/docs/nodejs/metrics
- https://smartspectra.presagetech.com/docs/telemetry-and-privacy
- https://presagetech.com/legal/privacy-policy

## License
Original Stillwater app code is MIT licensed. The Presage SDK and its native runtimes remain subject to their own licenses and terms; they are fetched as dependencies, not relicensed here.
