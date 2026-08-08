export default function AppNav({area='PORTAL',role='public'}){
 return <nav className="nav modernNav">
  <a href="/" className="navBrandWrap"><img src="/dki-restotech-logo.png" alt="DKI Restotech" className="navLogo"/><span className="navArea">{area}</span></a>
  <div className="navlinks">
   {role==='admin'&&<><a href="/admin">Admin Dashboard</a><a href="/client">Client Portal</a><a href="/service">Service Team</a></>}
   {role==='service'&&<><a href="/service">Assigned Jobs</a><a href="/">Company Site</a></>}
   {role==='client'&&<><a href="/client">Client Dashboard</a><a href="/">DKI Restotech</a></>}
   {role==='public'&&<><a href="/client">Client Portal</a></>}
  </div>
 </nav>
}
