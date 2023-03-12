import React, { useState } from 'react';
import tw from 'twin.macro';
import Image from "next/image";
import { useRouter } from "next/router";

const Feedback = ({ feedback }) => {
    const router = useRouter();
    const [upvotes, setUpvotes] = useState(feedback.upvotes);
    const limit = feedback.upvotes + 1;

    const handleUpvote = async (e) => {
        e.stopPropagation();
        if (limit > upvotes)
            await setUpvotes(prevValue => prevValue + 1);

        const editedfeedback = {
            upvotes: upvotes + 1
        };

        let response = await fetch(`/api/editFeedback/${feedback._id}`, {
            method: 'PUT',
            body: JSON.stringify(editedfeedback)
        });

        let fetchedData = await response.json();
        console.log(fetchedData);

        router.reload();

    };

    return (
        <div tw="flex flex-col tablet:flex-row w-full py-6 px-6 bg-white rounded-lg justify-between tablet:items-center cursor-pointer" onClick={(e) => { e.stopPropagation(); router.push(`/feedbacks/${feedback._id}`); }}>
            <div tw="mb-4">
                <div tw="flex flex-row gap-x-10">
                    <button tw="hidden tablet:flex flex-col items-center place-content-center w-10 h-[53px] bg-gray rounded-lg gap-y-2" disabled={upvotes === limit}>
                        <Image src="/assets/shared/icon-arrow-up.svg" alt="arrow-up" width={8} height={4} onClick={(e) => handleUpvote(e)} />
                        <span tw="font-bold text-sm text-darkBlueGray">{feedback.upvotes}</span>
                    </button>
                    <div tw="flex flex-col">
                        <h1 tw="font-bold mb-4 text-xl text-darkBlueGray">{feedback.title}</h1>
                        <p tw="text-lightBlueGray text-sm tablet:text-lg mb-4">{feedback.description}</p>
                        <div>
                            <button tw="py-[6px] px-4 bg-darkGray rounded-lg capitalize font-[600] text-blue">{feedback.category}</button>
                        </div>
                    </div>
                </div>
            </div>
            <div tw="hidden tablet:flex flex-row items-center gap-x-2">
                <div tw="w-[18] h-[16]"><Image src="/assets/shared/icon-comments.svg" width={18} height={16} alt="comments" /></div>
                {!feedback.comments?.length ? <span tw="text-darkBlueGray font-bold opacity-50">0</span> : <span tw="font-bold">{feedback.comments?.length}</span>}
            </div>
            <div tw="flex flex-row tablet:hidden justify-between items-center">
                <div tw="flex flex-col items-center place-content-center w-10 h-[53px] bg-gray rounded-lg gap-y-2">
                    <Image src="/assets/shared/icon-arrow-up.svg" alt="arrow-up" width={8} height={4} />
                    <span tw="font-bold text-sm">{feedback.upvotes}</span>
                </div>
                <div tw="flex flex-row gap-x-2">
                    <div tw="w-[18] h-[16]"><Image src="/assets/shared/icon-comments.svg" width={18} height={16} alt="comments" /></div>
                    {!feedback.comments?.length ? <span tw="text-darkBlueGray font-bold opacity-50">0</span> : <span tw="font-bold">{feedback.comments?.length}</span>}
                </div>
            </div>
        </div>
    );
};

export default Feedback;

