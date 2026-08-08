'use client';
import {useCallback,useEffect,useMemo,useState} from 'react';
import EmergencyRequest from './EmergencyRequest';
import useLiveRefresh from '../lib/useLiveRefresh';

const progress=['NEW REQUEST','REQUEST ACCEPTED','TEAM ASSIGNED','TEAM EN ROUTE','ARRIVED ON SITE','ASSESSMENT IN PROGRESS','MITIGATION STARTED','EQUIPMENT INSTALLED','DRYING / MONITORING','AUTHORIZATION NEEDED','WORK COMPLETED','CLOSED'];

export default function ClientDashboard({account}){
 const[open,setOpen]=useState(false),[jobs,setJobs]=useState([]),[selected,setSelected]=useState(null),[defaultType,setDefaultType]=useState('EMERGENCY');
 const load=useCallback(async()=>{const r=await fetch('/api/emergencies?account_id='+encodeURIComponent(account.id),{cache:'no-store'});const d=await r.json();const rows=Array.isArray(d)?d:[];setJobs(rows);if(selected)setSelected(rows.find(x=>x.id===selected.id)||selected)},[account.id,selected?.id]);
 useEffect(()=>{load()},[]);
 useLiveRefresh(load,{tables:['emergencies','job_updates']});
 const active=useMemo(()=>jobs.filter(j=>!['WORK COMPLETED','CLOSED'].includes(j.status)),[jobs]);
 function request(type){setDefaultType(type);setOpen(true)}

 return <div className="clientWorkspace">
  <section className="clientDashboardHero">
   <div><div className="eyebrow">CLIENT #{account.client_number}</div><h1>{account.name}</h1><p>{account.property_name||'Property Management Account'}{account.address?<><br/>{account.address}</>:null}</p></div>
   <div className="clientRequestButtons"><button className="emergencyBtn" onClick={()=>request('EMERGENCY')}>REQUEST EMERGENCY SERVICE</button><button className="secondaryBtn" onClick={()=>request('NON-EMERGENCY')}>REQUEST NON-EMERGENCY SERVICE</button></div>
  </section>

  <section className="clientMetricStrip"><div><strong>{active.length}</strong><span>Active Requests</span></div><div><strong>{jobs.length}</strong><span>Total Service Files</span></div><div><strong>24/7</strong><span>Emergency Response</span></div></section>

  <section className="clientJobsSection"><div className="sectionBar"><div><h2>Your Service Requests</h2><p>Follow live progress and client-visible updates without calling for status.</p></div><span className="liveIndicator"><i/>LIVE</span></div>
   <div className="clientJobGrid">{jobs.map(j=><button className="clientJobCard" key={j.id} onClick={()=>setSelected(j)}><div className="requestTop"><span className="statusPill">{j.status}</span><small>{new Date(j.created_at).toLocaleDateString()}</small></div><h3>{j.address}</h3><p>{j.unit?`Unit ${j.unit} • `:''}{j.request_type||'EMERGENCY'}</p><div className="miniProgress"><span style={{width:`${Math.max(5,(progress.indexOf(j.status)+1)/progress.length*100)}%`}}/></div><div className="viewFile">VIEW LIVE FILE →</div></button>)}{!jobs.length&&<div className="emptyPanel"><h3>No service requests yet</h3><p>When you request service, the live job file will appear here automatically.</p></div>}</div>
  </section>

  {selected&&<div className="drawerBackdrop" onClick={()=>setSelected(null)}><aside className="jobDrawer clientDrawer" onClick={e=>e.stopPropagation()}><div className="drawerHeader"><div><div className="eyebrow">LIVE SERVICE FILE</div><h2>{selected.address}</h2></div><button className="iconClose" onClick={()=>setSelected(null)}>×</button></div><div className="currentClientStatus"><small>CURRENT STATUS</small><strong>{selected.status}</strong><span>{selected.assigned_team_name?'A response team has been assigned.':'DKI Restotech Admin is managing your request.'}</span></div><div className="clientProgressList">{progress.map((s,i)=>{const current=progress.indexOf(selected.status);return <div className={'clientProgressStep '+(i<current?'done ':'')+(i===current?'active':'')} key={s}><span>{i<current?'✓':i+1}</span><b>{s}</b></div>})}</div><div className="drawerSection"><h3>DKI Restotech Updates</h3><div className="activityTimeline">{(selected.updates||[]).filter(u=>u.visible_to_client).slice().reverse().map((u,i)=><div className="activityItem" key={u.id||i}><i className="clientDot"/><div><b>{u.message}</b><small>{new Date(u.created_at).toLocaleString()}</small></div></div>)}{!(selected.updates||[]).filter(u=>u.visible_to_client).length&&<p className="muted">Your request has been received. Client updates will appear here.</p>}</div></div></aside></div>}
  <EmergencyRequest key={defaultType+String(open)} open={open} onClose={()=>setOpen(false)} source="client_portal" account={account} defaultType={defaultType}/>
 </div>
}
