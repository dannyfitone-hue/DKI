export default function MetricCard({value,label,detail}) {
  return <div className="metric"><div className="metricValue">{value}</div><div className="metricLabel">{label}</div>{detail&&<div className="metricDetail">{detail}</div>}</div>;
}