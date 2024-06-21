import { getAccessoriesController, patchAccessoryController, postAccessoryController } from "@/controllers/accessoriesController"

export default async function handler(req, res) {

    if (req.method === 'POST') {
        return await postAccessoryController(req, res)
    }

    if (req.method === "GET") {
        return await getAccessoriesController(req,res)
    }

    if (req.method === "PATCH") {
        return await patchAccessoryController(req,res)
    }
}