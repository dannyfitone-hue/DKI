'use client';
import { useState } from 'react';

export default function EmergencyRequest({open,onClose,prefill={},source='public',account=null}) {
  const [step,setStep]=useState(source==='client_portal' ? 'request' : 'choice');
  const [clientNumber,setClientNumber]=useState('');
  const [lookupState,setLookupState]=useState('idle');
  const [lookupError,setLookupError]=useState('');
  const [form,setForm]=useState({
    account_name: account?.name || prefill.account_name || '',
    account_id: account?.id || '',
    address: account?.address || prefill.address || '',
    phone: account?.phone || prefill.phone || '',
    unit:'',
    note:''
  });
  const [state,setState]=useState('idle');
  const [created,setCreated]=useState(null);

  if(!open) return null;

  function close(){
    setStep(source==='client_portal' ? 'request' : 'choice');
    setClientNumber('');
    setLookupState('idle');
    setLookupError('');
    setState('idle');
    setCreated(null);
    onClose();
  }

  async function findClient(e){
    e.preventDefault();
    setLookupState('loading');
    setLookupError('');
    const r=await fetch('/api/client-lookup?client_number='+encodeURIComponent(clientNumber.trim()),{cache:'no-store'});
    const data=await r.json();
    if(!r.ok){
      setLookupState('error');
      setLookupError(data.error || 'Client number not found.');
      return;
    }
    setLookupState('found');
    window.location.href='/client?client='+encodeURIComponent(data.client_number);
  }

  async function submit(e){
    e.preventDefault();
    setState('sending');
    const r=await fetch('/api/emergencies',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({...form,source})
    });
    const data=await r.json();
    if(r.ok){
      setCreated(data);
      setState('sent');
    } else {
      setState('error');
    }
  }

  return <div className="modalBackdrop">
    <div className="modal">
      <div className="row">
        <div>
          <div className="eyebrow">24/7 FAST RESPONSE</div>
          <h2 style={{marginTop:6}}>Request Emergency Service</h2>
        </div>
        <button className="smallBtn" onClick={close}>Close</button>
      </div>

      {step==='choice' && <>
        <p>Choose the fastest way to identify your property.</p>
        <div className="choiceGrid">
          <button className="choiceCard" onClick={()=>setStep('existing')}>
            <span className="choiceIcon">#</span>
            <strong>I HAVE A CLIENT NUMBER</strong>
            <small>Open your DKI Restotech client account and request service.</small>
          </button>
          <button className="choiceCard newClientChoice" onClick={()=>setStep('request')}>
            <span className="choiceIcon">+</span>
            <strong>DON'T HAVE A CLIENT NUMBER</strong>
            <small>New client — request emergency service now.</small>
          </button>
        </div>
      </>}

      {step==='existing' && <form className="form" onSubmit={findClient}>
        <button type="button" className="backLink" onClick={()=>setStep('choice')}>← Back</button>
        <div className="notice">Enter the DKI Restotech Client Number assigned to your property-management account.</div>
        <div className="field">
          <label>DKI Restotech Client Number *</label>
          <input required autoFocus value={clientNumber} onChange={e=>setClientNumber(e.target.value.toUpperCase())} placeholder="RT-XXXXXXXX" />
        </div>
        <button className="primaryBtn bigAction" disabled={lookupState==='loading'}>
          {lookupState==='loading'?'LOOKING UP ACCOUNT…':'OPEN MY CLIENT ACCOUNT →'}
        </button>
        {lookupState==='error' && <div className="errorBox">{lookupError}</div>}
      </form>}

      {step==='request' && state!=='sent' && <form className="form" onSubmit={submit}>
        {source!=='client_portal' && <button type="button" className="backLink" onClick={()=>setStep('choice')}>← Back</button>}
        {source==='client_portal' ? (
          <div className="success compactSuccess"><b>{account?.name || form.account_name}</b><br/>Your client account is already identified.</div>
        ) : (
          <div className="notice"><b>New client emergency.</b> Only phone number and property address are required to notify RESTOTECH.</div>
        )}
        <div className="field">
          <label>Property Address *</label>
          <input required value={form.address} onChange={e=>setForm({...form,address:e.target.value})} placeholder="Property street address" />
        </div>
        <div className="field">
          <label>Best Phone Number *</label>
          <input required value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="Phone number" />
        </div>
        <div className="grid2">
          <div className="field">
            <label>Unit (optional)</label>
            <input value={form.unit} onChange={e=>setForm({...form,unit:e.target.value})} placeholder="Unit #" />
          </div>
          <div className="field">
            <label>Quick Note (optional)</label>
            <input value={form.note} onChange={e=>setForm({...form,note:e.target.value})} placeholder="Pipe burst / flooding" />
          </div>
        </div>
        <button className="emergencyBtn" disabled={state==='sending'}>
          {state==='sending'?'SENDING REQUEST…':'🚨 SEND EMERGENCY REQUEST'}
        </button>
        {state==='error'&&<div className="errorBox">The request could not be sent. Please try again.</div>}
      </form>}

      {state==='sent' && created && <div className="success requestSuccess">
        <div className="successMark">✓</div>
        <h3>DKI Restotech has received your request.</h3>
        <p>Your live service-status page is ready. Keep this link so you can follow RESTOTECH updates without calling for status.</p>
        <a className="primaryBtn bigAction" href={'/status/'+created.public_token}>OPEN LIVE SERVICE STATUS →</a>
        <div className="statusLinkBox">
          <label>Your private status link</label>
          <div>{typeof window!=='undefined' ? window.location.origin : ''}/status/{created.public_token}</div>
        </div>
      </div>}
    </div>
  </div>
}
