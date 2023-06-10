import { useAtomValue, useSetAtom } from "jotai";
import React from "react";
import styled from "styled-components";
import { parseItemCode } from "../../../lib/utility";
import { increaseItemListAtom } from "../../../store/newTransfer";
import { fromLocationAtom } from "../../../store/newTransfer";
import { fadeIn } from "../../../styles/animation";
import { HStack } from "../../../styles/atoms/HStack";
import { VStack } from "../../../styles/atoms/VStack";
import { Color } from "../../../styles/Color";
import { InventoryItem } from "../../../type";
import { CustomImage } from "../../Image";

export const SuggestionItem = ({
  item,
  index,
}: {
  item: InventoryItem;
  index: number;
}) => {
  const [code, size, color] = parseItemCode(item.itemCodeExt);
  const increaseTransferItem = useSetAtom(increaseItemListAtom);
  const fromLocation = useAtomValue(fromLocationAtom);
  const fromLocationIndex = item.quantity.findIndex(
    (v) => v.location === fromLocation
  );
  const handleOnClick = () => {
    increaseTransferItem({
      itemCodeExt: item.itemCodeExt,
      createdAt: item.createdAt,
      updateAt: item.updateAt,
      quantity: item.quantity.map((q) => ({
        quantity: q.quantity,
        location: q.location,
      })),
      operationIds: item.operationIds,
    });
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
            <TextWrapper>
              x{item.quantity[fromLocationIndex].quantity}
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

const TextWrapper = styled.div`
  min-width: 50px;
  border: 1px solid ${Color.SUB};
  box-sizing: border-box;
  text-align: center;
  background-color: white;
  color: black;
  border-radius: 999px;
  padding: 0px 7px;
`;
