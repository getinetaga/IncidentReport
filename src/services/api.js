const API_URL = typeof process !== 'undefined' && process.env && process.env.API_URL ? process.env.API_URL : 'http://localhost:4000';

// Simple in-memory retry queue for reliability when network is flaky.
const queue = [];
let sending = false;

async function flushQueue(){
  if(sending) return;
  sending = true;
  while(queue.length){
    const {payload, tries} = queue[0];
    try{
      const res = await fetch(API_URL + '/reports', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)});
      if(!res.ok) throw new Error('Bad response');
      queue.shift();
    }catch(e){
      // backoff and retry later
      queue[0].tries = tries + 1;
      const backoff = Math.min(30000, 1000 * Math.pow(2, tries));
      await new Promise(r=>setTimeout(r, backoff));
      break; // leave loop, will retry later
    }
  }
  sending = false;
}

setInterval(()=>{ if(queue.length) flushQueue(); }, 5000);

export async function sendReport(report){
  if(!API_URL) return Promise.resolve();
  try{
    const res = await fetch(API_URL + '/reports', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(report)});
    if(!res.ok) throw new Error('Network error');
    return res.json();
  }catch(e){
    // enqueue for retry
    queue.push({payload: report, tries: 0});
    // schedule flush
    setTimeout(flushQueue, 1000);
    return Promise.resolve();
  }
}

export function pendingQueueLength(){ return queue.length; }
