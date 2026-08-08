export default function AppNav({area='PORTAL'}) {
  return <nav className="nav">
    <a href="/" className="navBrandWrap">
      <img src="/dki-restotech-logo.png" alt="DKI Restotech" className="navLogo" />
      <span className="navArea">{area}</span>
    </a>
    <div className="navlinks">
      <a href="/admin">Operations</a><a href="/sales">Property Management CRM</a><a href="/service">Response Center</a><a href="/client">Client Portal</a>
    </div>
  </nav>;
}
