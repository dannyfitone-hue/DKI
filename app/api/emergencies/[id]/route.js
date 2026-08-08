import {updateEmergency} from '../../../../lib/store';
export async function PATCH(req,{params}){try{return Response.json(await updateEmergency(params.id,await req.json()))}catch(e){return Response.json({error:e.message},{status:500})}}
