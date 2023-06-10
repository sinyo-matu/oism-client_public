import React, { Suspense } from "react";
import styled from "styled-components";
import { ControlPanel } from "../components/newReturn/ControlPanel";
import { ItemCodeInput } from "../components/newReturn/ItemCodeInput";
import { ItemListView } from "../components/newReturn/ItemListView";
import { ItemSuggestion } from "../components/newReturn/ItemSuggestion";
import { deriveFadeIn } from "../styles/animation";
import Wrapper from "../styles/PageLayoutWrapper";

export const NewReturnLayout = () => {
  return (
    <Wrapper>
      <FadeInContent>
        <ItemCodeInput />
        <ControlPanel />
        <Suspense fallback={""}>
          <ItemSuggestion />
        </Suspense>
        <ItemListView />
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
