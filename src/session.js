// Never include a developer key or vendor payload in user-facing diagnostics.
export function startupMessage(error = {}) {
  const name = error.cause?.name || error.name;
  if(name === 'CameraFramesTimeout') return 'Camera opened but no advancing video arrived within 10 seconds. Check the webcam privacy shutter, close other camera apps, or use Refresh camera list to select another device.';
  if(name === 'NotSupportedError') return 'Camera video playback is unavailable. Restart Stillwater and try another physical webcam.';
  if (name === 'NotAllowedError') return 'Camera permission denied. Enable Camera access and Let desktop apps access your camera in Windows Settings → Privacy & security → Camera.';
  if (name === 'NotReadableError') return 'Windows cannot open the camera. Close Camera, Teams, Zoom and other camera apps, then retry.';
  if (name === 'NotFoundError') return 'No camera was found. Connect a webcam and check it in the Windows Camera app.';
  if (name === 'OverconstrainedError') return 'This camera cannot satisfy the capture settings. Try another webcam.';
  const messages = {
    2:'Presage rejected authentication. Copy the active API key from your Presage dashboard and retry.',
    3:'Presage could not configure this session. Restart Stillwater and retry.',
    4:'Presage credits are exhausted. Check the dashboard before retrying.',
    5:'Presage network connection failed. Check connectivity and firewall access.',
    6:'Presage service returned an error. Wait and retry.',
    7:'Camera input is unavailable. Close other camera apps and check Windows camera permissions.',
    8:'Presage processing failed. Restart Stillwater and retry.',
    SMARTSPECTRA_IPC_TIMEOUT:'The native Presage process did not respond. Close Stillwater completely and restart it.',
  };
  return messages[error.code] || `Live session failed (${error.code ?? name ?? 'unknown'}). Try Test camera only to isolate camera access from Presage processing.`;
}
export async function releaseSession(instance) {
  if (!instance) return;
  try { await instance.stop(); } finally { await instance.destroy(); }
}

export function sdkFailure(error = {}, secrets = []) {
  let detail = typeof error.message === 'string' ? error.message : '';
  for (const secret of secrets) {
    if (typeof secret === 'string' && secret.length) detail=detail.split(secret).join('[redacted]');
  }
  detail=detail
    .replace(/\b(?:Bearer\s+)[^\s,;]+/gi,'Bearer [redacted]')
    .replace(/((?:api[_ -]?key|token|authorization|password)\s*[:=]\s*)(?:"[^"]*"|'[^']*'|[^\s,;]+)/gi,'$1[redacted]')
    .replace(/https?:\/\/[^\s]+/gi,'[service URL]')
    .replace(/[A-Z]:\\Users\\[^\r\n,;]*/gi,'[local path]')
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi,'[email]')
    .replace(/[\r\n\t]+/g,' ').slice(0,1000);
  const code=typeof error.code==='number'?` [SDK ${error.code}]`:'';
  return startupMessage(error)+code+(detail?` Details: ${detail}`:'');
}
