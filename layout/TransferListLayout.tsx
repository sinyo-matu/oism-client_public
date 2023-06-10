import React from "react";
import styled from "styled-components";
import { TransferListView } from "../components/TransferList";
import { deriveFadeIn } from "../styles/animation";
import Wrapper from "../styles/PageLayoutWrapper";
export const TransferListLayout = () => {
  return (
    <Wrapper>
      <FadeInContent>
        <TransferListView />
      </FadeInContent>
    </Wrapper>
  );
};

const Content = styled.div`
  height: 100%;
  width: 100%;
`;

const FadeInContent = deriveFadeIn(Content);
