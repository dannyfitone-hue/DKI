const supabaseUrl=process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey=process.env.SUPABASE_SERVICE_ROLE_KEY;

let emergencies=[];
let accounts=[];

function headers(){return{apikey:serviceKey,Authorization:`Bearer ${serviceKey}`,'Content-Type':'application/json',Prefer:'return=representation'}}
async function rest(path,options={}){const res=await fetch(`${supabaseUrl}/rest/v1/${path}`,{...options,headers:{...headers(),...(options.headers||{})},cache:'no-store'});if(!res.ok)throw new Error(await res.text());return res.status===204?null:res.json()}
function makeClientNumber(){return 'RT-'+crypto.randomUUID().replaceAll('-','').slice(0,8).toUpperCase()}
function makePublicToken(){return crypto.randomUUID().replaceAll('-','')}

export async function listEmergencies(){
  if(!supabaseUrl||!serviceKey)return emergencies;
  const rows=await rest('emergencies?select=*,job_updates(*)&order=created_at.desc');
  return rows.map(x=>({...x,updates:x.job_updates||[]}))
}

export async function createEmergency(data){
  const record={
    account_id:data.account_id||null,
    account_name:data.account_name||null,
    address:data.address,
    phone:data.phone,
    unit:data.unit||null,
    note:data.note||null,
    source:data.source||'public',
    status:'NEW REQUEST',
    public_token:makePublicToken()
  };
  if(!supabaseUrl||!serviceKey){
    const item={id:crypto.randomUUID(),...record,created_at:new Date().toISOString(),updates:[]};
    emergencies=[item,...emergencies];
    return item
  }
  return(await rest('emergencies',{method:'POST',body:JSON.stringify(record)}))[0]
}

export async function updateEmergency(id,data){
  if(!supabaseUrl||!serviceKey){
    emergencies=emergencies.map(x=>x.id===id?{...x,...data,updated_at:new Date().toISOString()}:x);
    return emergencies.find(x=>x.id===id)
  }
  return(await rest(`emergencies?id=eq.${encodeURIComponent(id)}`,{method:'PATCH',body:JSON.stringify({...data,updated_at:new Date().toISOString()})}))[0]
}

export async function getEmergencyByToken(token){
  if(!supabaseUrl||!serviceKey)return emergencies.find(x=>x.public_token===token)||null;
  const rows=await rest(`emergencies?public_token=eq.${encodeURIComponent(token)}&select=*,job_updates(*)&limit=1`);
  if(!rows?.length)return null;
  return {...rows[0],updates:rows[0].job_updates||[]}
}

export async function addJobUpdate(id,data){
  const row={message:data.message,visible_to_client:data.visible_to_client!==false,created_by:data.created_by||'RESTOTECH Service Team',created_at:new Date().toISOString()};
  if(!supabaseUrl||!serviceKey){
    emergencies=emergencies.map(x=>x.id===id?{...x,updates:[...(x.updates||[]),{id:crypto.randomUUID(),...row}]}:x);
    return row
  }
  return(await rest('job_updates',{method:'POST',body:JSON.stringify({...row,emergency_id:id})}))[0]
}

export async function listAccounts(){
  if(!supabaseUrl||!serviceKey)return accounts;
  return rest('accounts?select=*&order=created_at.desc')
}

export async function findAccountByClientNumber(clientNumber){
  const normalized=(clientNumber||'').trim().toUpperCase();
  if(!normalized)return null;
  if(!supabaseUrl||!serviceKey)return accounts.find(a=>(a.client_number||'').toUpperCase()===normalized)||null;
  const rows=await rest(`accounts?client_number=eq.${encodeURIComponent(normalized)}&select=*&limit=1`);
  return rows?.[0]||null
}

export async function createAccount(data){
  const record={
    client_number:data.client_number?.trim().toUpperCase()||makeClientNumber(),
    name:data.name,
    property_name:data.property_name||null,
    address:data.address||null,
    manager_name:data.manager_name||null,
    phone:data.phone||null,
    email:data.email||null,
    units:data.units?Number(data.units):null,
    stage:data.stage||'NEW PROSPECT',
    account_owner:data.account_owner||null,
    jobs_count:0,
    revenue:0
  };
  if(!supabaseUrl||!serviceKey){
    const item={id:crypto.randomUUID(),...record,created_at:new Date().toISOString()};
    accounts=[item,...accounts];
    return item
  }
  return(await rest('accounts',{method:'POST',body:JSON.stringify(record)}))[0]
}

export async function updateAccount(id,data){
  if(!supabaseUrl||!serviceKey){
    accounts=accounts.map(x=>x.id===id?{...x,...data,updated_at:new Date().toISOString()}:x);
    return accounts.find(x=>x.id===id)
  }
  return(await rest(`accounts?id=eq.${encodeURIComponent(id)}`,{method:'PATCH',body:JSON.stringify({...data,updated_at:new Date().toISOString()})}))[0]
}
