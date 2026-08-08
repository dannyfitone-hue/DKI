import {updateEmergency} from '../../../../lib/store';
export async function PATCH(req,{params}){try{const body=await req.json();return Response.json(await updateEmergency(params.id,body))}catch(e){return Response.json({error:e.message},{status:500})}}
