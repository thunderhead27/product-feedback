import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
    switch (req.method) {
        case 'POST': {
            return addComment(req, res);
        }
    }

    async function addComment(req, res) {
        try {
            const client = await clientPromise;
            const db = client.db("productFeedback");

            console.log(req.body);

            await db
                .collection("feedbacks")
                .updateOne(
                    {
                        _id: new ObjectId(req.query.id)
                    },
                    {
                        $push: { "comments": JSON.parse(req.body) }
                    }
                );

            return res.json({
                message: 'Comment added successfully',
                success: true
            });
        } catch (e) {
            return res.json({
                message: new Error(e).message,
                success: false
            });
        }
    }
}