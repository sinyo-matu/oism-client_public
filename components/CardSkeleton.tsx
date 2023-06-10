import React from "react";
import styled from "styled-components";
import { blink } from "../styles/animation";
import { Color } from "../styles/Color";

export const CardSkeleton = () => {
  return (
    <Wrapper>
      <MetaWrapper>
        <DummyMeta />
      </MetaWrapper>
      <ItemListWrapper>
        <OrderItemHeaderWrapper>
          <DummyHeader />
        </OrderItemHeaderWrapper>
        <ItemWrapper>
          <DummyItem />
          <DummyItem />
          <DummyItem />
        </ItemWrapper>
      </ItemListWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
  box-sizing: border-box;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 5px;
  width: 100%;
  padding: 0 0 10px 0;
  border-radius: 15px;
  box-shadow: 0px 0px 7px -5px ${Color.Black};
  transition: 0.5s;
  animation: ${blink} 1s linear infinite;
`;

const MetaWrapper = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding: 10px 10px;
  display: flex;
  align-items: center;
  flex-direction: row;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  transition: 0.5s;
  gap: 10px;
  background-color: ${Color.SUB};
`;

const ItemListWrapper = styled.div`
  display: flex;
  width: 100%;
  box-sizing: border-box;
  padding: 0px 10px;
  flex-direction: column;
  justify-content: flex-start;
  gap: 3px;
  flex-grow: 1;
`;
const ItemWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  overflow-y: auto;
  overflow-x: hidden;
`;

const DummyItem = styled.div`
  width: 95%;
  height: 2.5rem;
  border-radius: 10px;
`;

const DummyMeta = styled.div`
  width: 100%;
  height: 1.6rem;
`;

const OrderItemHeaderWrapper = styled.div`
  width: 100%;
  border-bottom: 1px solid ${Color.SUB};
`;

const DummyHeader = styled.div`
  width: 100%;
  height: 1.5rem;
`;
