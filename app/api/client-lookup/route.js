import { findAccountByClientNumber } from '../../../lib/store';

export async function GET(req){
  try{
    const url=new URL(req.url);
    const clientNumber=url.searchParams.get('client_number');
    if(!clientNumber)return Response.json({error:'Client number is required.'},{status:400});
    const account=await findAccountByClientNumber(clientNumber);
    if(!account)return Response.json({error:'We could not find that DKI Restotech Client Number.'},{status:404});
    return Response.json({
      id:account.id,
      client_number:account.client_number,
      name:account.name,
      property_name:account.property_name,
      address:account.address,
      manager_name:account.manager_name,
      phone:account.phone
    });
  }catch(e){
    return Response.json({error:e.message},{status:500})
  }
}
