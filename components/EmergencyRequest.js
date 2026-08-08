'use client';
import {useState} from 'react';

export default function EmergencyRequest({open,onClose,source='public',account=null,defaultType='EMERGENCY'}){
 const [step,setStep]=useState(source==='client_portal'?'request':'choice');
 const [clientNumber,setClientNumber]=useState('');
 const [lookupState,setLookupState]=useState('idle');
 const [lookupError,setLookupError]=useState('');
 const [requestType,setRequestType]=useState(defaultType);
 const [form,setForm]=useState({
   account_name:account?.name||'',
   account_id:account?.id||'',
   address:account?.address||'',
   phone:account?.phone||'',
   unit:'',
   note:''
 });
 const [state,setState]=useState('idle');
 const [created,setCreated]=useState(null);

 if(!open)return null;
 function close(){setStep(source==='client_portal'?'request':'choice');setState('idle');setCreated(null);onClose()}

 async function lookup(e){
   e.preventDefault();setLookupState('loading');setLookupError('');
   const r=await fetch('/api/client-lookup?client_number='+encodeURIComponent(clientNumber.trim()),{cache:'no-store'});
   const d=await r.json();
   if(!r.ok){setLookupState('error');setLookupError(d.error||'Client number not found.');return}
   window.location.href='/client?client='+encodeURIComponent(d.client_number);
 }

 async function submit(e){
   e.preventDefault();setState('sending');
   const r=await fetch('/api/emergencies',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...form,request_type:requestType,source})});
   const d=await r.json();
   if(r.ok){setCreated(d);setState('sent')}else setState('error');
 }

 return <div className="modalBackdrop">
  <div className="modal requestModal">
   <div className="modalTop">
    <div><img src="/dki-restotech-logo.png" className="modalLogo" alt="DKI Restotech"/><div className="eyebrow">SERVICE REQUEST</div></div>
    <button className="iconClose" onClick={close}>×</button>
   </div>

   {step==='choice'&&<>
    <h2>How can we identify your property?</h2>
    <p className="leadText">Existing clients get the fastest experience. New clients can still request emergency service in seconds.</p>
    <div className="choiceGrid">
     <button className="choiceCard" onClick={()=>setStep('existing')}><span className="choiceIcon">#</span><strong>I HAVE A CLIENT NUMBER</strong><small>Enter your DKI Restotech Client Number to open your account.</small></button>
     <button className="choiceCard dangerChoice" onClick={()=>{setRequestType('EMERGENCY');setStep('request')}}><span className="choiceIcon">+</span><strong>DON'T HAVE A CLIENT NUMBER</strong><small>New client — send an emergency request with phone + address.</small></button>
    </div>
   </>}

   {step==='existing'&&<form className="form" onSubmit={lookup}>
    <button type="button" className="backLink" onClick={()=>setStep('choice')}>← Back</button>
    <h2>Enter your Client Number</h2>
    <div className="field"><label>DKI Restotech Client Number</label><input autoFocus required value={clientNumber} onChange={e=>setClientNumber(e.target.value.toUpperCase())} placeholder="RT-XXXXXXXX"/></div>
    <button className="primaryBtn bigAction">{lookupState==='loading'?'OPENING ACCOUNT…':'OPEN CLIENT ACCOUNT →'}</button>
    {lookupState==='error'&&<div className="errorBox">{lookupError}</div>}
   </form>}

   {step==='request'&&state!=='sent'&&<form className="form" onSubmit={submit}>
    {source!=='client_portal'&&<button type="button" className="backLink" onClick={()=>setStep('choice')}>← Back</button>}
    <div className="requestTypeSwitch">
     <button type="button" className={requestType==='EMERGENCY'?'active emergency':''} onClick={()=>setRequestType('EMERGENCY')}>Emergency</button>
     <button type="button" className={requestType==='NON-EMERGENCY'?'active':''} onClick={()=>setRequestType('NON-EMERGENCY')}>Non-Emergency</button>
    </div>
    <h2>{requestType==='EMERGENCY'?'Request emergency response':'Request service'}</h2>
    {source==='client_portal'&&<div className="identifiedAccount"><span>CLIENT IDENTIFIED</span><b>{account?.name}</b><small>{account?.client_number}</small></div>}
    <div className="field"><label>Property Address *</label><input required value={form.address} onChange={e=>setForm({...form,address:e.target.value})} placeholder="Property address"/></div>
    <div className="field"><label>Best Phone Number *</label><input required value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="Phone number"/></div>
    <div className="grid2">
     <div className="field"><label>Unit / Suite</label><input value={form.unit} onChange={e=>setForm({...form,unit:e.target.value})} placeholder="Optional"/></div>
     <div className="field"><label>Quick Description</label><input value={form.note} onChange={e=>setForm({...form,note:e.target.value})} placeholder="Burst pipe, leak, fire…"/></div>
    </div>
    <button className={requestType==='EMERGENCY'?'emergencyBtn':'primaryBtn bigAction'} disabled={state==='sending'}>{state==='sending'?'SENDING…':requestType==='EMERGENCY'?'SEND EMERGENCY REQUEST':'SEND SERVICE REQUEST'}</button>
    {state==='error'&&<div className="errorBox">Could not send the request. Please try again.</div>}
   </form>}

   {state==='sent'&&created&&<div className="requestSuccess">
    <div className="successMark">✓</div>
    <div className="eyebrow">REQUEST RECEIVED</div>
    <h2>DKI Restotech has your request.</h2>
    <p>Your request has been sent to the Admin response queue. Use your private link to follow client-visible updates.</p>
    <a className="primaryBtn bigAction" href={'/status/'+created.public_token}>OPEN LIVE STATUS →</a>
   </div>}
  </div>
 </div>
}
