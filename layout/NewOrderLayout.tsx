import React, { Suspense } from "react";
import styled from "styled-components";
import { ControlPanel } from "../components/NewOrder/ControlPanel";
import { ItemCodeInput } from "../components/NewOrder/ItemCodeInput";
import { ItemSuggestionAndInfo } from "../components/NewOrder/ItemSuggestionAndInfo";
import { OrderItemList } from "../components/NewOrder/OrderItemList";
import { deriveFadeIn } from "../styles/animation";
import Wrapper from "../styles/PageLayoutWrapper";

export const NewOrderLayout = () => {
  return (
    <Wrapper>
      <FadeInContent>
        <Suspense fallback={""}>
          <ItemCodeInput />
        </Suspense>
        <ControlPanel />
        <Suspense fallback={""}>
          <ItemSuggestionAndInfo />
        </Suspense>
        <OrderItemList />
      </FadeInContent>
    </Wrapper>
  );
};

const Content = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  gap: 10px;
  grid-auto-rows: 1fr;
  grid-auto-columns: 1fr;
  grid-template-areas:
    "srh srh ctl ctl ctl"
    "info info lst lst lst"
    "info info lst lst lst"
    "info info lst lst lst"
    "info info lst lst lst"
    "info info lst lst lst";
`;
const FadeInContent = deriveFadeIn(Content);
