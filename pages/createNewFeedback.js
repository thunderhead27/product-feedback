import React, { useState } from 'react';
import tw, { styled } from 'twin.macro';
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import OutsideAlerter from "../hooks/useOutsideAlerter";
import { useRouter } from "next/router";

const Dropdown = styled.div`
  visibility: hidden;
  position: absolute;
  background-color: white;
  width: calc(100% - 56px);
  z-index: 10;

  @media (max-width: 768px) {
    width: calc(100% - 48px)
  }

  ${({ dropdown }) => (dropdown ? `visibility: visible` : ``)};
`;

const Checkmark = styled.div`
  display: none
  ${({ active }) => (active ? `display: block` : ``)};
`;

export default function createNewFeedback() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [dropdown, setDropdown] = useState(false);
    const dropdownSelects = ["Feature", "UI", "UX", "Enhancement", "Bug"];
    const [select, setSelect] = useState(dropdownSelects[0]);

    const router = useRouter();

    const handleAddFeedback = async (data) => {
        console.log(data);
        const title = data.feedbackTitle;
        const description = data.feedbackDetail;
        const category = select;

        const feedback = {
            title,
            category,
            description,
            upvotes: 0,
            status: "suggestion",
            comments: [],
        };

        let response = await fetch('/api/feedbacks', {
            method: 'POST',
            body: JSON.stringify(feedback)
        });

        let fetchedData = await response.json();
        console.log(fetchedData);

        router.push('/');
    };

    return (
        <div tw="flex flex-col py-6 tablet:py-14 desktop:py-20 px-6 tablet:px-10 desktop:px-[355px] font-sans">
            <div tw="flex flex-row items-center justify-between mb-[55px] tablet:mb-[68px]">
                <Link href="/">
                    <div tw="flex flex-row items-center">
                        <div tw="h-2 w-4">
                            <img src="/assets/shared/icon-arrow-left.svg" />
                        </div>
                        <span tw="text-lightBlueGray font-bold">Go Back</span>
                    </div>
                </Link>
            </div>
            <div tw="relative flex flex-col bg-white px-6 py-[44px] tablet:px-7 tablet:py-[52px] rounded-lg">
                <div tw="absolute h-10 w-10 tablet:h-14 tablet:w-14 top-[-20px] tablet:top-[-28px]">
                    <img src="/assets/shared/icon-new-feedback.svg" alt="new-feedback" />
                </div>
                <div tw="">
                    <h1 tw="font-bold text-darkBlueGray text-xl mb-6 tablet:mb-10">Create New Feedback</h1>
                    <form onSubmit={handleSubmit()}>
                        <div tw="mb-6">
                            <h2 tw="font-bold text-darkBlueGray text-lg">Feedback Title</h2>
                            <p tw="text-lightBlueGray mb-4">Add a short, descriptive headline</p>
                            <div tw="flex flex-col">
                                <textarea tw="h-12 bg-darkGray w-full rounded-md resize-none border-none outline-none" id="feedbackTitle" {...register("feedbackTitle", { required: "Can't be empty" })} error={errors.feedbackTitle} />
                                <span tw="text-cRed text-sm absolute">{errors.feedbackTitle?.message}</span>
                            </div>
                        </div>
                        <div tw="mb-6">
                            <h2 tw="font-bold text-darkBlueGray text-lg">Category</h2>
                            <p tw="text-lightBlueGray mb-4">Choose a category for your feedback</p>
                            <div tw="flex flex-row justify-between bg-gray items-center px-6 h-12 rounded-md cursor-pointer" onClick={() => setDropdown(true)}>
                                <div>{select}</div>
                                <div tw="h-1 w-2"><img src="/assets/shared/icon-arrow-down.svg" alt="arrow-down" /></div>
                            </div>
                            <OutsideAlerter setFunction={setDropdown}>
                                <Dropdown tw="flex flex-col rounded-xl border border-[1px] border-darkGray divide-y-[1px] divide-darkBlueGray divide-opacity-[0.15] text-lightBlueGray" dropdown={dropdown}>
                                    {dropdownSelects.map((dropdownSelect, i) =>
                                        <div tw="flex flex-row py-[12px] px-6 items-center justify-between cursor-pointer" key={i} onClick={() => { setSelect(dropdownSelects[i]); setDropdown(false); }}>
                                            <div>{dropdownSelect}</div>
                                            <Checkmark active={select === dropdownSelect}><Image src="/assets/shared/icon-check.svg" width={11} height={8} alt="checkmark" /></Checkmark>
                                        </div>)}
                                </Dropdown>
                            </OutsideAlerter>
                        </div>
                        <div tw="mb-6">
                            <h2 tw="font-bold text-darkBlueGray text-lg">Feedback Detail</h2>
                            <p tw="text-lightBlueGray mb-4">Include any specific comments on what should be improved, added, etc.</p>
                            <div tw="flex flex-col">
                                <textarea tw="h-[120px] tablet:h-24 bg-darkGray w-full rounded-md resize-none border-none outline-none" id="feedbackDetail" {...register("feedbackDetail", { required: "Can't be empty" })} error={errors.feedbackDetail} />
                                <span tw="text-cRed text-sm absolute">{errors.feedbackDetail?.message}</span>
                            </div>
                        </div>
                        <div tw="flex flex-col tablet:flex-row-reverse content-end gap-y-4 gap-x-4">
                            <button tw="flex flex-row items-center place-content-center bg-cPurple h-10 w-full tablet:w-[144px] rounded-lg font-bold text-white" onClick={handleSubmit(data => handleAddFeedback(data))}>Add Feedback</button>
                            <button tw="bg-darkBlueGray flex flex-row items-center place-content-center h-10 w-full tablet:w-[144px] rounded-lg font-bold text-white" onClick={() => router.back()}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}