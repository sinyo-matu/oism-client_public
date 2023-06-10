import { useAtom } from "jotai";
import React from "react";
import styled from "styled-components";
import { itemCodeAtom } from "../../../../store/newOrder";
import { fadeIn } from "../../../../styles/animation";
import { Color } from "../../../../styles/Color";
import { PhItem } from "../../../../type";
import { CustomImage } from "../../../Image";

export const SuggestionItem = ({
  item,
  index,
}: {
  item: PhItem;
  index: number;
}) => {
  const [, setItemCode] = useAtom(itemCodeAtom);
  const handleOnClick = () => {
    setItemCode(item.code);
  };
  return (
    <Wrapper onClick={handleOnClick} delay={index}>
      <CustomImage width={50} itemCode={item.code} colorNo={3} />
      <div>{item.code}</div>
      <ItemName>{item.itemName}</ItemName>
    </Wrapper>
  );
};

interface WrapperProps {
  delay: number;
}
const Wrapper = styled.div<WrapperProps>`
  box-sizing: border-box;
  padding: 2px 7px;
  width: 100%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${Color.SUB};
  opacity: 0;
  animation: ${fadeIn} 0.5s ease ${(props) => props.delay * 30}ms;
  animation-fill-mode: forwards;
  border-radius: 10px;
  gap: 3px;
  box-shadow: 0px 0px 7px -5px ${Color.Black};
  transition: 0.5s;
  &:hover {
    box-shadow: 0 0 7px -3px ${Color.Black};
    border-color: ${Color.MAIN};
  }
`;

const ItemName = styled.div`
  flex-grow: 1;
`;
