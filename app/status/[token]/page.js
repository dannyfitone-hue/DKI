'use client';
import {useCallback,useEffect,useMemo,useState} from 'react';
import useLiveRefresh from '../../../lib/useLiveRefresh';
const steps=['NEW REQUEST','REQUEST ACCEPTED','TEAM ASSIGNED','TEAM EN ROUTE','ARRIVED ON SITE','ASSESSMENT IN PROGRESS','MITIGATION STARTED','EQUIPMENT INSTALLED','DRYING / MONITORING','AUTHORIZATION NEEDED','WORK COMPLETED','CLOSED'];
export default function StatusPage({params}){
 const[job,setJob]=useState(null),[error,setError]=useState('');
 const load=useCallback(async()=>{const r=await fetch('/api/status/'+params.token,{cache:'no-store'});const d=await r.json();if(r.ok){setJob(d);setError('')}else setError(d.error||'Status link unavailable.')},[params.token]);
 useEffect(()=>{load()},[]);
 useLiveRefresh(load,{tables:['emergencies','job_updates']});
 const current=useMemo(()=>job?Math.max(0,steps.indexOf(job.status)):0,[job]);
 if(error)return <main className="statusShell"><div className="statusCard"><img src="/dki-restotech-logo.png" className="statusLogo"/><h2>Status link unavailable</h2><p>{error}</p></div></main>;
 if(!job)return <main className="statusShell"><div className="statusCard"><img src="/dki-restotech-logo.png" className="statusLogo"/><p>Loading live service status…</p></div></main>;
 return <main className="statusShell"><div className="statusCard">
  <div className="statusHeader"><img src="/dki-restotech-logo.png" className="statusLogo"/><span className="liveIndicator"><i/>LIVE</span></div>
  <div className="eyebrow topspace">LIVE SERVICE STATUS</div><h1 className="statusTitle">We're on it.</h1><p className="statusAddress">{job.address}{job.unit?` • Unit ${job.unit}`:''}</p>
  <div className="currentClientStatus"><small>CURRENT STATUS</small><strong>{job.status}</strong><span>Client-visible updates appear automatically.</span></div>
  <div className="clientProgressList">{steps.map((s,i)=><div className={'clientProgressStep '+(i<current?'done ':'')+(i===current?'active':'')} key={s}><span>{i<current?'✓':i+1}</span><b>{s}</b></div>)}</div>
  <div className="drawerSection"><h3>DKI Restotech Updates</h3><div className="activityTimeline">{(job.updates||[]).filter(u=>u.visible_to_client).slice().reverse().map((u,i)=><div className="activityItem" key={u.id||i}><i className="clientDot"/><div><b>{u.message}</b><small>{new Date(u.created_at).toLocaleString()}</small></div></div>)}{!(job.updates||[]).filter(u=>u.visible_to_client).length&&<p className="muted">Your request has been received. Updates will appear here as the team progresses.</p>}</div></div>
 </div></main>
}
