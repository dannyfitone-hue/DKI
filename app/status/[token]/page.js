'use client';
import {useEffect,useMemo,useState} from 'react';

const STATUSES=[
 'NEW REQUEST','REQUEST ACCEPTED','TEAM BEING ASSIGNED','TECHNICIAN ASSIGNED',
 'TEAM EN ROUTE','ARRIVED ON SITE','ASSESSMENT IN PROGRESS','MITIGATION STARTED',
 'EQUIPMENT INSTALLED','DRYING / MONITORING','AUTHORIZATION NEEDED','WORK COMPLETED','CLOSED'
];

export default function StatusPage({params}){
  const [job,setJob]=useState(null);
  const [error,setError]=useState('');
  async function load(){
    const r=await fetch('/api/status/'+params.token,{cache:'no-store'});
    const data=await r.json();
    if(r.ok){setJob(data);setError('')}else setError(data.error||'Unable to load status.');
  }
  useEffect(()=>{load();const t=setInterval(load,5000);return()=>clearInterval(t)},[]);
  const currentIndex=useMemo(()=>job?Math.max(0,STATUSES.indexOf(job.status)):0,[job]);

  if(error)return <main className="statusShell"><div className="statusCard"><div className="dkiBrand"><span className="dki">DKI</span><span className="dot">·</span><span className="resto">RESTOTECH</span><small>RESTORATION</small></div><h2>Status Link Unavailable</h2><p>{error}</p></div></main>;
  if(!job)return <main className="statusShell"><div className="statusCard"><div className="dkiBrand"><span className="dki">DKI</span><span className="dot">·</span><span className="resto">RESTOTECH</span><small>RESTORATION</small></div><p>Loading live service status…</p></div></main>;

  return <main className="statusShell">
    <div className="statusCard">
      <div className="statusHeader">
        <div>
          <div className="dkiBrand"><span className="dki">DKI</span><span className="dot">·</span><span className="resto">RESTOTECH</span><small>RESTORATION</small></div>
          <div className="eyebrow">LIVE SERVICE STATUS</div>
        </div>
        <span className="livePill"><i></i> LIVE</span>
      </div>
      <h1 className="statusTitle">We're on it.</h1>
      <p className="statusAddress">{job.address}{job.unit?` • Unit ${job.unit}`:''}</p>

      <div className="currentStatusCard">
        <small>CURRENT STATUS</small>
        <strong>{job.status}</strong>
        <span>Updates refresh automatically.</span>
      </div>

      <div className="progressTrack">
        {STATUSES.map((s,i)=><div className={'progressNode '+(i<currentIndex?'done ':'')+(i===currentIndex?'active':'')} key={s}>
          <span>{i<currentIndex?'✓':i+1}</span>
          <div><b>{s}</b>{i===currentIndex&&<small>Current step</small>}</div>
        </div>)}
      </div>

      <div className="statusUpdates">
        <div className="row"><h2>DKI Restotech Updates</h2><span className="muted">Auto refresh</span></div>
        {(job.updates||[]).length ? job.updates.slice().reverse().map((u,i)=><div className="clientUpdate" key={u.id||i}>
          <b>{u.message}</b>
          <small>{new Date(u.created_at).toLocaleString()}</small>
        </div>) : <div className="emptyState">Your request has been received. Service updates will appear here as the DKI Restotech team posts them.</div>}
      </div>
    </div>
  </main>
}
