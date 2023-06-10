import React from "react";
import styled from "styled-components";
import { ListViewControlArea } from "../components/OrderList/ListViewControlArea";
import { OrderListView } from "../components/OrderList/OrderListView";
import { deriveFadeIn } from "../styles/animation";

export const OrderList = () => {
  return (
    <div className="w-full flex flex-col  items-center">
      <ListViewControlArea />
      <FadeInContent>
        <OrderListView />
      </FadeInContent>
    </div>
  );
};

const Content = styled.div`
  max-width: 1280px;
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  padding: 10px;
`;
const FadeInContent = deriveFadeIn(Content);
