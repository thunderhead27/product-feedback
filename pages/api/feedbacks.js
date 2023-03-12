import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";


export default async function handler(req, res) {
    switch (req.method) {
        case 'GET': {
            return getFeedback(req, res);
        }
        case 'POST': {
            return addFeedback(req, res);
        }
    }
}

async function getFeedback(req, res) {
    try {
        const client = await clientPromise;
        const db = client.db("productFeedback");

        let feedbacks = await db
            .collection("feedbacks")
            .find({})
            .toArray();

        return res.json({
            message: JSON.parse(JSON.stringify(feedbacks)),
            success: true,
        });
    } catch (e) {
        return res.json({
            message: new Error(error).message,
            success: false,
        });
    }
}

async function addFeedback(req, res) {
    try {
        const client = await clientPromise;
        const db = client.db("productFeedback");

        await db
            .collection("feedbacks")
            .insertOne(JSON.parse(req.body));

        return res.json({
            message: 'Feedback added successfully',
            success: true
        });
    } catch (e) {
        return res.json({
            message: new Error(e).message,
            success: false
        });
    }
}
