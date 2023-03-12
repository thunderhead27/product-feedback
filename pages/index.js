import React, { useState } from 'react';
import tw, { styled } from 'twin.macro';
import Hamburger from "hamburger-react";
import Link from "next/link";
import Image from "next/image";
import clientPromise from "../lib/mongodb";
import Feedback from "../components/Feedback";
import EmptyFeedback from "../components/EmptyFeedback";
import ToggleGroup from "../components/ToggleGroup";
import OutsideAlerter from "../hooks/useOutsideAlerter";
import { useRouter } from "next/router";

const OverlayContainer = styled.div`
position: relative;
width: 100%;
${({ isOpen }) => (isOpen ? `background-color: rgba(0,0,0,0.5); filter: brightness(50%)` : ``)};
`;

const Menu = styled.div`
display: flex; 
flex-direction: column;
position: fixed;
top: 72px;
width: 271px;
height: 100%;
right: -100%;
transition: 350ms;
${({ isOpen }) => (isOpen ? `right: 0` : ``)};
`;

const Dropdown = styled.div`
  visibility: hidden;
  position: absolute;
  top: 90px;
  left: 450px;
  width: 255px;
  background-color: white;
  z-index: 10;

  @media (max-width: 768px) {
    top: 75px;
    left: 80px;
  }

  ${({ dropdown }) => (dropdown ? `visibility: visible` : ``)};
`;

const Checkmark = styled.div`
  display: none
  ${({ active }) => (active ? `display: block` : ``)};
`;


