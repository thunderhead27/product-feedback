import Image from "next/image";
import Link from "next/link";
import clientPromise from "../lib/mongodb";
import React, { useState } from 'react';
import tw, { styled } from 'twin.macro';

const Status = styled.div`
    opacity: 0.4;
    ${({ active }) => (active ? `opacity: 1` : ``)};
`;

const Feedback = styled.div`
    border-top: 6px solid ${({ color }) => (colors(color))};
`;

const colors = (color) => {
    switch (color) {
        case 'planned':
            return '#F49F85';
        case 'in-progress':
            return '#AD1FEA';
        case 'live':
            return '#62BCFA';
    }
};

const Circle = styled.div`
    background-color: ${({ color }) => (colors(color))};
`;

const PeachColorBar = styled.div`
    ${({ active }) => (active ? `border-bottom: 5px solid #F49F85` : ``)};
`;
const PurpleColorBar = styled.div`
    ${({ active }) => (active ? `border-bottom: 5px solid #AD1FEA` : ``)};
`;
const BlueColorBar = styled.div`
    ${({ active }) => (active ? `border-bottom: 5px solid #62BCFA` : ``)};
`;


const roadmap = ({ data }) => {
    const [statusSelect, setStatusSelect] = useState('planned');

    const statusLength = (status) => {
        return data.filter(feedback => feedback.status === status).length;
    };

    const selectedStatusFeedbacks = (status) => {
        return data.filter(feedback => feedback.status === status);
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
        <div tw="flex flex-col tablet:px-10 tablet:pt-[56px] desktop:pt-[78px] desktop:px-[165px] font-sans">
            <div tw="flex flex-row h-[100px] w-full bg-darkBlue tablet:rounded-xl items-center px-6 justify-between tablet:mb-8 desktop:mb-12">
                <div tw="flex flex-col">
                    <div tw="flex flex-row items-center gap-x-4">
                        <div tw="h-[4px] w-[8px]"><Image src="/assets/shared/icon-arrow-left.svg" height={4} width={8} /></div>
                        <Link href="/"><span tw="font-bold text-sm tablet:text-lg text-white">Go Back</span></Link>
                    </div>
                    <h1 tw="text-xl font-bold text-white">Roadmap</h1>
                </div>
                <div>
                    <button tw="bg-cPurple h-10 w-[134px] rounded-lg font-bold text-white text-sm hover:bg-purpleHover">+ Add Feedback</button>
                </div>
            </div>
            {/* Mobile Only */}
            <div tw="flex flex-row py-[20px] tablet:hidden justify-between px-8 font-bold text-darkBlueGray text-sm">
                <div tw="flex flex-col basis-1/3 text-center" onClick={() => setStatusSelect('planned')}>
                    <Status tw="py-4" active={statusSelect === 'planned'}>Planned ({statusLength('planned')})</Status>
                    <PeachColorBar active={statusSelect === 'planned'} />
                </div>
                <div tw="flex flex-col basis-1/3 text-center" onClick={() => setStatusSelect('in-progress')}>
                    <Status tw="py-4" active={statusSelect === 'in-progress'}>In-Progress ({statusLength('in-progress')})</Status>
                    <PurpleColorBar active={statusSelect === 'in-progress'} />
                </div>
                <div tw="flex flex-col basis-1/3 text-center" onClick={() => setStatusSelect('live')}>
                    <Status tw="py-4" active={statusSelect === 'live'}>Live ({statusLength('live')})</Status>
                    <BlueColorBar active={statusSelect === 'live'} />
                </div>
            </div>
            <div tw="flex flex-col tablet:hidden py-6 px-6">
                <div tw="mb-6">
                    <h1 tw="capitalize font-bold text-lg">{statusSelect} ({statusLength(statusSelect)})</h1>
                    <p tw="text-sm text-lightBlueGray">Features currently being developed</p>
                </div>
                {selectedStatusFeedbacks(statusSelect).map(feedback =>
                    <Feedback color={statusSelect} tw="flex flex-col py-4 px-6 bg-white rounded-lg text-sm">
                        <div tw="flex flex-row items-center gap-x-2 mb-4">
                            <Circle color={statusSelect} tw="h-2 w-2 rounded-full"></Circle>
                            <span tw="capitalize">{statusSelect}</span>
                        </div>
                        <div tw="flex flex-col gap-y-2">
                            <h2 tw="font-bold text-darkBlueGray">{feedback.title}</h2>
                            <p tw="text-lightBlueGray">{feedback.description}</p>
                            <div tw="flex flex-row bg-darkGray h-[30px] w-fit px-4 rounded-lg items-center place-content-center capitalize text-blue font-[600]">{feedback.category}</div>
                            <div tw="flex flex-row justify-between">
                                <div tw="flex flex-row h-8 w-fit bg-darkGray text-darkBlueGray font-bold items-center rounded-lg px-4 gap-x-4" onClick={() => handleUpvote()}>
                                    <img src="/assets/shared/icon-arrow-up.svg" alt="arrow-up" width={8} height={4} />
                                    <span>{feedback.upvotes}</span>
                                </div>
                                <div tw="flex flex-row gap-x-2 font-bold text-darkBlueGray">
                                    <div><img src="/assets/shared/icon-comments.svg" alt="comments" /></div>
                                    <span>{!feedback.comments?.length ? <span tw="opacity-50">0</span> : feedback.comments?.length}</span>
                                </div>
                            </div>
                        </div>
                    </Feedback>)}
            </div>
            {/* End of Mobile Only */}
            <div tw="hidden tablet:flex flex-col gap-x-4">
                <div tw="flex flex-row gap-x-4">
                    <div tw="flex flex-col basis-1/3 gap-y-4 h-fit">
                        <h2 tw="font-bold text-darkBlueGray">Planned ({statusLength('planned')})</h2>
                        <p tw="text-lightBlueGray mb-6">Ideas prioritized for research</p>
                        {selectedStatusFeedbacks('planned').map(feedback =>
                            <div tw="flex flex-col basis-1/3 border-t-[6px] border-peach rounded-lg py-6 px-5 bg-white">
                                <div tw="flex flex-row gap-x-4 mb-4">
                                    <div tw="h-2 w-2 bg-peach rounded-full"></div>
                                    <span tw="text-lightBlueGray">Planned</span>
                                </div>
                                <div tw="flex flex-col gap-y-4 mb-4">
                                    <h2 tw="font-bold text-darkBlueGray">{feedback.title}</h2>
                                    <p tw="text-lightBlueGray">{feedback.description}</p>
                                    <div tw="px-4 py-[6px] w-fit bg-darkGray text-blue capitalize font-[600] rounded-lg">
                                        {feedback.category}
                                    </div>
                                </div>
                                <div tw="flex flex-row justify-between">
                                    <div tw="flex flex-row h-8 w-fit bg-darkGray text-darkBlueGray font-bold items-center rounded-lg px-4 gap-x-4">
                                        <img src="/assets/shared/icon-arrow-up.svg" alt="arrow-up" width={8} height={4} />
                                        <span>{feedback.upvotes}</span>
                                    </div>
                                    <div tw="flex flex-row gap-x-2 font-bold text-darkBlueGray">
                                        <div><img src="/assets/shared/icon-comments.svg" alt="comments" /></div>
                                        <span>{!feedback.comments?.length ? <span tw="opacity-50">0</span> : feedback.comments?.length}</span>
                                    </div>
                                </div>
                            </div>)}
                    </div>
                    <div tw="flex flex-col basis-1/3 gap-y-4 h-fit">
                        <h2 tw="font-bold text-darkBlueGray">In-Progress ({statusLength('in-progress')})</h2>
                        <p tw="text-lightBlueGray mb-6">Ideas prioritized for research</p>
                        {selectedStatusFeedbacks('in-progress').map(feedback =>
                            <div tw="flex flex-col basis-1/3 border-t-[6px] border-cPurple rounded-lg py-6 px-5 bg-white">
                                <div tw="flex flex-row gap-x-4 mb-4">
                                    <div tw="h-2 w-2 bg-cPurple rounded-full"></div>
                                    <span tw="text-lightBlueGray">Planned</span>
                                </div>
                                <div tw="flex flex-col gap-y-4 mb-4">
                                    <h2 tw="font-bold text-darkBlueGray">{feedback.title}</h2>
                                    <p tw="text-lightBlueGray">{feedback.description}</p>
                                    <div tw="px-4 py-[6px] w-fit bg-darkGray text-blue capitalize font-[600] rounded-lg">
                                        {feedback.category}
                                    </div>
                                </div>
                                <div tw="flex flex-row justify-between">
                                    <div tw="flex flex-row h-8 w-fit bg-darkGray text-darkBlueGray font-bold items-center rounded-lg px-4 gap-x-4">
                                        <img src="/assets/shared/icon-arrow-up.svg" alt="arrow-up" width={8} height={4} />
                                        <span>{feedback.upvotes}</span>
                                    </div>
                                    <div tw="flex flex-row gap-x-2 font-bold text-darkBlueGray">
                                        <div><img src="/assets/shared/icon-comments.svg" alt="comments" /></div>
                                        <span>{!feedback.comments?.length ? <span tw="opacity-50">0</span> : feedback.comments?.length}</span>
                                    </div>
                                </div>
                            </div>)}
                    </div>
                    <div tw="flex flex-col basis-1/3 gap-y-4 h-fit">
                        <h2 tw="font-bold text-darkBlueGray">Live ({statusLength('live')})</h2>
                        <p tw="text-lightBlueGray mb-6">Ideas prioritized for research</p>
                        {selectedStatusFeedbacks('live').map(feedback =>
                            <div tw="flex flex-col basis-1/3 border-t-[6px] border-lightBlue rounded-lg py-6 px-5 bg-white">
                                <div tw="flex flex-row gap-x-4 mb-4">
                                    <div tw="h-2 w-2 bg-lightBlue rounded-full"></div>
                                    <span tw="text-lightBlueGray">Live</span>
                                </div>
                                <div tw="flex flex-col gap-y-4 mb-4">
                                    <h2 tw="font-bold text-darkBlueGray">{feedback.title}</h2>
                                    <p tw="text-lightBlueGray">{feedback.description}</p>
                                    <div tw="px-4 py-[6px] w-fit bg-darkGray text-blue capitalize font-[600] rounded-lg">
                                        {feedback.category}
                                    </div>
                                </div>
                                <div tw="flex flex-row justify-between">
                                    <div tw="flex flex-row h-8 w-fit bg-darkGray text-darkBlueGray font-bold items-center rounded-lg px-4 gap-x-4">
                                        <img src="/assets/shared/icon-arrow-up.svg" alt="arrow-up" width={8} height={4} />
                                        <span>{feedback.upvotes}</span>
                                    </div>
                                    <div tw="flex flex-row gap-x-2 font-bold text-darkBlueGray">
                                        <div><img src="/assets/shared/icon-comments.svg" alt="comments" /></div>
                                        <span>{!feedback.comments?.length ? <span tw="opacity-50">0</span> : feedback.comments?.length}</span>
                                    </div>
                                </div>
                            </div>)}
                    </div>
                </div>
            </div>
        </div >
    );
};

export async function getServerSideProps() {
    try {
        const client = await clientPromise;
        const db = client.db("productFeedback");

        let feedbacks = await db
            .collection("feedbacks")
            .find({})
            .toArray();

        return {
            props: { data: JSON.parse(JSON.stringify(feedbacks)) },
        };
    } catch (e) {
        console.error(e);
    }
}

export default roadmap;