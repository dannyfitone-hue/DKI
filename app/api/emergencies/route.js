import {createEmergency,listEmergencies} from '../../../lib/store';
export async function GET(){try{return Response.json(await listEmergencies())}catch(e){return Response.json({error:e.message},{status:500})}}
export async function POST(req){try{const body=await req.json();if(!body.address||!body.phone)return Response.json({error:'Address and phone are required.'},{status:400});return Response.json(await createEmergency(body),{status:201})}catch(e){return Response.json({error:e.message},{status:500})}}
