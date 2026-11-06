import {test} from 'node:test';
import assert from 'node:assert/strict';
import {cameraConstraints,waitForVideo} from '../src/camera.js';
test('camera default and explicit device selection never request audio',()=>{assert.deepEqual(cameraConstraints(),{audio:false,video:true});assert.deepEqual(cameraConstraints('physical'),{audio:false,video:{deviceId:{exact:'physical'}}});});
test('opened camera is insufficient without advancing decoded frames',async()=>{const v={play:async()=>{},readyState:0,videoWidth:0,videoHeight:0,currentTime:0};await assert.rejects(waitForVideo(v,{timeoutMs:25,pollMs:2}),{name:'CameraFramesTimeout'});});
test('explicitly starts playback and accepts advancing video',async()=>{let played=false;const v={play:async()=>{played=true;},readyState:2,videoWidth:640,videoHeight:480,currentTime:.1};await waitForVideo(v,{timeoutMs:100,pollMs:2});assert.equal(played,true);});
test('playback rejection propagates without a false success',async()=>{const e=Object.assign(Error('denied'),{name:'NotAllowedError'});await assert.rejects(waitForVideo({play:async()=>{throw e;}},{timeoutMs:100}),e);});
