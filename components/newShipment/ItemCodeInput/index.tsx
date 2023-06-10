import React from "react";
import styled from "styled-components";
import { CodeInput } from "./CodeInput";
import { LocationRadioButton } from "./LocationRadioButton";

export const ItemCodeInput = () => {
  return (
    <Wrapper>
      <CodeInput />
      <LocationRadioButton />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  grid-area: srh;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 5px;
`;
