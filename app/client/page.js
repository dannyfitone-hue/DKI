'use client';
import {useEffect,useState} from 'react';
import AppNav from '../../components/AppNav';
import ClientDashboard from '../../components/ClientDashboard';

export default function Client(){
 const[clientNumber,setClientNumber]=useState(''),[account,setAccount]=useState(null),[loading,setLoading]=useState(false),[error,setError]=useState('');
 useEffect(()=>{const q=new URLSearchParams(window.location.search);const n=q.get('client');if(n){setClientNumber(n);lookup(n)}},[]);
 async function lookup(n){setLoading(true);setError('');const r=await fetch('/api/client-lookup?client_number='+encodeURIComponent(n),{cache:'no-store'});const d=await r.json();if(r.ok)setAccount(d);else setError(d.error||'Client number not found.');setLoading(false)}
 if(!account)return <main className="shell dashboardShell"><AppNav area="CLIENT PORTAL" role="client"/><section className="premiumLogin"><img src="/dki-restotech-logo.png" alt="DKI Restotech"/><div className="eyebrow">PROPERTY MANAGEMENT CLIENT ACCESS</div><h1>Your response portal.</h1><p>Enter your DKI Restotech Client Number to request service and follow every active job in real time.</p><form onSubmit={e=>{e.preventDefault();lookup(clientNumber.trim().toUpperCase())}} className="form"><div className="field"><label>DKI Restotech Client Number</label><input required value={clientNumber} onChange={e=>setClientNumber(e.target.value.toUpperCase())} placeholder="RT-XXXXXXXX"/></div><button className="primaryBtn bigAction">{loading?'OPENING…':'OPEN CLIENT DASHBOARD →'}</button>{error&&<div className="errorBox">{error}</div>}</form></section></main>;
 return <main className="shell dashboardShell"><AppNav area="CLIENT PORTAL" role="client"/><ClientDashboard account={account}/></main>
}
