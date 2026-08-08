'use client';
import {useCallback,useEffect,useState} from 'react';
import useLiveRefresh from '../lib/useLiveRefresh';

const fieldStatuses=['TEAM ASSIGNED','TEAM EN ROUTE','ARRIVED ON SITE','ASSESSMENT IN PROGRESS','MITIGATION STARTED','EQUIPMENT INSTALLED','DRYING / MONITORING','AUTHORIZATION NEEDED','WORK COMPLETED'];
function fmt(v){return new Date(v).toLocaleString()}

export default function ServiceTeamWorkspace(){
 const[code,setCode]=useState(''),[team,setTeam]=useState(null),[error,setError]=useState('');
 const[jobs,setJobs]=useState([]),[selected,setSelected]=useState(null),[note,setNote]=useState('');

 async function login(e){e.preventDefault();setError('');const r=await fetch('/api/team-access?code='+encodeURIComponent(code));const d=await r.json();if(!r.ok){setError(d.error||'Access code not found');return}setTeam(d)}
 const load=useCallback(async()=>{if(!team)return;const r=await fetch('/api/emergencies?assigned_team_id='+encodeURIComponent(team.id),{cache:'no-store'});const d=await r.json();const rows=Array.isArray(d)?d:[];setJobs(rows);if(selected)setSelected(rows.find(x=>x.id===selected.id)||selected)},[team?.id,selected?.id]);
 useEffect(()=>{load()},[team?.id]);
 useLiveRefresh(load,{tables:['emergencies','job_updates']});

 async function patch(id,data,message,clientVisible=true){
  await fetch('/api/emergencies/'+id,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
  if(message)await fetch('/api/emergencies/'+id+'/updates',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message,visible_to_client:clientVisible,created_by:team.name,event_type:'STATUS'})});
  await load();
 }
 async function addNote(){
  if(!note.trim())return;
  await fetch('/api/emergencies/'+selected.id+'/updates',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:note,visible_to_client:false,created_by:team.name,event_type:'FIELD_NOTE'})});
  setNote('');load();
 }

 if(!team)return <section className="teamLogin">
  <img src="/dki-restotech-logo.png" alt="DKI Restotech" className="teamLoginLogo"/>
  <div className="eyebrow">SERVICE TEAM ACCESS</div><h1>Assigned jobs only.</h1><p>Enter the team access code issued by Admin. Client requests do not appear here until Admin assigns them.</p>
  <form onSubmit={login} className="form"><div className="field"><label>Team Access Code</label><input required value={code} onChange={e=>setCode(e.target.value.toUpperCase())} placeholder="TEAM-XXXXXX"/></div><button className="primaryBtn bigAction">OPEN TEAM DASHBOARD →</button>{error&&<div className="errorBox">{error}</div>}</form>
 </section>;

 return <div className="serviceWorkspace">
  <section className="serviceHero"><div><div className="eyebrow">SERVICE TEAM DASHBOARD</div><h1>{team.name}</h1><p>{team.lead_name||'Field Response Team'}{team.phone?` • ${team.phone}`:''}</p></div><button className="smallBtn" onClick={()=>{setTeam(null);setJobs([])}}>Switch Team</button></section>
  <section className="assignedList">
   {jobs.filter(j=>j.status!=='CLOSED').map(j=><button key={j.id} className="fieldJobCard" onClick={()=>setSelected(j)}>
    <div className="fieldCardTop"><span className="statusPill">{j.status}</span><small>{fmt(j.created_at)}</small></div><h2>{j.address}</h2><p>{j.unit?`Unit ${j.unit} • `:''}{j.account_name||'New Client'}</p><div className="fieldActionsPreview"><span>CALL {j.phone}</span><span>OPEN JOB →</span></div>
   </button>)}
   {!jobs.filter(j=>j.status!=='CLOSED').length&&<div className="emptyPanel"><div className="emptyIcon">✓</div><h3>No assigned calls</h3><p>When Admin assigns a request to {team.name}, the job file will appear here automatically.</p></div>}
  </section>

  {selected&&<div className="drawerBackdrop" onClick={()=>setSelected(null)}><aside className="jobDrawer serviceDrawer" onClick={e=>e.stopPropagation()}>
   <div className="drawerHeader"><div><div className="eyebrow">ASSIGNED JOB</div><h2>{selected.address}</h2></div><button className="iconClose" onClick={()=>setSelected(null)}>×</button></div>
   <div className="serviceContactActions"><a href={'tel:'+selected.phone}>CALL CLIENT<br/><b>{selected.phone}</b></a><a href={'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(selected.address)} target="_blank">OPEN NAVIGATION<br/><b>Directions ↗</b></a></div>
   <div className="serviceInfo"><div><label>CLIENT</label><b>{selected.account_name||'New Client'}</b></div><div><label>UNIT</label><b>{selected.unit||'—'}</b></div><div><label>REQUEST</label><b>{selected.request_type||'EMERGENCY'}</b></div></div>
   {selected.note&&<div className="fieldBrief"><label>CLIENT REQUEST NOTE</label><p>{selected.note}</p></div>}
   {selected.access_instructions&&<div className="fieldBrief attention"><label>ACCESS INSTRUCTIONS</label><p>{selected.access_instructions}</p></div>}
   {selected.damage_description&&<div className="fieldBrief"><label>DAMAGE INFORMATION</label><p>{selected.damage_description}</p></div>}

   <div className="drawerSection"><h3>Update Field Status</h3><div className="statusButtonGrid">{fieldStatuses.map(s=><button className={selected.status===s?'active':''} key={s} onClick={()=>patch(selected.id,{status:s},s==='TEAM EN ROUTE'?'Your DKI Restotech response team is en route.':s==='ARRIVED ON SITE'?'The DKI Restotech team has arrived on site.':`Service status updated: ${s}.`,true)}>{s}</button>)}</div></div>

   <div className="drawerSection"><h3>Internal Field Note</h3><textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="What Admin needs to know…"/><button className="primaryBtn fullBtn" onClick={addNote}>ADD INTERNAL NOTE</button><p className="helper">Visible to Admin, not the client.</p></div>

   <div className="drawerSection"><h3>Shared Job Timeline</h3><div className="activityTimeline">{(selected.updates||[]).slice().reverse().map((u,i)=><div className="activityItem" key={u.id||i}><i className={u.visible_to_client?'clientDot':'internalDot'}/><div><b>{u.message}</b><small>{u.created_by} • {fmt(u.created_at)} • {u.visible_to_client?'Client visible':'Internal'}</small></div></div>)}</div></div>
  </aside></div>}
 </div>
}
