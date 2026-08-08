'use client';
import {useEffect,useMemo,useState} from 'react';
import AppNav from '../../components/AppNav';
import JobBoard from '../../components/JobBoard';
import MetricCard from '../../components/MetricCard';

export default function Service(){
 const[jobs,setJobs]=useState([]);
 useEffect(()=>{let mounted=true;async function load(){const r=await fetch('/api/emergencies',{cache:'no-store'});const d=await r.json();if(mounted)setJobs(Array.isArray(d)?d:[])}load();const t=setInterval(load,5000);return()=>{mounted=false;clearInterval(t)}},[]);
 const m=useMemo(()=>({unaccepted:jobs.filter(j=>j.status==='NEW REQUEST').length,enRoute:jobs.filter(j=>j.status==='TEAM EN ROUTE').length,onSite:jobs.filter(j=>['ARRIVED ON SITE','ASSESSMENT IN PROGRESS','MITIGATION STARTED','EQUIPMENT INSTALLED'].includes(j.status)).length,monitoring:jobs.filter(j=>j.status==='DRYING / MONITORING').length}),[jobs]);
 return <main className="shell"><AppNav area="SERVICE"/><div className="eyebrow">SERVICE TEAM MANAGER</div><div className="pageHead"><div><h2>Dispatch & Field Updates</h2><p>Accept calls, update service status, document damage and publish approved updates for property-management clients.</p></div></div><section className="grid4"><MetricCard value={m.unaccepted} label="Unaccepted"/><MetricCard value={m.enRoute} label="En Route"/><MetricCard value={m.onSite} label="On Site"/><MetricCard value={m.monitoring} label="Monitoring"/></section><div className="notice topspace">Updates marked <b>Client visible</b> are intended for the property-management portal. Internal notes remain RESTOTECH-only.</div><section className="card topspace"><JobBoard editable/></section></main>
}
