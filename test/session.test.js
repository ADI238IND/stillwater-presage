import {test} from 'node:test';
import assert from 'node:assert/strict';
import {startupMessage,releaseSession,sdkFailure} from '../src/session.js';
test('failed stop still destroys the SDK session',async()=>{const events=[];await assert.rejects(releaseSession({stop:async()=>{events.push('stop');throw Error('failed');},destroy:async()=>{events.push('destroy');}}));assert.deepEqual(events,['stop','destroy']);});
test('error classification uses wrapped camera errors and SDK codes',()=>{assert.match(startupMessage({cause:{name:'NotAllowedError'}}),/permission denied/);assert.match(startupMessage({code:2}),/authentication/);assert.match(startupMessage({code:4}),/credits/);assert.match(startupMessage({code:'SMARTSPECTRA_IPC_TIMEOUT'}),/did not respond/);});
test('error details and key-like vendor payloads are never displayed',()=>{const message=startupMessage({code:8,message:'secret-key-abcd'});assert.ok(!message.includes('secret-key-abcd'));});

test('SDK diagnostics retain startup details and code while redacting secrets',()=>{
 const msg=sdkFailure({code:8,message:'Processing stalled at Starting for 30 s; apiKey=abc123 token=XYZ https://host/?key=abc123 abc123'},['abc123']);
 assert.match(msg,/SDK 8/);assert.match(msg,/Processing stalled at Starting/);
 assert.ok(!msg.includes('abc123'));assert.ok(!msg.includes('XYZ'));assert.ok(!msg.includes('https://host'));
});
test('SDK diagnostics redact identifying details and limit size',()=>{
 const msg=sdkFailure({code:8,message:'Contact private@example.com. '+ 'x'.repeat(2000)});
 assert.ok(!msg.includes('private@example.com'));assert.ok(msg.length<1200);
});
