'use client';
import {useState} from 'react';
import EmergencyRequest from '../components/EmergencyRequest';
import AppNav from '../components/AppNav';

export default function Home(){
  const[open,setOpen]=useState(false);
  return <main className="shell">
    <AppNav/>
    <section className="hero">
      <div className="heroCopy">
        <div className="eyebrow">24/7 PROPERTY RESTORATION RESPONSE</div>
        <h1>Property damage.<br/><span>One tap away.</span></h1>
        <p className="lead">Request emergency restoration service in seconds. RESTOTECH receives the request immediately so the response team can move quickly.</p>
        <button className="emergencyBtn" onClick={()=>setOpen(true)}>🚨 REQUEST EMERGENCY SERVICE</button>
        <div className="micro">Existing clients use their RESTOTECH Client Number • New clients can request service with only phone + property address</div>
      </div>
      <div className="commandPreview card">
        <div className="eyebrow">RESTOTECH RESPONSE SYSTEM</div>
        <h2>Fast request. Clear communication.</h2>
        <div className="responseSteps">
          <div><b>1</b><span><strong>Request received</strong><small>RESTOTECH is notified immediately.</small></span></div>
          <div><b>2</b><span><strong>Response coordinated</strong><small>The service team accepts and manages the call.</small></span></div>
          <div><b>3</b><span><strong>Status stays visible</strong><small>Registered clients can follow approved job updates from their portal.</small></span></div>
        </div>
      </div>
    </section>
    <section className="valueGrid topspace">
      <div><span>01</span><h3>Request in seconds</h3><p>Existing clients enter their Client Number and go directly into their account. New clients can request with only a phone number and property address.</p></div>
      <div><span>02</span><h3>RESTOTECH gets alerted</h3><p>Every request enters the operations queue so the service team can accept it and begin response.</p></div>
      <div><span>03</span><h3>Follow the work</h3><p>Every new emergency request receives a private live-status link where the client can follow RESTOTECH updates in real time.</p></div>
    </section>
    <section className="cta card topspace"><div><div className="eyebrow">PROPERTY MANAGEMENT PARTNERS</div><h2>RESTOTECH Client Portal</h2><p>Registered property-management partners receive a dedicated dashboard for emergency requests, properties and active service status.</p></div><a href="/client" className="primaryBtn">Client Portal →</a></section>
    <button className="emergencyBtn stickyEmergency" onClick={()=>setOpen(true)}>🚨 EMERGENCY SERVICE</button>
    <EmergencyRequest open={open} onClose={()=>setOpen(false)}/>
  </main>
}
