import { getTransportController, postTransportController } from "@/controllers/transportController"

export default async function handler(req, res) {

    if (req.method === 'POST') {
        return await postTransportController(req,res)
    }

    if (req.method === "GET") {
        return await getTransportController(req, res)
    }
}