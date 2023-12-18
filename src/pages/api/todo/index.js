import { deleteTodoController, getTodoController, postTodoController } from "@/controllers/todoController"

export default async function handler(req, res) {

    if (req.method === 'POST') {
        return await postTodoController(req,res)
    }

    if (req.method === "GET") {
        return await getTodoController(req, res)
    }

    // if(req.method ==="DELETE"){
    //     return await deleteTodoController(req, res)
    // }
if (req.method === 'DELETE') {
    return await deleteTodoController(req, res);
}

}