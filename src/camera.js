export function cameraConstraints(deviceId = '') {
  return {audio:false,video:deviceId ? {deviceId:{exact:deviceId}} : true};
}
// Opening a MediaStream is insufficient: wait for decoded, advancing video.
export function waitForVideo(video, {timeoutMs=10000, pollMs=50}={}) {
  return new Promise((resolve,reject)=>{
    let interval,settled=false;
    const cleanup=()=>{settled=true;clearTimeout(timeout);clearInterval(interval);};
    const timeout=setTimeout(()=>{cleanup();const e=new Error('No advancing camera frames');e.name='CameraFramesTimeout';reject(e);},timeoutMs);
    Promise.resolve().then(()=>video.play()).then(()=>{
      if(settled)return;
      const check=()=>{if(video.videoWidth>0 && video.videoHeight>0 && video.readyState>=2 && video.currentTime>0){cleanup();resolve();}};
      interval=setInterval(check,pollMs);check();
    },error=>{cleanup();reject(error);});
  });
}
