import React from "react";
import styled from "styled-components";
import { isManualInputAtom } from "../../../store/StockRegister";
import { useAtomValue } from "jotai";
import { AutoDetect } from "./AutoDetect";
import { ManualInput } from "./ManualInput";

export const ItemInfo = () => {
  const isManual = useAtomValue(isManualInputAtom);

  return <Wrapper>{isManual ? <ManualInput /> : <AutoDetect />}</Wrapper>;
};

const Wrapper = styled.div`
  grid-area: info;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 5px;
  border-radius: 15px;
`;
