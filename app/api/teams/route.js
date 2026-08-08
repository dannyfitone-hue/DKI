import {createTeam,listTeams} from '../../../lib/store';
export async function GET(){try{return Response.json(await listTeams())}catch(e){return Response.json({error:e.message},{status:500})}}
export async function POST(req){try{const b=await req.json();if(!b.name)return Response.json({error:'Team name is required.'},{status:400});return Response.json(await createTeam(b),{status:201})}catch(e){return Response.json({error:e.message},{status:500})}}