const IndexPage = ({ data }) => {
  const [isOpen, setOpen] = useState(false);
  const [active, setActive] = useState('all');
  const [dropdown, setDropdown] = useState(false);
  const dropdownSelects = ['Most Upvotes', 'Least Upvotes', 'Most Comments', 'Least Comments'];

  const router = useRouter();

  const [select, setSelect] = useState(dropdownSelects[0]);

  const getRoadmapLength = (status) => {
    return data.filter(feedback => feedback.status === status).length;
  };

  const filteredFeedbacks = (category) => {
    if (category === 'all') return data;
    else return data.filter(feedback => feedback.category === category);
  };

  const sortFeedbacks = (feedbacks, criteria) => {
    switch (criteria) {
      case 'Most Upvotes': {
        return feedbacks.sort((a, b) => b.upvotes - a.upvotes);
      }
      case 'Least Upvotes': {
        return feedbacks.sort((a, b) => a.upvotes - b.upvotes);
      }
      case 'Most Comments': {
        return feedbacks.sort((a, b) => b.comments?.length - a.comments?.length);
      }
      case 'Least Comments': {
        return feedbacks.sort((a, b) => a.comments?.length - b.comments?.length);
      }
    };
  };

  return (
    <div tw="flex flex-col items-center font-sans bg-gray h-full overflow-x-hidden" >
      <div tw="flex flex-col desktop:flex-row tablet:w-[689px] desktop:w-[1110px] tablet:py-[56px] desktop:py-[94px] gap-x-8">
        <div tw="flex flex-row tablet:gap-x-[10px] desktop:flex-col gap-y-6 desktop:w-[255px] bg-gray tablet:pb-[40px] desktop:fixed z-20">
          <div tw="flex flex-row tablet:rounded-xl items-center h-[72px] tablet:h-[178px] w-full tablet:w-[223px] desktop:w-full desktop:h-[137px] bg-[url('/assets/suggestions/mobile/background-header.png')] tablet:bg-[url('/assets/suggestions/tablet/background-header.png')] desktop:bg-[url('/assets/suggestions/desktop/background-header.png')] bg-cover bg-no-repeat place-content-between px-6">
            <div tw="flex flex-col text-white">
              <h1 tw="font-bold desktop:text-xl">Frontend Mentor</h1>
              <p>Feedback Board</p>
            </div>
            <div tw="tablet:hidden"><Hamburger color="#ffffff" toggled={isOpen} toggle={setOpen} /></div>
          </div>
          <div tw="hidden bg-white tablet:flex tablet:flex-col tablet:h-[178px] rounded-xl pt-6 pl-4">
            <ToggleGroup active={active} setActive={setActive} />
          </div>
          <div tw="hidden tablet:flex flex-col tablet:h-[178px] tablet:w-[223px] desktop:w-full rounded-xl bg-white py-6 px-6">
            <div tw="flex flex-row justify-between mb-4">
              <h1 tw="text-xl font-bold">Roadmap</h1>
              <Link href="/roadmap"><span tw="text-blue font-medium underline">View</span></Link>
            </div>
            <div tw="flex flex-col text-lightBlueGray gap-y-2">
              <div tw="flex flex-row items-center justify-between">
                <div tw="flex flex-row items-center gap-x-2">
                  <div tw="h-2 w-2 rounded-full bg-peach"></div>
                  <span>Planned</span>
                </div>
                <span tw="font-bold">{getRoadmapLength('planned')}</span>
              </div>
              <div tw="flex flex-row items-center justify-between">
                <div tw="flex flex-row items-center gap-x-2">
                  <div tw="h-2 w-2 rounded-full bg-cPurple"></div>
                  <span>In-Progress</span>
                </div>
                <span tw="font-bold">{getRoadmapLength('in-progress')}</span>
              </div>
              <div tw="flex flex-row items-center justify-between">
                <div tw="flex flex-row items-center gap-x-2">
                  <div tw="h-2 w-2 rounded-full bg-lightBlue"></div>
                  <span>Live</span>
                </div>
                <span tw="font-bold">{getRoadmapLength('live')}</span>
              </div>
            </div>
          </div>
          {/* Mobile menu */}
          <Menu tw="bg-gray py-6 px-6" isOpen={isOpen}>
            <div tw="flex flex-col gap-y-6">
              <div tw="rounded-xl py-6 pl-4 bg-white">
                <ToggleGroup />
              </div>
              <div tw="flex flex-col rounded-xl bg-white pt-6 px-6 h-[178px] w-[223px]">
                <div tw="flex flex-row justify-between mb-4">
                  <h1 tw="text-xl font-bold">Roadmap</h1>
                  <Link href="/roadmap"><span tw="text-blue font-medium underline">View</span></Link>
                </div>
                <div tw="flex flex-col text-lightBlueGray gap-y-2">
                  <div tw="flex flex-row items-center justify-between">
                    <div tw="flex flex-row items-center gap-x-2">
                      <div tw="h-2 w-2 rounded-full bg-peach"></div>
                      <span>Planned</span>
                    </div>
                    <span tw="font-bold">{getRoadmapLength('planned')}</span>
                  </div>
                  <div tw="flex flex-row items-center justify-between">
                    <div tw="flex flex-row items-center gap-x-2">
                      <div tw="h-2 w-2 rounded-full bg-cPurple"></div>
                      <span>In-Progress</span>
                    </div>
                    <span tw="font-bold">{getRoadmapLength('in-progress')}</span>
                  </div>
                  <div tw="flex flex-row items-center justify-between">
                    <div tw="flex flex-row items-center gap-x-2">
                      <div tw="h-2 w-2 rounded-full bg-lightBlue"></div>
                      <span>Live</span>
                    </div>
                    <span tw="font-bold">{getRoadmapLength('live')}</span>
                  </div>
                </div>
              </div>
            </div>
          </Menu>
        </div>
        <OverlayContainer tw="desktop:pl-[285px]" isOpen={isOpen}>
          <div tw="flex flex-col bg-gray gap-y-6">
            <div tw="flex flex-row bg-darkBlueGray h-[56px] tablet:h-[72px] w-full tablet:rounded-xl mb-8 tablet:mb-6 items-center px-6 justify-between">
              {/* Mobile */}
              <div tw="flex tablet:hidden flex-row justify-between w-full">
                <div tw="flex flex-row">
                  <div tw="flex flex-row text-darkGray opacity-75 items-center gap-x-2 cursor-pointer" onClick={() => setDropdown(true)} >
                    <span>Sort by: {select}</span>
                    <div tw="h-[4px] w-[8px]"><img tw="text-white" src="/assets/shared/icon-arrow-down.svg" alt="arrow-down" /></div>
                  </div>
                </div>
                <Link href="/createNewFeedback">
                  <button tw="h-[44px] w-[158px] bg-cPurple rounded-lg text-white font-bold">+ Add Feedback</button>
                </Link>
              </div>
              {/* End of Mobile */}
              <div tw="hidden tablet:flex flex-row justify-between w-full">
                <div tw="flex flex-row">
                  <div tw="flex flex-row text-white font-bold gap-x-4 mr-10 items-center">
                    <Image src="/assets/suggestions/icon-suggestions.svg" width={24} height={24} alt="suggestion" />
                    {active === 'all' ? data.length : filteredFeedbacks(active).length} Suggestions
                  </div>
                  <div tw="flex flex-row text-darkGray opacity-75 items-center gap-x-2 cursor-pointer" onClick={() => setDropdown(true)} >
                    <span>Sort by: {select}</span>
                    <div tw="h-[4px] w-[8px]"><img tw="text-white" src="/assets/shared/icon-arrow-down.svg" alt="arrow-down" /></div>
                  </div>
                </div>
                <Link href="/createNewFeedback">
                  <button tw="h-[44px] w-[158px] bg-cPurple rounded-lg text-white font-bold hover:bg-purpleHover">+ Add Feedback</button>
                </Link>
              </div>
              <OutsideAlerter setFunction={setDropdown}>
                <Dropdown tw="flex flex-col rounded-xl border border-[1px] border-darkGray divide-y-[1px] divide-darkBlueGray divide-opacity-[0.15] text-lightBlueGray" dropdown={dropdown}>
                  {dropdownSelects.map((dropdownSelect, i) => (
                    <div tw="flex flex-row py-[12px] px-6 items-center justify-between cursor-pointer" onClick={() => { setSelect(dropdownSelects[i]); setDropdown(false); }}>
                      <div>{dropdownSelect}</div>
                      <Checkmark active={select === dropdownSelect}><Image src="/assets/shared/icon-check.svg" width={11} height={8} alt="checkmark" /></Checkmark>
                    </div>
                  ))}
                </Dropdown>
              </OutsideAlerter>
            </div>
            {data ?
              <div tw="px-6 tablet:px-0">
                <div tw="flex flex-col gap-y-4 desktop:gap-y-[20px]">
                  {sortFeedbacks(filteredFeedbacks(active), select).map(feedback => (
                    <Feedback feedback={feedback} active={active} />
                  ))}
                </div>
              </div>
              :
              <EmptyFeedback />
            }
          </div>
        </OverlayContainer>
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

export default IndexPage;
