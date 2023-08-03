import { getExpenditureController, postExpenditureController } from "@/controllers/expenditureController"

export default async function handler(req, res) {

    if (req.method === 'POST') {
        return await postExpenditureController(req,res)
    }

    if (req.method === "GET") {
        return await getExpenditureController(req, res)
    }
}