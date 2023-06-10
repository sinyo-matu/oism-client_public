import React from "react";
import styled from "styled-components";
import { getLocationBGColor, parseItemCode } from "../../../lib/utility";
import { fadeIn, PopUpWithRotate } from "../../../styles/animation";
import { HStack } from "../../../styles/atoms/HStack";
import { VStack } from "../../../styles/atoms/VStack";
import { Color } from "../../../styles/Color";
import { InventoryItem } from "../../../type";
import { InventoryLocation } from "../../../type/inventory";
import { CustomImage } from "../../Image";

export const ListItem = ({
  index,
  item,
  remover,
}: {
  index: number;
  item: InventoryItem;
  remover: () => void;
}) => {
  const [code, size, color] = parseItemCode(item.itemCodeExt);
  const handleOnClick = () => {
    remover();
  };
  return (
    <Wrapper onClick={handleOnClick} delay={index}>
      <HStack justify="start">
        <CustomImage width={50} colorNo={parseInt(color)} itemCode={code} />
        <VStack justify="center">
          <HStack justify="start">
            <ItemInfoCell>{code}</ItemInfoCell>
            <ItemInfoCell>{size}</ItemInfoCell>
            <ItemInfoCell background={Color.MAIN}>{color}</ItemInfoCell>
          </HStack>
          <HStack justify="end">
            <TextWrapper background={item.quantity[0].location}>
              x{item.quantity[0].quantity}
            </TextWrapper>
          </HStack>
        </VStack>
      </HStack>
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
  cursor: pointer;
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
  &::after {
    width: 50px;
    height: 50px;
    text-align: center;
    content: "返";
    position: absolute;
    animation-fill-mode: forwards;
    background-color: transparent;
    box-sizing: border-box;
    padding: 10px;
    border: 2px dashed ${Color.JPRed};
    color: ${Color.JPRed};
    border-radius: 50%;
    opacity: 0;
    transform: rotate(-25deg);
    animation: ${PopUpWithRotate} 0.5s ease-in-out;
    animation-fill-mode: forwards;
    top: 5px;
    right: 5px;
  }
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
  background: InventoryLocation;
}

const TextWrapper = styled.div<TextProps>`
  min-width: 50px;
  border: 1px solid ${Color.SUB};
  box-sizing: border-box;
  text-align: center;
  background-color: ${(props) => getLocationBGColor(props.background)};
  color: black;
  border-radius: 999px;
  padding: 0px 7px;
`;
