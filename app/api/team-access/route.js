import {findTeamByAccessCode} from '../../../lib/store';
export async function GET(req){
  try{
    const url=new URL(req.url),code=url.searchParams.get('code');
    const team=await findTeamByAccessCode(code);
    if(!team)return Response.json({error:'Team access code not found.'},{status:404});
    return Response.json(team);
  }catch(e){return Response.json({error:e.message},{status:500})}
}
