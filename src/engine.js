export function lastValid(samples, min, max) {
  if (!Array.isArray(samples)) return null;
  const sample = samples.at(-1);
  return sample && Number.isFinite(sample.value) && sample.value >= min && sample.value <= max && (sample.confidence == null || sample.confidence >= 0.5) ? sample.value : null;
}
export class ReadingEngine {
  constructor(){this.reset();}
  reset(){this.baseline=[];this.rate=null;this.lastAt=null;this.validation=null;this.pace=1;this.trace=[];}
  setValidation(code){this.validation=code;if(code !== 0){this.rate=null;this.lastAt=null;this.pace=1;}}
  ingest(metrics,now){
    if(this.validation !== 0) return false;
    const rate=lastValid(metrics.breathing?.rate,4,45);
    if(rate === null) return false;
    this.rate=rate;this.lastAt=now;
    if(this.baseline.length < 30) this.baseline.push(rate);
    const trace=lastValid(metrics.breathing?.upperTrace,-1e6,1e6);
    if(trace !== null){this.trace.push(trace);if(this.trace.length>180)this.trace.shift();}
    const base=this.baseline.slice().sort((a,b)=>a-b)[Math.floor(this.baseline.length/2)];
    const target=this.baseline.length>=10 ? Math.max(.75,Math.min(1.1,base/rate)) : 1;
    this.pace += (target-this.pace)*.12;
    return true;
  }
  snapshot(now){const fresh=this.lastAt !== null && now-this.lastAt<5000 && this.validation===0;return {fresh,rate:fresh?this.rate:null,pace:fresh?this.pace:1,calibrating:this.baseline.length<30,progress:this.baseline.length/30,trace:fresh?this.trace.slice():[]};}
}
