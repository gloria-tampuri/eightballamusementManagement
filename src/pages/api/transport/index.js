import { getTransportController, postTransportController } from "@/controllers/transportController";

const deleteTransport = async (transportId) => {
    const transportCollection = await connectToDatabase();

    try {
        const result = await transportCollection.deleteOne({ _id: ObjectId(transportId) });

        if (result.deletedCount === 1) {
            return { success: true, message: 'Transport deleted successfully' };
        } else {
            return { success: false, message: 'Transport not found' };
        }
    } catch (error) {
        console.error('Error deleting transport:', error);
        return { success: false, message: 'An error occurred while deleting transport' };
    }
};

export default async function handler(req, res) {
    if (req.method === 'POST') {
        return await postTransportController(req, res);
    }

    if (req.method === 'GET') {
        return await getTransportController(req, res);
    }

    if (req.method === 'DELETE') {
        const { transportId } = req.query;

        try {
            const deleteResult = await deleteTransport(transportId);

            if (deleteResult.success) {
                return res.status(200).json({ message: deleteResult.message });
            } else {
                return res.status(404).json({ message: deleteResult.message });
            }
        } catch (error) {
            console.error('Error deleting transport:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}
