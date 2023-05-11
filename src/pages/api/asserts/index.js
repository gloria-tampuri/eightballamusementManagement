import { getAssertsController, postAssertController } from "@/controllers/assertsController"

export default async function handler(req, res) {

    if (req.method === 'POST') {
        return await postAssertController(req,res)
    }

    if (req.method === "GET") {
        return await getAssertsController(req, res)
    }
}