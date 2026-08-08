'use client';
import { useEffect, useMemo, useState } from 'react';

const STAGES=['NEW PROSPECT','CONTACTED','APPOINTMENT SET','MET / PRESENTED','VENDOR ONBOARDING','APPROVED VENDOR','ACTIVE ACCOUNT','PREFERRED VENDOR','DORMANT'];

export default function AccountCRM(){
  const [accounts,setAccounts]=useState([]); const [open,setOpen]=useState(false); const [q,setQ]=useState('');
  const [form,setForm]=useState({name:'',property_name:'',address:'',manager_name:'',phone:'',email:'',units:'',stage:'NEW PROSPECT',account_owner:''});
  async function load(){ const r=await fetch('/api/accounts',{cache:'no-store'}); setAccounts(await r.json()); }
  useEffect(()=>{load()},[]);
  async function create(e){e.preventDefault(); const r=await fetch('/api/accounts',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)}); if(r.ok){setOpen(false);setForm({name:'',property_name:'',address:'',manager_name:'',phone:'',email:'',units:'',stage:'NEW PROSPECT',account_owner:''});load();}}
  async function stage(id,stage){await fetch('/api/accounts/'+id,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({stage})});load()}
  const filtered=useMemo(()=>accounts.filter(a=>[a.name,a.property_name,a.manager_name,a.address].join(' ').toLowerCase().includes(q.toLowerCase())),[accounts,q]);
  return <>
    <div className="toolbar"><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search company, property, manager or address..."/><button className="primaryBtn noWrap" onClick={()=>setOpen(true)}>+ Add Account</button></div>
    <div className="accountGrid">{filtered.map(a=><article className="accountCard" key={a.id}>
      <div className="row"><span className="badge">{a.stage}</span><span className="ownerPill">Owner: {a.account_owner||'Unassigned'}</span></div>
      <h3>{a.name}</h3><div className="clientNumberLine">Client # <b>{a.client_number||'Pending'}</b></div><div className="propertyTitle">{a.property_name||'Property not added yet'}</div>
      <p>{a.address||'No address'}<br/>{a.manager_name||'No manager'} {a.phone?`• ${a.phone}`:''}</p>
      <div className="accountFacts"><span><b>{a.units||'—'}</b> units</span><span><b>{a.jobs_count||0}</b> jobs</span><span><b>${Number(a.revenue||0).toLocaleString()}</b> revenue</span></div>
      <select value={a.stage} onChange={e=>stage(a.id,e.target.value)}>{STAGES.map(s=><option key={s}>{s}</option>)}</select>
    </article>)}</div>
    {open&&<div className="modalBackdrop"><div className="modal wideModal"><div className="row"><div><div className="eyebrow">NEW PROPERTY MANAGEMENT RELATIONSHIP</div><h2>Add Account</h2></div><button className="smallBtn" onClick={()=>setOpen(false)}>Close</button></div>
      <form className="form" onSubmit={create}><div className="grid2"><div className="field"><label>Management Company *</label><input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div><div className="field"><label>Property / Community</label><input value={form.property_name} onChange={e=>setForm({...form,property_name:e.target.value})}/></div></div>
      <div className="field"><label>Property Address</label><input value={form.address} onChange={e=>setForm({...form,address:e.target.value})}/></div>
      <div className="grid2"><div className="field"><label>Manager / Decision Maker</label><input value={form.manager_name} onChange={e=>setForm({...form,manager_name:e.target.value})}/></div><div className="field"><label>Phone</label><input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></div></div>
      <div className="grid2"><div className="field"><label>Email</label><input value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></div><div className="field"><label>Units</label><input type="number" value={form.units} onChange={e=>setForm({...form,units:e.target.value})}/></div></div>
      <div className="grid2"><div className="field"><label>Sales Stage</label><select value={form.stage} onChange={e=>setForm({...form,stage:e.target.value})}>{STAGES.map(s=><option key={s}>{s}</option>)}</select></div><div className="field"><label>Account Owner</label><input value={form.account_owner} onChange={e=>setForm({...form,account_owner:e.target.value})}/></div></div>
      <div className="notice">A unique RESTOTECH Client Number will be generated automatically when this account is created.</div><button className="primaryBtn">Create Account</button></form>
    </div></div>}
  </>;
}