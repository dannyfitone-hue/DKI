import {createEmergency,listEmergencies} from '../../../lib/store';

export async function GET(req) {
  try {
    const url=new URL(req.url);
    const account_id=url.searchParams.get('account_id') || undefined;
    const assigned_team_id=url.searchParams.get('assigned_team_id') || undefined;
    return Response.json(await listEmergencies({account_id,assigned_team_id}));
  } catch(e) {
    return Response.json({error:e.message},{status:500});
  }
}

export async function POST(req) {
  try {
    const body=await req.json();
    if(!body.address || !body.phone) return Response.json({error:'Address and phone are required.'},{status:400});
    return Response.json(await createEmergency(body),{status:201});
  } catch(e) {
    return Response.json({error:e.message},{status:500});
  }
}
