import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
    switch (req.method) {
        case 'PUT': {
            return editFeedback(req, res);
        }
        case 'DELETE': {
            return deleteFeedback(req, res);
        }
    }
}

async function editFeedback(req, res) {
    try {
        const client = await clientPromise;
        const db = client.db("productFeedback");

        await db
            .collection("feedbacks")
            .updateOne(
                {
                    _id: new ObjectId(req.query.id),
                },
                {
                    $set: JSON.parse(req.body)
                },
            );

        return res.json({
            message: 'Feedback edited successfully',
            success: true
        });
    } catch (e) {
        return res.json({
            message: new Error(e).message,
            success: false
        });
    }
}

async function deleteFeedback(req, res) {
    console.log(req.query.id);
    try {
        const client = await clientPromise;
        const db = client.db("productFeedback");

        await db
            .collection("feedbacks")
            .deleteOne(
                {
                    _id: new ObjectId(req.query.id),
                },
            );

        console.log(req.id);

        return res.json({
            message: 'Feedback deleted successfully',
            success: true
        });
    } catch (e) {
        return res.json({
            message: new Error(e).message,
            success: false
        });
    }
}
