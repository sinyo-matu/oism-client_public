import { useAtom } from "jotai";
import React from "react";
import styled from "styled-components";
import { isManualInputAtom } from "../../../store/StockRegister";
import { HStack } from "../../../styles/atoms/HStack";
import { ButtonCompo } from "../../ButtonCompo";
import { ItemCodeInput } from "./ItemCodeInput";
import { ItemDetailInput } from "./ItemDetailInput";

export const InputBar = () => {
  const [isManual, setIsManual] = useAtom(isManualInputAtom);
  return (
    <Wrapper justify="start">
      <InputWrapper>
        <ItemCodeInput />
        <ItemDetailInput />
      </InputWrapper>
      <ButtonWrapper>
        <ButtonCompo selected={isManual} onClick={() => setIsManual(!isManual)}>
          手動
        </ButtonCompo>
      </ButtonWrapper>
    </Wrapper>
  );
};

const Wrapper = styled(HStack)`
  grid-area: srh;
`;

const InputWrapper = styled.div`
  display: flex;
  width: 70%;
  flex-direction: column;
  justify-content: flex-start;
  gap: 5px;
`;

const ButtonWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;
