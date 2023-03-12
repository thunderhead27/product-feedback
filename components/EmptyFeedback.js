import React from 'react';
import tw from 'twin.macro';

const EmptyFeedback = () => {
    return (
        <div tw="flex flex-col bg-white place-content-center items-center h-[460px] tablet:h-[600px] rounded-xl px-6 tablet:px-[140px] desktop:px-[190px]">
            <div tw="bg-[url('/assets/suggestions/illustration-empty.svg')] w-[102px] h-[108px] tablet:w-[130px] tablet:h-[137px] bg-no-repeat bg-cover bg-center mb-10"></div>
            <h1 tw="font-bold text-2xl tablet:text-3xl mb-4">There is no feedback yet.</h1>
            <p>Got a suggestion? Found a bug that needs to be squashed?</p>
            <p tw="mb-6 tablet:mb-12">We love hearing about new ideas to improve our app.</p>
            <button tw="bg-cPurple w-[158px] h-[44px] rounded-xl text-white font-bold hover:bg-purpleHover text-sm">+ Add Feedback</button>
        </div>
    );
};

export default EmptyFeedback;