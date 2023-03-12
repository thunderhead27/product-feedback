import React, { useState } from 'react';
import tw, { styled } from 'twin.macro';
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import OutsideAlerter from "../../hooks/useOutsideAlerter";
import clientPromise from "../../lib/mongodb";
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

export default function editFeedback({ feedback }) {
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            feedbackTitle: feedback[0].title,
            feedbackDetail: feedback[0].description,
        }
    });
    const [dropdown, setDropdown] = useState(false);
    const dropdownSelects = ["Feature", "UI", "UX", "Enhancement", "Bug"];
    const [select, setSelect] = useState(feedback[0].category);

    const router = useRouter();

    const handleEditFeedback = async (data) => {
        const title = data.feedbackTitle;
        const description = data.feedbackDetail;
        const category = select;
        const id = feedback[0]._id;


        const editedfeedback = {
            title,
            category,
            description
        };

        let response = await fetch(`/api/editFeedback/${id}`, {
            method: 'PUT',
            body: JSON.stringify(editedfeedback)
        });

        let fetchedData = await response.json();
        console.log(fetchedData);

        router.push('/');
    };

    const handleDeleteFeedback = async () => {
        const id = feedback[0]._id;

        await fetch(`/api/editFeedback/${id}`, {
            method: 'DELETE',
        });

        router.push('/');
    };


    return (
        <div tw="flex flex-col py-6 tablet:py-14 desktop:py-20 px-6 tablet:px-10 desktop:px-[355px] font-sans">
            {console.log(feedback[0])}
            <div tw="flex flex-row items-center justify-between mb-[55px] tablet:mb-[68px]">
                <div tw="flex flex-row items-center">
                    <div tw="h-2 w-4">
                        <img src="/assets/shared/icon-arrow-left.svg" />
                    </div>
                    <span tw="text-lightBlueGray font-bold" onClick={() => router.back()}>Go Back</span>
                </div>
            </div>
            <div tw="relative flex flex-col bg-white px-6 py-[44px] tablet:px-7 tablet:py-[52px] rounded-lg">
                <div tw="absolute h-10 w-10 tablet:h-14 tablet:w-14 top-[-20px] tablet:top-[-28px]">
                    <img src="/assets/shared/icon-new-feedback.svg" alt="new-feedback" />
                </div>
                <div tw="">
                    <h1 tw="font-bold text-darkBlueGray text-xl mb-6 tablet:mb-10">Editing '{feedback[0].title}'</h1>
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
                                <div tw="capitalize">{select}</div>
                                <div tw="h-1 w-2"><img src="/assets/shared/icon-arrow-down.svg" alt="arrow-down" /></div>
                            </div>
                            <OutsideAlerter setFunction={setDropdown}>
                                <Dropdown tw="flex flex-col rounded-xl border border-[1px] border-darkGray divide-y-[1px] divide-darkBlueGray divide-opacity-[0.15] text-lightBlueGray" dropdown={dropdown}>
                                    {dropdownSelects.map((dropdownSelect, i) =>
                                        <div key={i} tw="flex flex-row py-[12px] px-6 items-center justify-between cursor-pointer" onClick={() => { setSelect(dropdownSelects[i]); setDropdown(false); }}>
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
                        <div tw="flex flex-col tablet:flex-row-reverse justify-between gap-y-4">
                            <div tw="flex flex-col tablet:flex-row-reverse content-end gap-y-4 gap-x-4">
                                <button tw="flex flex-row items-center place-content-center bg-cPurple h-10 w-full tablet:w-[144px] rounded-lg font-bold text-white" onClick={handleSubmit(data => handleEditFeedback(data))}>Edit Feedback</button>
                                <button tw="bg-darkBlueGray flex flex-row items-center place-content-center h-10 w-full tablet:w-[144px] rounded-lg font-bold text-white" onClick={() => router.back()}>Cancel</button>
                            </div>
                            <button tw="bg-cRed flex flex-row self-start items-center place-content-center h-10 w-full tablet:w-[93px] rounded-lg font-bold text-white" onClick={handleSubmit(data => handleDeleteFeedback(data))}>Delete</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
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

        let feedbacks = await db
            .collection("feedbacks")
            .find({ _id: id })
            .toArray();

        return {
            props: { feedback: JSON.parse(JSON.stringify(feedbacks)) },
        };
    } catch (e) {
        console.error(e);
    }
};

