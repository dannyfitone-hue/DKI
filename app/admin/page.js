'use client';
import {useEffect,useMemo,useState} from 'react';
import AppNav from '../../components/AppNav';
import JobBoard from '../../components/JobBoard';
import MetricCard from '../../components/MetricCard';

export default function Admin(){
  const [jobs,setJobs]=useState([]);
  useEffect(()=>{let mounted=true;async function load(){const r=await fetch('/api/emergencies',{cache:'no-store'});const data=await r.json();if(mounted)setJobs(Array.isArray(data)?data:[])}load();const t=setInterval(load,5000);return()=>{mounted=false;clearInterval(t)}},[]);
  const m=useMemo(()=>({newCount:jobs.filter(j=>j.status==='NEW REQUEST').length,enRoute:jobs.filter(j=>j.status==='TEAM EN ROUTE').length,active:jobs.filter(j=>!['WORK COMPLETED','CLOSED'].includes(j.status)).length,completed:jobs.filter(j=>['WORK COMPLETED','CLOSED'].includes(j.status)).length}),[jobs]);
  return <main className="shell"><AppNav area="ADMIN"/><div className="eyebrow">OWNER / OPERATIONS COMMAND CENTER</div><div className="pageHead"><div><h2>DKI Restotech Live Operations</h2><p>Emergency intake, service status and active response visibility in one place.</p></div><a href="/sales" className="primaryBtn">Open Sales CRM</a></div><section className="grid4"><MetricCard value={m.newCount} label="New Emergencies" detail="Needs attention"/><MetricCard value={m.enRoute} label="Teams En Route" detail="Current"/><MetricCard value={m.active} label="Active Calls" detail="Open"/><MetricCard value={m.completed} label="Completed" detail="Recorded calls"/></section><section className="card topspace"><div className="row"><div><div className="eyebrow">LIVE QUEUE</div><h2>Emergency & Service Calls</h2></div><span className="badge">Refreshes every 5 sec</span></div><JobBoard editable/></section></main>
}
