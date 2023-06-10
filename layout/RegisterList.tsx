import React from "react";
import styled from "styled-components";
import { RegisterListView } from "../components/RegisterList";
import { deriveFadeIn } from "../styles/animation";
import Wrapper from "../styles/PageLayoutWrapper";
export const RegisterList = () => {
  return (
    <Wrapper>
      <FadeInContent>
        <RegisterListView />
      </FadeInContent>
    </Wrapper>
  );
};

const Content = styled.div`
  height: 100%;
  width: 100%;
`;

const FadeInContent = deriveFadeIn(Content);
