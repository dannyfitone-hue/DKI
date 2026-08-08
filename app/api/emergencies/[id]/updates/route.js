import {addJobUpdate} from '../../../../../lib/store';
export async function POST(req,{params}){
  try{
    const b=await req.json();
    if(!b.message?.trim())return Response.json({error:'Update message is required.'},{status:400});
    return Response.json(await addJobUpdate(params.id,b),{status:201});
  }catch(e){return Response.json({error:e.message},{status:500})}
}
