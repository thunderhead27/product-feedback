import React, { useState, useRef } from 'react';
import clientPromise from "../../lib/mongodb";
import tw from 'twin.macro';
import Link from "next/link";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from 'uuid';

export default function FeedbackPage({ data, users }) {
    const [textInput, setTextInput] = useState('');
    const [commentId, setCommentId] = useState('');
    const [replyingTo, setReplyingTo] = useState('');
    const [upvotes, setUpvotes] = useState(data[0].upvotes);
    const router = useRouter();
    const myRef = useRef(null);

    const limit = data[0].upvotes + 1;

    const executeScroll = () => myRef.current.scrollIntoView();

    const getCommentLength = (data) => {
        const commentLength = !data[0].comments ? 0 : data[0].comments.length;
        const repliesLength = !data[0].comments ? 0 : data[0].comments?.map(comment => comment.replies).length;
        return commentLength + repliesLength;
    };

    const handleAddComment = async () => {
        const comment = textInput.startsWith(`@${replyingTo}`) ? textInput.substring(replyingTo.length + 1) : ` ${textInput}`;

        if (textInput.startsWith(`@${replyingTo}`) && replyingTo) {
            let commentObject = {
                id: uuidv4(),
                content: comment,
                replyingTo: replyingTo,
                user: {
                    image: users[0].image,
                    name: users[0].name,
                    username: users[0].username
                }
            };

            let response = await fetch(`/api/comments/${data[0]._id}/${commentId}`, {
                method: 'POST',
                body: JSON.stringify(commentObject)
            });

            let fetchedData = await response.json();
            console.log(fetchedData);
        } else {
            let commentObject = {
                id: uuidv4(),
                content: comment,
                user: {
                    image: users[0].image,
                    name: users[0].name,
                    username: users[0].username
                }
            };

            let response = await fetch(`/api/comments/${data[0]._id}`, {
                method: 'POST',
                body: JSON.stringify(commentObject)
            });

            let fetchedData = await response.json();
            console.log(fetchedData);
        }

        router.reload();
    };

    const handleUpvote = async () => {
        if (limit > upvotes)
            setUpvotes(prevValue => prevValue + 1);

        const editedfeedback = {
            upvotes: upvotes + 1
        };

        let response = await fetch(`/api/editFeedback/${data[0]._id}`, {
            method: 'PUT',
            body: JSON.stringify(editedfeedback)
        });

        let fetchedData = await response.json();
        console.log(fetchedData);

        router.reload();
    };

    return (
        <div tw="flex flex-col py-6 tablet:py-14 desktop:py-20 px-6 tablet:px-10 desktop:px-[355px] font-sans">
            <div tw="flex flex-row items-center justify-between mb-6">
                <div tw="flex flex-row items-center">
                    <div tw="h-2 w-4">
                        <img src="/assets/shared/icon-arrow-left.svg" />
                    </div>
                    <span tw="text-lightBlueGray font-bold cursor-pointer" onClick={() => router.back()}>Go Back</span>
                </div>
                <Link href={`/editFeedback/${data[0]._id}`}>
                    <button tw="w-fit py-3 px-4 bg-blue hover:bg-blueHover text-white font-bold rounded-lg">Edit Feedback</button>
                </Link>
            </div>
            <div tw="flex flex-col tablet:flex-row bg-white px-6 py-6 tablet:py-7 tablet:px-8 justify-between tablet:items-center rounded-lg mb-6">
                <div tw="flex flex-row gap-x-10">
                    <div tw="hidden tablet:flex flex-col h-[53px] w-10 bg-darkGray items-center place-content-center gap-y-2 rounded-lg">
                        <div tw="h-1 w-2 cursor-pointer"><img src="/assets/shared/icon-arrow-up.svg" alt="arrow-up" onClick={() => handleUpvote()} /></div>
                        <span tw="font-bold text-darkBlueGray">{data[0].upvotes}</span>
                    </div>
                    <div tw="flex flex-col gap-y-2">
                        <h1 tw="text-xl text-darkBlueGray font-bold">{data[0].title}</h1>
                        <p tw="text-lightBlueGray mb-2 w-[500px]">{data[0].description}</p>
                        <button tw="py-[6px] px-4 bg-darkGray font-[600] text-blue rounded-lg w-fit capitalize mb-[14px] tablet:mb-0">{data[0].category}</button>
                    </div>
                </div>
                <div tw="hidden tablet:flex flex-row gap-x-2 items-center">
                    <div tw="w-[18px] h-4">
                        <img src="/assets/shared/icon-comments.svg" alt="comments" />
                    </div>
                    <span tw="text-darkBlueGray font-bold">{getCommentLength(data)}</span>
                </div>
                <div tw="flex flex-row justify-between">
                    <div tw="flex flex-row tablet:hidden gap-x-2 px-4 py-[6px] w-fit bg-darkGray items-center place-content-center gap-y-2 rounded-lg">
                        <div tw="h-1 w-2"><img src="/assets/shared/icon-arrow-up.svg" alt="arrow-up" /></div>
                        <span tw="font-bold text-darkBlueGray">{data[0].upvotes}</span>
                    </div>
                    <div tw="flex flex-row tablet:hidden gap-x-2 items-center">
                        <div tw="w-[18px] h-4">
                            <img src="/assets/shared/icon-comments.svg" alt="comments" />
                        </div>
                        <span tw="text-darkBlueGray font-bold">{getCommentLength(data)}</span>
                    </div>
                </div>
            </div>
            <div tw="flex flex-col bg-white py-4 tablet:py-6 px-6 tablet:px-8 rounded-lg">
                <span tw="font-bold text-xl text-darkBlueGray">{getCommentLength(data)} Comments</span>
                <div tw="flex flex-col divide-y-[1px] divide-[#8C92B3] divide-opacity-[0.25] py-6">
                    {data[0].comments?.map(comment =>
                        <div tw="flex flex-col" key={comment.id}>
                            <div tw="flex flex-col py-6" key={comment._id}>
                                <div tw="flex flex-row items-center justify-between mb-4">
                                    <div tw="flex flex-row gap-x-8">
                                        <div tw="h-10 w-10">
                                            <img tw="rounded-full" src={comment.user.image} />
                                        </div>
                                        <div tw="flex flex-col text-sm">
                                            <span tw="font-bold text-darkBlueGray">{comment.user.name}</span>
                                            <span tw="text-lightBlueGray">@{comment.user.username}</span>
                                        </div>
                                    </div>
                                    <span tw="text-blue font-[600] text-sm cursor-pointer" onClick={() => { setTextInput(`@${comment.user.username} `); setCommentId(comment.id); setReplyingTo(comment.user.username); executeScroll(); }}>Reply</span>
                                </div>
                                <div tw="pl-[72px]">
                                    <p tw="text-lightBlueGray">{comment.content}</p>
                                </div>
                            </div>
                            {comment.replies &&
                                comment.replies.map((reply) =>
                                    <div tw="flex flex-col py-4 tablet:py-6 pl-4 tablet:pl-6 ml-2 tablet:ml-4 border-[#647196] border-l-[1px] border-opacity-[0.1]" key={reply.id}>
                                        <div tw="flex flex-row items-center justify-between mb-4">
                                            <div tw="flex flex-row gap-x-8">
                                                <div tw="h-10 w-10">
                                                    <img tw="rounded-full" src={reply.user.image} />
                                                </div>
                                                <div tw="flex flex-col text-sm">
                                                    <span tw="font-bold text-darkBlueGray">{reply.user.name}</span>
                                                    <span tw="text-lightBlueGray">@{reply.user.username}</span>
                                                </div>
                                            </div>
                                            <span tw="text-blue font-[600] text-sm cursor-pointer" onClick={() => { setTextInput(`@${reply.user.username} `); setCommentId(comment.id); setReplyingTo(reply.user.username); executeScroll(); }}>Reply</span>
                                        </div>
                                        <div tw="pl-[72px]">
                                            <p tw="text-lightBlueGray"><span tw="text-cPurple font-bold">@{reply.replyingTo}</span> {comment.content}</p>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    )}
                </div>

            </div>
            <div tw="flex flex-col py-6 px-6 tablet:py-8 tablet:px-8 h-[234px] tablet:h-[246px] bg-white mt-6 rounded-lg">
                <h1 tw="text-darkBlueGray font-bold text-xl mb-6">Add Comment</h1>
                <textarea ref={myRef} tw="resize-none h-[80px] bg-darkGray rounded-md outline-none border-none pl-6 pt-2" value={textInput} onChange={e => setTextInput(e.target.value)} placeholder="Type your comment here" maxLength={250}></textarea>
                <div tw="flex flex-row justify-between items-center mt-4">
                    <span tw="text-sm text-lightBlueGray">{250 - textInput.length} Characters Left</span>
                    <button tw="bg-cPurple hover:bg-purpleHover h-[44px] w-[142px] rounded-lg text-white text-sm font-[600]" onClick={() => handleAddComment()}>Post Comment</button>
                </div>
            </div>
        </div >
    );
}

export const getServerSideProps = async (context) => {
    console.log(context);
    let { id } = context.query;
    let ObjectId = require('mongodb').ObjectId;
    id = new ObjectId(id);

    try {
        const client = await clientPromise;
        const db = client.db("productFeedback");

        let [feedbacks, users] = await Promise.all([
            db
                .collection("feedbacks")
                .find({ _id: id })
                .toArray(),
            db
                .collection("users")
                .find({})
                .toArray()
        ]);

        return {
            props: { data: JSON.parse(JSON.stringify(feedbacks)), users: JSON.parse(JSON.stringify(users)) },
        };
    } catch (e) {
        console.error(e);
    }
};