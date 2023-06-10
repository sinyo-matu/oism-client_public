import React from "react";
import styled from "styled-components";
import {
  convertToJPYCurrencyFormatString,
  convertWithTaxPriceToWithOutTaxPrice,
  parseItemCode,
} from "../../../lib/utility";
import { fadeIn } from "../../../styles/animation";
import { HStack } from "../../../styles/atoms/HStack";
import { VStack } from "../../../styles/atoms/VStack";
import { Color } from "../../../styles/Color";
import { StockRegisterStockItem } from "../../../type";
import { ButtonCompo } from "../../ButtonCompo";
import { CustomImage } from "../../Image";

export const ListItem = ({
  index,
  stockItem,
  remover,
}: {
  index: number;
  stockItem: StockRegisterStockItem;
  remover: (i: number) => void;
}) => {
  const [code, size, color] = parseItemCode(stockItem.itemCodeExt);
  const handleOnClick = () => {
    remover(index);
  };
  return (
    <Wrapper delay={index}>
      <HStack justify="start">
        <CustomImage width={50} colorNo={parseInt(color)} itemCode={code} />
        <VStack justify="center">
          <HStack justify="start">
            <Meta>{stockItem.itemName}</Meta>
            <Meta>
              {convertToJPYCurrencyFormatString(
                convertWithTaxPriceToWithOutTaxPrice(stockItem.price ?? 0)
              )}
            </Meta>
          </HStack>
          <HStack justify="start">
            <ItemInfoCell>{code}</ItemInfoCell>
            <ItemInfoCell>{size}</ItemInfoCell>
            <ItemInfoCell background={Color.MAIN}>{color}</ItemInfoCell>
          </HStack>
          <HStack justify="end">
            <TextWrapper background={"jp"}>x{stockItem.count}</TextWrapper>
          </HStack>
        </VStack>
      </HStack>
      <ButtonCompo onClick={handleOnClick}>削除</ButtonCompo>
    </Wrapper>
  );
};
interface WrapperProps {
  delay: number;
}

const Wrapper = styled.div<WrapperProps>`
  background-color: ${Color.Default};
  position: relative;
  box-sizing: border-box;
  padding: 7px 7px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${Color.SUB};
  border-radius: 10px;
  gap: 3px;
  opacity: 0;
  animation: ${fadeIn} 0.5s ease ${(props) => props.delay * 30}ms;
  animation-fill-mode: forwards;
  box-shadow: 0px 0px 7px -5px ${Color.Black};
  transition: 0.5s;
  &:hover {
    box-shadow: 0 0 7px -3px ${Color.Black};
    border-color: ${Color.MAIN};
  }
`;
const Meta = styled.div`
  font-size: 0.7rem;
  color: ${Color.SUB};
`;

interface InfoCellProps {
  color?: string;
  background?: string;
}

const ItemInfoCell = styled.div<InfoCellProps>`
  text-align: center;
  min-width: 40px;
  padding: 1px 7px;
  background-color: ${(props) =>
    props.background ? props.background : Color.SUB};
  border-radius: 999px;
  color: ${(props) => (props.color ? props.color : Color.Default)};
`;

interface TextProps {
  background: "cn" | "jp";
}

const TextWrapper = styled.div<TextProps>`
  min-width: 50px;
  border: 1px solid ${Color.SUB};
  box-sizing: border-box;
  text-align: center;
  background-color: ${(props) => {
    switch (props.background) {
      case "jp":
        return "white";
      case "cn":
        return Color.CNRed;
    }
  }};
  color: black;
  border-radius: 999px;
  padding: 0px 7px;
`;
