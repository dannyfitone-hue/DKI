import {getEmergencyByToken} from '../../../../lib/store';
export async function GET(req,{params}){
 try{
  const j=await getEmergencyByToken(params.token);
  if(!j)return Response.json({error:'Status link not found.'},{status:404});
  return Response.json({id:j.id,address:j.address,unit:j.unit,status:j.status,request_type:j.request_type,assigned_team_name:j.assigned_team_name,created_at:j.created_at,updated_at:j.updated_at,updates:(j.updates||[]).filter(u=>u.visible_to_client)});
 }catch(e){return Response.json({error:e.message},{status:500})}
}
