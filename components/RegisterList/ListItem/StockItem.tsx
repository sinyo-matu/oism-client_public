import React from "react";
import styled from "styled-components";
import { parseItemCode } from "../../../lib/utility";
import { Color } from "../../../styles/Color";
import { RegisterItem } from "../../../type";
import { CustomImage } from "../../Image";

export const StockItem = ({ item }: { item: RegisterItem }) => {
  const [itemCode, size, color] = parseItemCode(item.itemCodeExt);
  return (
    <Wrapper>
      <CustomImage width={20} itemCode={itemCode} colorNo={Number(color)} />
      <InfoCell>{itemCode}</InfoCell>
      <InfoCell>{size}</InfoCell>
      <InfoCell>{color}</InfoCell>
      <CountCell>{item.count}</CountCell>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  cursor: default;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 10% 30% 20% 20% 20%;
  width: 100%;
  gap: 5px;
  border-radius: 999px;
`;

const InfoCell = styled.div`
  text-align: center;
`;

const CountCell = styled(InfoCell)`
  color: ${Color.MAIN};
`;
