'use client';
import {useState} from 'react';
import EmergencyRequest from '../components/EmergencyRequest';

export default function Home(){
 const[open,setOpen]=useState(false);
 return <main>
   <header className="publicHeader">
     <div className="publicNav">
       <div className="officialBrand officialBrandHeader"><img src="/dki-restotech-logo.png" alt="DKI Restotech"/><small>PROPERTY MANAGEMENT RESPONSE PORTAL</small></div>
       <div className="headerActions">
         <a className="phoneLink" href="tel:9497968533">24/7 Emergency&nbsp; 949-796-8533</a>
         <a className="portalLink" href="/client">Client Portal</a>
       </div>
     </div>
   </header>

   <section className="brandHero">
     <div className="brandHeroInner">
       <div className="heroCopy">
         <div className="eyebrow">24/7 PROPERTY DAMAGE RESPONSE • LA & ORANGE COUNTY</div>
         <h1>One call.<br/>One team.<br/><em>Full recovery.</em></h1>
         <p>Fast restoration response for property-management teams — from emergency mitigation and documentation through drying, cleanup and full reconstruction.</p>
         <div className="heroButtons">
           <button className="emergencyBtn heroEmergency" onClick={()=>setOpen(true)}>REQUEST EMERGENCY SERVICE</button>
           <a className="outlineAction" href="/client">ACCESS CLIENT PORTAL</a>
         </div>
         <div className="trustRow"><span>IICRC-Certified</span><span>Family-Owned Since 1980</span><span>Licensed & Insured</span><span>24/7/365</span></div>
       </div>
       <aside className="responsePanel">
         <span className="responseNumber">60</span><strong>MIN</strong>
         <h3>Typical on-site response</h3>
         <p>Local crews serving Los Angeles and Orange County when minutes matter.</p>
         <div className="responseDivider"></div>
         <b>Already a DKI Restotech client?</b>
         <p>Use your Client Number to identify your account and request service faster.</p>
         <button className="secondaryBtn" onClick={()=>setOpen(true)}>REQUEST SERVICE →</button>
       </aside>
     </div>
   </section>

   <section className="publicContent">
     <div className="sectionIntro">
       <div className="eyebrow">BUILT FOR PROPERTY MANAGEMENT</div>
       <h2>Emergency response without the status-chasing.</h2>
       <p>Request service in seconds, then follow the job from dispatch through completion from one live status experience.</p>
     </div>
     <div className="featureGrid">
       <article><span>01</span><h3>Request</h3><p>Existing clients identify their account with a Client Number. New clients only need a phone number and property address.</p></article>
       <article><span>02</span><h3>Dispatch</h3><p>Your request reaches the DKI Restotech response team and becomes visible in the operations dashboard immediately.</p></article>
       <article><span>03</span><h3>Track</h3><p>Follow client-visible milestones and service updates through your private live-status page.</p></article>
       <article><span>04</span><h3>Recover</h3><p>One certified team can carry the loss from mitigation and documentation through restoration and reconstruction.</p></article>
     </div>
   </section>

   <section className="serviceBand">
     <div><small>FULL-SERVICE RESTORATION</small><h2>From first call to final rebuild.</h2></div>
     <div className="serviceChips"><span>Water Damage</span><span>Fire & Smoke</span><span>Mold Remediation</span><span>Structural Damage</span><span>Reconstruction</span><span>Commercial Restoration</span></div>
   </section>

   <footer className="publicFooter">
     <div className="officialBrand"><img src="/dki-restotech-logo.png" alt="DKI Restotech"/><small>RESTORATION</small></div>
     <p>Family-owned restoration and reconstruction serving Southern California since 1980.</p>
     <div><a href="tel:9497968533">949-796-8533</a> <span>•</span> <a href="https://dkirestotech.com">dkirestotech.com</a></div>
   </footer>

   <button className="emergencyBtn stickyEmergency" onClick={()=>setOpen(true)}>REQUEST EMERGENCY SERVICE</button>
   <EmergencyRequest open={open} onClose={()=>setOpen(false)}/>
 </main>
}
