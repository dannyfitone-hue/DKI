'use client';
import {useCallback,useEffect,useMemo,useRef,useState} from 'react';
import useLiveRefresh from '../lib/useLiveRefresh';

const statuses=['NEW REQUEST','REQUEST ACCEPTED','TEAM ASSIGNED','TEAM EN ROUTE','ARRIVED ON SITE','ASSESSMENT IN PROGRESS','MITIGATION STARTED','EQUIPMENT INSTALLED','DRYING / MONITORING','AUTHORIZATION NEEDED','WORK COMPLETED','CLOSED'];

function fmtTime(v){return v?new Date(v).toLocaleString():'—'}
function shortId(id){return id?.slice(0,8).toUpperCase()}

export default function AdminCommandCenter(){
 const[jobs,setJobs]=useState([]),[accounts,setAccounts]=useState([]),[teams,setTeams]=useState([]);
 const[selected,setSelected]=useState(null),[tab,setTab]=useState('requests');
 const[note,setNote]=useState(''),[visible,setVisible]=useState(false);
 const[teamForm,setTeamForm]=useState({name:'',lead_name:'',phone:''});
 const[accountForm,setAccountForm]=useState({name:'',property_name:'',address:'',manager_name:'',phone:'',email:'',units:'',account_owner:''});
 const[damage,setDamage]=useState({damage_amount:'',damage_description:'',access_instructions:''});
 const previousIds=useRef(new Set());

 const load=useCallback(async()=>{
  const [jr,ar,tr]=await Promise.all([fetch('/api/emergencies',{cache:'no-store'}),fetch('/api/accounts',{cache:'no-store'}),fetch('/api/teams',{cache:'no-store'})]);
  const [j,a,t]=await Promise.all([jr.json(),ar.json(),tr.json()]);
  const rows=Array.isArray(j)?j:[];
  if(previousIds.current.size){
   const incoming=rows.find(x=>!previousIds.current.has(x.id));
   if(incoming){ try{const ctx=new(window.AudioContext||window.webkitAudioContext)();const osc=ctx.createOscillator(),gain=ctx.createGain();osc.connect(gain);gain.connect(ctx.destination);osc.frequency.value=880;gain.gain.value=.07;osc.start();osc.stop(ctx.currentTime+.16)}catch{} }
  }
  previousIds.current=new Set(rows.map(x=>x.id));
  setJobs(rows);setAccounts(Array.isArray(a)?a:[]);setTeams(Array.isArray(t)?t:[]);
  if(selected)setSelected(rows.find(x=>x.id===selected.id)||selected);
 },[selected?.id]);

 useEffect(()=>{load()},[]);
 useLiveRefresh(load,{tables:['emergencies','job_updates','accounts','service_teams']});

 const metrics=useMemo(()=>({
  new:jobs.filter(x=>x.status==='NEW REQUEST').length,
  active:jobs.filter(x=>!['WORK COMPLETED','CLOSED'].includes(x.status)).length,
  dispatched:jobs.filter(x=>x.assigned_team_id&&!['WORK COMPLETED','CLOSED'].includes(x.status)).length,
  clients:accounts.length
 }),[jobs,accounts]);

 async function patchJob(id,data,activityMessage){
  await fetch('/api/emergencies/'+id,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
  if(activityMessage) await addUpdate(id,activityMessage,false,'SYSTEM');
  await load();
 }
 async function addUpdate(id,message,isVisible=visible,event_type='NOTE'){
  if(!message?.trim())return;
  await fetch('/api/emergencies/'+id+'/updates',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message,visible_to_client:isVisible,created_by:'Admin',event_type})});
  setNote('');await load();
 }
 async function assignTeam(teamId){
  const t=teams.find(x=>x.id===teamId);
  if(!t)return;
  await fetch('/api/emergencies/'+selected.id,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({assigned_team_id:t.id,assigned_team_name:t.name,status:'TEAM ASSIGNED',assigned_at:new Date().toISOString()})});
  await addUpdate(selected.id,`Assigned to ${t.name}.`,false,'ASSIGNMENT');
  await addUpdate(selected.id,'A DKI Restotech response team has been assigned to your request.',true,'STATUS');
 }
 async function createTeam(e){e.preventDefault();const r=await fetch('/api/teams',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(teamForm)});if(r.ok){setTeamForm({name:'',lead_name:'',phone:''});load()}}
 async function createAccount(e){e.preventDefault();const r=await fetch('/api/accounts',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(accountForm)});if(r.ok){setAccountForm({name:'',property_name:'',address:'',manager_name:'',phone:'',email:'',units:'',account_owner:''});load()}}

 function openJob(j){setSelected(j);setDamage({damage_amount:j.damage_amount||'',damage_description:j.damage_description||'',access_instructions:j.access_instructions||''})}

 return <div className="commandWrap">
  <section className="adminHero">
   <div><div className="eyebrow">LIVE OPERATIONS</div><h1>Response Command Center</h1><p>Every request, client file, assignment and service update in one live workspace.</p></div>
   <div className="liveIndicator"><i/>LIVE</div>
  </section>

  <section className="metricStrip">
   <div><strong>{metrics.new}</strong><span>New Requests</span></div>
   <div><strong>{metrics.active}</strong><span>Active Calls</span></div>
   <div><strong>{metrics.dispatched}</strong><span>Assigned to Teams</span></div>
   <div><strong>{metrics.clients}</strong><span>Client Accounts</span></div>
  </section>

  <div className="adminTabs">
   <button className={tab==='requests'?'active':''} onClick={()=>setTab('requests')}>Requests</button>
   <button className={tab==='clients'?'active':''} onClick={()=>setTab('clients')}>Clients</button>
   <button className={tab==='teams'?'active':''} onClick={()=>setTab('teams')}>Service Teams</button>
  </div>

  {tab==='requests'&&<section className="adminSection">
   <div className="sectionBar"><div><h2>Live Service Queue</h2><p>Newest requests appear first. Open a file to accept, assign and manage it.</p></div><span className="softPill">{jobs.length} total files</span></div>
   <div className="requestGrid">
    {jobs.map(j=><button className={'requestCard '+(j.status==='NEW REQUEST'?'urgent':'')} key={j.id} onClick={()=>openJob(j)}>
      <div className="requestTop"><span className={'statusPill '+(j.status==='NEW REQUEST'?'red':'')}>{j.status}</span><small>{fmtTime(j.created_at)}</small></div>
      <h3>{j.account_name||'New Client Request'}</h3>
      <p className="addressLine">{j.address}{j.unit?` • Unit ${j.unit}`:''}</p>
      <div className="requestMeta"><span>{j.request_type||'EMERGENCY'}</span><span>{j.assigned_team_name||'Unassigned'}</span></div>
      <div className="fileId">FILE #{shortId(j.id)}</div>
    </button>)}
    {!jobs.length&&<div className="emptyPanel"><div className="emptyIcon">✓</div><h3>No service requests yet</h3><p>New emergency and service requests will appear here automatically.</p></div>}
   </div>
  </section>}

  {tab==='clients'&&<section className="adminSection">
   <div className="splitAdmin">
    <div>
     <div className="sectionBar"><div><h2>Property Management Clients</h2><p>Every active account has its own DKI Restotech Client Number.</p></div></div>
     <div className="accountList">{accounts.map(a=><div className="accountRow" key={a.id}><div><span className="clientCode">{a.client_number}</span><h3>{a.name}</h3><p>{a.property_name||'Property Management'} • {a.address||'Address not added'}</p></div><div className="accountRight"><b>{a.manager_name||'—'}</b><small>{a.phone||''}</small></div></div>)}{!accounts.length&&<div className="emptyPanel"><h3>No client accounts yet</h3><p>Create your first property-management account using the form.</p></div>}</div>
    </div>
    <form className="sideForm" onSubmit={createAccount}><div className="eyebrow">NEW CLIENT</div><h3>Create Client Account</h3>
     <div className="field"><label>Management Company *</label><input required value={accountForm.name} onChange={e=>setAccountForm({...accountForm,name:e.target.value})}/></div>
     <div className="field"><label>Property Name</label><input value={accountForm.property_name} onChange={e=>setAccountForm({...accountForm,property_name:e.target.value})}/></div>
     <div className="field"><label>Property Address</label><input value={accountForm.address} onChange={e=>setAccountForm({...accountForm,address:e.target.value})}/></div>
     <div className="grid2"><div className="field"><label>Manager</label><input value={accountForm.manager_name} onChange={e=>setAccountForm({...accountForm,manager_name:e.target.value})}/></div><div className="field"><label>Phone</label><input value={accountForm.phone} onChange={e=>setAccountForm({...accountForm,phone:e.target.value})}/></div></div>
     <div className="field"><label>Email</label><input type="email" value={accountForm.email} onChange={e=>setAccountForm({...accountForm,email:e.target.value})}/></div>
     <div className="grid2"><div className="field"><label>Units</label><input type="number" value={accountForm.units} onChange={e=>setAccountForm({...accountForm,units:e.target.value})}/></div><div className="field"><label>Account Owner</label><input value={accountForm.account_owner} onChange={e=>setAccountForm({...accountForm,account_owner:e.target.value})} placeholder="Daniel / account manager"/></div></div>
     <button className="primaryBtn bigAction">CREATE CLIENT + NUMBER</button>
    </form>
   </div>
  </section>}

  {tab==='teams'&&<section className="adminSection">
   <div className="splitAdmin">
    <div><div className="sectionBar"><div><h2>Service Teams</h2><p>Admin assigns calls to these teams. Teams only see files assigned to them.</p></div></div>
     <div className="teamCards">{teams.map(t=><div className="teamCard" key={t.id}><div className="teamAvatar">{t.name.slice(0,2).toUpperCase()}</div><div><h3>{t.name}</h3><p>{t.lead_name||'Team lead not set'}{t.phone?` • ${t.phone}`:''}</p><span className="clientCode">{t.access_code}</span></div></div>)}{!teams.length&&<div className="emptyPanel"><h3>No service teams created</h3><p>Add the first field team. A private team access code is created automatically.</p></div>}</div>
    </div>
    <form className="sideForm" onSubmit={createTeam}><div className="eyebrow">FIELD ACCESS</div><h3>Add Service Team</h3>
     <div className="field"><label>Team Name *</label><input required value={teamForm.name} onChange={e=>setTeamForm({...teamForm,name:e.target.value})} placeholder="Team A"/></div>
     <div className="field"><label>Team Lead</label><input value={teamForm.lead_name} onChange={e=>setTeamForm({...teamForm,lead_name:e.target.value})}/></div>
     <div className="field"><label>Phone</label><input value={teamForm.phone} onChange={e=>setTeamForm({...teamForm,phone:e.target.value})}/></div>
     <button className="primaryBtn bigAction">CREATE SERVICE TEAM</button>
    </form>
   </div>
  </section>}

  {selected&&<div className="drawerBackdrop" onClick={()=>setSelected(null)}><aside className="jobDrawer" onClick={e=>e.stopPropagation()}>
   <div className="drawerHeader"><div><div className="eyebrow">CLIENT / JOB FILE #{shortId(selected.id)}</div><h2>{selected.account_name||'New Client Request'}</h2></div><button className="iconClose" onClick={()=>setSelected(null)}>×</button></div>
   <div className="drawerContact"><div><label>PROPERTY</label><b>{selected.address}</b><span>{selected.unit?`Unit ${selected.unit}`:'No unit specified'}</span></div><a href={'tel:'+selected.phone}><small>CALL CLIENT</small><strong>{selected.phone}</strong></a></div>

   <div className="fileStatusRow"><span className={'statusPill '+(selected.status==='NEW REQUEST'?'red':'')}>{selected.status}</span><span>{selected.request_type||'EMERGENCY'}</span><span>{selected.assigned_team_name||'NOT ASSIGNED'}</span></div>

   <div className="actionPanel">
    <div className="field"><label>Admin Status</label><select value={selected.status} onChange={e=>patchJob(selected.id,{status:e.target.value},`Admin changed status to ${e.target.value}.`)}>{statuses.map(s=><option key={s}>{s}</option>)}</select></div>
    <div className="field"><label>Assign Service Team</label><select value={selected.assigned_team_id||''} onChange={e=>assignTeam(e.target.value)}><option value="">Choose team…</option>{teams.map(t=><option value={t.id} key={t.id}>{t.name}</option>)}</select></div>
    {selected.status==='NEW REQUEST'&&<button className="acceptBtn" onClick={()=>patchJob(selected.id,{status:'REQUEST ACCEPTED',accepted_by:'Admin',accepted_at:new Date().toISOString()},'Request accepted by Admin.')}>ACCEPT REQUEST</button>}
   </div>

   <div className="drawerSection"><h3>Job Information</h3>
    <div className="field"><label>Access / Entry Instructions</label><textarea value={damage.access_instructions} onChange={e=>setDamage({...damage,access_instructions:e.target.value})} placeholder="Gate code, leasing office contact, lockbox, parking…"/></div>
    <div className="field"><label>Damage Description</label><textarea value={damage.damage_description} onChange={e=>setDamage({...damage,damage_description:e.target.value})} placeholder="Source, affected areas, visible damage…"/></div>
    <div className="field"><label>Estimated Damage Amount</label><input type="number" value={damage.damage_amount} onChange={e=>setDamage({...damage,damage_amount:e.target.value})} placeholder="0"/></div>
    <button className="smallBtn fullBtn" onClick={()=>patchJob(selected.id,damage,'Job information updated by Admin.')}>SAVE JOB INFORMATION</button>
   </div>

   <div className="drawerSection"><h3>Add Note / Client Update</h3>
    <textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Add information for the service team or publish an update to the client…"/>
    <div className="noteControls"><label className="toggleLabel"><input type="checkbox" checked={visible} onChange={e=>setVisible(e.target.checked)}/><span/> Visible to client</label><button className="primaryBtn" onClick={()=>addUpdate(selected.id,note,visible,'NOTE')}>POST UPDATE</button></div>
    <p className="helper">{visible?'This update will appear on the client dashboard/status page.':'Internal note: Admin + assigned Service Team only.'}</p>
   </div>

   <div className="drawerSection"><div className="row"><h3>Activity Timeline</h3><span className="softPill">{(selected.updates||[]).length} updates</span></div>
    <div className="activityTimeline">{(selected.updates||[]).slice().reverse().map((u,i)=><div className="activityItem" key={u.id||i}><i className={u.visible_to_client?'clientDot':'internalDot'}/><div><b>{u.message}</b><small>{u.created_by||'System'} • {fmtTime(u.created_at)} • {u.visible_to_client?'Client visible':'Internal'}</small></div></div>)}{!(selected.updates||[]).length&&<p className="muted">No activity yet.</p>}</div>
   </div>

   <div className="drawerFooter"><a href={'/status/'+selected.public_token} target="_blank">Open Client Status ↗</a><button onClick={()=>navigator.clipboard?.writeText(location.origin+'/status/'+selected.public_token)}>Copy Status Link</button></div>
  </aside></div>}
 </div>
}
