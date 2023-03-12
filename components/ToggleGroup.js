import React from 'react';
import tw, { styled } from 'twin.macro';

const FilterButton = styled.button(({ active }) => [
    tw`bg-darkGray py-[5px] px-4 rounded-xl text-blue font-medium`,
    active && tw`bg-blue text-white`
]);


const ToggleGroup = ({ active, setActive }) => {
    return (
        <div tw="flex flex-col gap-y-[14px]">
            <div tw="flex flex-row gap-x-[14px]">
                <FilterButton active={active === 'All'} onClick={() => setActive('all')}>All</FilterButton>
                <FilterButton active={active === 'UI'} onClick={() => setActive('ui')}>UI</FilterButton>
                <FilterButton active={active === 'UX'} onClick={() => setActive('ux')}>UX</FilterButton>
            </div>
            <div tw="flex flex-row gap-x-[14px]">
                <FilterButton active={active === 'Enhancement'} onClick={() => setActive('enhancement')}>Enhancement</FilterButton>
                <FilterButton active={active === 'Bug'} onClick={() => setActive('bug')}>Bug</FilterButton>
            </div>
            <div tw="flex flex-row">
                <FilterButton active={active === 'Feature'} onClick={() => setActive('feature')}>Feature</FilterButton>
            </div>
        </div>
    );
};

export default ToggleGroup;