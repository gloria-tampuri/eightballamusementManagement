import { getAssertController, patchAssertController } from "@/controllers/assertController";

export default async function handler(req,res){


    if(req.method === 'GET'){
        return getAssertController(req,res)
    }
    if (req.method === 'PATCH') {
        return patchAssertController(req,res) // You did not pass req and res tru again okay...
    }
}