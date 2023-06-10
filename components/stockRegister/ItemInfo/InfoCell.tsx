import React from "react";
import styled from "styled-components";
import { Color } from "../../../styles/Color";

export const InfoCell = ({
  label,
  content,
}: {
  label: string;
  content: string;
}) => {
  return (
    <Wrapper>
      <Label>{label}</Label>
      <Content>
        <TextWrapper>{content}</TextWrapper>
      </Content>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;
const Label = styled.div`
  text-align: center;
`;
const Content = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TextWrapper = styled.div`
  min-width: 50px;
  box-sizing: border-box;
  text-align: center;
  background-color: ${Color.Default};
  border: 1px solid ${Color.SUB};
  color: ${Color.SUB};
  border-radius: 999px;
  padding: 0px 7px;
`;
