import {findAccountByClientNumber} from '../../../lib/store';
export async function GET(req){
  try{
    const url=new URL(req.url);
    const number=url.searchParams.get('client_number');
    if(!number)return Response.json({error:'Client number is required.'},{status:400});
    const a=await findAccountByClientNumber(number);
    if(!a)return Response.json({error:'We could not find that DKI Restotech Client Number.'},{status:404});
    return Response.json(a);
  }catch(e){return Response.json({error:e.message},{status:500})}
}
