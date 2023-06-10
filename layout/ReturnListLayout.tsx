import React from "react";
import styled from "styled-components";
import { ReturnListView } from "../components/ReturnList";
import { deriveFadeIn } from "../styles/animation";
import Wrapper from "../styles/PageLayoutWrapper";
export const ReturnListLayout = () => {
  return (
    <Wrapper>
      <FadeInContent>
        <ReturnListView />
      </FadeInContent>
    </Wrapper>
  );
};

const Content = styled.div`
  height: 100%;
  width: 100%;
`;

const FadeInContent = deriveFadeIn(Content);
