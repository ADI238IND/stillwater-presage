---
title: "Stillwater: a reading landscape that follows your breathing"
published: false
tags: devchallenge, presagechallenge, javascript, showdev
---

*This is a submission draft for the [Presage SmartSpectra SDK Challenge](https://dev.to/challenges/presage-2026-11-04). It is not ready to publish until live camera verification and the demo video are complete.*

## What I Built

Most reading interfaces make you adapt to them. Stillwater explores the reverse: a small, quiet reading space that adapts to your breathing.

A lake moves with your rhythm. A paragraph spotlight takes a little more time when your breathing slows relative to your own baseline. You can bring your own text, switch to manual reading, or reduce motion at any time. There is no target breathing rate, emotion classification, wellness score, or medical recommendation.

I built this as a new individual project for this challenge, with ChatGPT/Codex assistance for implementation, design and tests.

## Demo

**Pending: attach a public/unlisted video showing actual live Presage camera signals before publishing.** The clearly labeled synthetic preview is useful for exploring the interface but does not establish live integration. Live camera testing on the development host was unavailable because it has no cameras.

The [recording guide](https://github.com/ADI238IND/stillwater-presage/blob/main/docs/DEMO_GUIDE.md) covers the real-signal demonstration and stop/privacy checks.

## Code

[Public source, setup and verification status](https://github.com/ADI238IND/stillwater-presage)

Windows x64: install Node.js 24 LTS, clone the repository, run `npm ci` and `npm start`. Paste your own Presage developer key locally in the consent dialog. No account or shared test credentials are needed for the app itself.

## How It Responds to Human Signals

The Electron main process uses `bindSmartSpectraIpc` from the official SDK. The isolated renderer uses `@smartspectra/node-sdk/renderer`, requests chest breathing and breathing rate, and decodes actual protobuf metric events with `@smartspectra/node-sdk/messages`.

The controller accepts data only after a valid camera-readiness status. It rejects invalid or low-confidence values and treats readings older than five seconds as stale. Thirty accepted readings establish a personal median baseline. A smoothed, bounded baseline/current-rate ratio changes paragraph dwell time. The chest trace shapes the landscape's artistic motion, while breathing rate times the lake ripples. This does not claim exact inhale/exhale detection or validated comprehension improvement.

Quality warnings suspend adaptation; they do not trigger fabricated fallback readings. Manual reading remains available.

## Prize Categories

**Most Creative or Delightful Use:** The body becomes an interface for a miniature landscape and reading rhythm. The design is intentionally free of goals and scores; the environment follows the person.

**Best Thoughtful Real-World Use:** Stillwater is for people who want a quieter, self-directed reading session. It includes manual control, custom text, reduced motion, clear source labeling, quality handling, and a stop button. The adaptation is an experimental interaction heuristic, not a proven cognitive or health intervention.

## Consent and Data Handling

Live mode requires an explicit in-app camera consent and the OS permission. The app does not record video or save readings, keys or reading text to disk. Its session buffers are cleared on Stop, and the SDK camera is released. The API key stays in memory for the session; it is never included in source or a public demo.

The SDK's optional aggregate diagnostic telemetry is disabled with `enableTelemetry:false`. This does not disable Presage's core authentication or service processing. Presage governs its own service data handling and retention; see its [privacy policy](https://presagetech.com/legal/privacy-policy) and [SDK telemetry documentation](https://smartspectra.presagetech.com/docs/telemetry-and-privacy). I do not claim control over vendor-managed retention.

There are no runtime AI-service calls. No diagnosis, treatment, medical decision-making, or covert monitoring is supported. The synthetic preview uses no camera and is visibly labeled.

## Verification Status

The production build, syntax checks and six controller tests pass; the native SmartSpectra 3.4.0 runtime loads. Live camera behavior and recording remain to be verified on a camera-equipped device before this draft becomes an entry.
