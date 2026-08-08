export default function AppNav({area='COMMAND'}) {
  return <nav className="nav">
    <a href="/" className="brand">RESTO<span>TECH</span> <em>{area}</em></a>
    <div className="navlinks">
      <a href="/admin">Admin</a><a href="/sales">Sales CRM</a><a href="/service">Service Team</a><a href="/client">Client Portal</a>
    </div>
  </nav>;
}