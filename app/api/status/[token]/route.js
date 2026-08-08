import { getEmergencyByToken } from '../../../../lib/store';

export async function GET(req,{params}){
  try{
    const job=await getEmergencyByToken(params.token);
    if(!job)return Response.json({error:'Status link not found.'},{status:404});
    return Response.json({
      id:job.id,
      address:job.address,
      unit:job.unit,
      status:job.status,
      account_name:job.account_name,
      created_at:job.created_at,
      updated_at:job.updated_at,
      updates:(job.updates||[]).filter(u=>u.visible_to_client)
    });
  }catch(e){
    return Response.json({error:e.message},{status:500})
  }
}
