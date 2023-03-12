import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
    image: String,
    name: String,
    username: String
});

const CommentSchema = new Schema({
    id: Number,
    content: String,
    user: UserSchema
});

const FeedbackSchema = new Schema({
    id: Number,
    title: String,
    category: String,
    upvotes: Number,
    status: String,
    description: String,
    comments: [CommentSchema]
});


export const Feedbacks = models.Feedbacks || model("Feedbacks", FeedbackSchema);
export const User = models.User || model('User', UserSchema);


