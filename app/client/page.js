'use client';
import {useEffect,useState} from 'react';
import AppNav from '../../components/AppNav';
import EmergencyRequest from '../../components/EmergencyRequest';

export default function Client(){
 const[open,setOpen]=useState(false);
 const[clientNumber,setClientNumber]=useState('');
 const[account,setAccount]=useState(null);
 const[loading,setLoading]=useState(false);
 const[error,setError]=useState('');

 useEffect(()=>{
   const q=new URLSearchParams(window.location.search);
   const number=q.get('client');
   if(number){setClientNumber(number);lookup(number)}
 },[]);

 async function lookup(number){
   setLoading(true);setError('');
   const r=await fetch('/api/client-lookup?client_number='+encodeURIComponent(number),{cache:'no-store'});
   const data=await r.json();
   if(r.ok)setAccount(data);else setError(data.error||'Client number not found.');
   setLoading(false);
 }

 function submitLookup(e){e.preventDefault();lookup(clientNumber.trim().toUpperCase())}

 if(!account) return <main className="shell">
   <AppNav area="CLIENT"/>
   <section className="clientAccess card">
     <div className="eyebrow">PROPERTY MANAGEMENT CLIENT ACCESS</div>
     <h1 className="accessTitle">Your DKI Restotech account.</h1>
     <p>Enter the Client Number assigned by RESTOTECH to access your property and request emergency service.</p>
     <form className="form accessForm" onSubmit={submitLookup}>
       <div className="field"><label>DKI Restotech Client Number</label><input required value={clientNumber} onChange={e=>setClientNumber(e.target.value.toUpperCase())} placeholder="RT-XXXXXXXX"/></div>
       <button className="primaryBtn bigAction">{loading?'OPENING ACCOUNT…':'OPEN CLIENT ACCOUNT →'}</button>
       {error&&<div className="errorBox">{error}</div>}
     </form>
   </section>
 </main>;

 return <main className="shell">
   <AppNav area="CLIENT"/>
   <div className="clientHero">
     <div>
       <div className="eyebrow">DKI RESTOTECH CLIENT #{account.client_number}</div>
       <h2>{account.name}</h2>
       <p>{account.property_name||'Property Management Account'}{account.address?<><br/>{account.address}</>:null}</p>
     </div>
     <button className="emergencyBtn compactEmergency" onClick={()=>setOpen(true)}>🚨 REQUEST EMERGENCY SERVICE</button>
   </div>

   <section className="grid2 topspace">
     <div className="card">
       <div className="eyebrow">PROPERTY ON FILE</div>
       <h3>{account.property_name||account.name}</h3>
       <p>{account.address||'Property address can be confirmed during the request.'}</p>
       <span className="badge">CLIENT ACCOUNT IDENTIFIED</span>
     </div>
     <div className="card">
       <div className="eyebrow">EMERGENCY RESPONSE</div>
       <h3>One account. Faster requests.</h3>
       <p>Requests submitted here are automatically attached to your DKI Restotech client account so our team immediately knows who is calling.</p>
       <button className="secondaryBtn" onClick={()=>setOpen(true)}>Request Service</button>
     </div>
   </section>

   <EmergencyRequest open={open} onClose={()=>setOpen(false)} source="client_portal" account={account}/>
 </main>
}
