import {test} from 'node:test';
import assert from 'node:assert/strict';
import {startupMessage,releaseSession} from '../src/session.js';
test('failed stop still destroys the SDK session',async()=>{const events=[];await assert.rejects(releaseSession({stop:async()=>{events.push('stop');throw Error('failed');},destroy:async()=>{events.push('destroy');}}));assert.deepEqual(events,['stop','destroy']);});
test('error classification uses wrapped camera errors and SDK codes',()=>{assert.match(startupMessage({cause:{name:'NotAllowedError'}}),/permission denied/);assert.match(startupMessage({code:2}),/authentication/);assert.match(startupMessage({code:4}),/credits/);assert.match(startupMessage({code:'SMARTSPECTRA_IPC_TIMEOUT'}),/did not respond/);});
test('error details and key-like vendor payloads are never displayed',()=>{const message=startupMessage({code:8,message:'secret-key-abcd'});assert.ok(!message.includes('secret-key-abcd'));});
