'use client';
import {useEffect,useMemo,useState} from 'react';
import AppNav from '../../components/AppNav';
import AccountCRM from '../../components/AccountCRM';
import MetricCard from '../../components/MetricCard';

export default function Sales(){
 const[accounts,setAccounts]=useState([]);
 useEffect(()=>{let mounted=true;async function load(){const r=await fetch('/api/accounts',{cache:'no-store'});const d=await r.json();if(mounted)setAccounts(Array.isArray(d)?d:[])}load();const t=setInterval(load,5000);return()=>{mounted=false;clearInterval(t)}},[]);
 const m=useMemo(()=>({prospects:accounts.filter(a=>!['ACTIVE ACCOUNT','PREFERRED VENDOR'].includes(a.stage)).length,appointments:accounts.filter(a=>a.stage==='APPOINTMENT SET').length,active:accounts.filter(a=>['ACTIVE ACCOUNT','PREFERRED VENDOR'].includes(a.stage)).length,total:accounts.length}),[accounts]);
 return <main className="shell"><AppNav area="SALES"/><div className="eyebrow">PROPERTY MANAGEMENT GROWTH CRM</div><div className="pageHead"><div><h2>Accounts & Sales Pipeline</h2><p>Track every property-management relationship from first contact through active-vendor status.</p></div></div><section className="grid4"><MetricCard value={m.prospects} label="Open Prospects"/><MetricCard value={m.appointments} label="Appointments Set"/><MetricCard value={m.active} label="Active Accounts"/><MetricCard value={m.total} label="Total Accounts"/></section><section className="card topspace"><AccountCRM/></section></main>
}
