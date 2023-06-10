import { useAtom } from "jotai";
import React from "react";
import styled from "styled-components";
import { isManualInputAtom } from "../../../store/newOrder";
import { ButtonCompo } from "../../ButtonCompo";
import { CodeInput } from "./CodeInput";

export const ItemCodeInput = () => {
  const [isManual, setIsManual] = useAtom(isManualInputAtom);
  return (
    <Wrapper>
      <CodeInput />
      <ButtonWrapper>
        <ButtonCompo selected={isManual} onClick={() => setIsManual(!isManual)}>
          手動
        </ButtonCompo>
      </ButtonWrapper>
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
const ButtonWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;
