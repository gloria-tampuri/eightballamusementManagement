import { patchAccessoryController } from "@/controllers/accessoriesController";

export default async function handler(req, res) {
  if (req.method === "PATCH") {
    return await patchAccessoryController(req, res);
  }
}
