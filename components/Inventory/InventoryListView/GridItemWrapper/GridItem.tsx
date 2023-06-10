import { useSetAtom } from "jotai";
import React from "react";
import styled from "styled-components";
import {
  forDetailItemAtom,
  showInventoryItemDetailAtom,
} from "../../../../store/inventory";
import { VStack } from "../../../../styles/atoms/VStack";
import { InventoryItem } from "../../../../type";
import { ItemDetail } from "./ItemDetail";

export const GridItem = ({ item }: { item: InventoryItem; index: number }) => {
  const setForDetailItem = useSetAtom(forDetailItemAtom);
  const setDetailModalOpen = useSetAtom(showInventoryItemDetailAtom);
  const handleOnClick = () => {
    setForDetailItem(item);
    setDetailModalOpen(true);
  };
  return (
    <Wrapper
      itemCodeExt={item.itemCodeExt}
      justify="start"
      onClick={handleOnClick}
    >
      <ItemDetail item={item} />
    </Wrapper>
  );
};

interface WrapperProps {
  itemCodeExt: string;
}

const Wrapper = styled(VStack)<WrapperProps>`
  position: relative;
  box-sizing: border-box;
  padding: 5px;
  @media (min-width: 1024px) {
  }
`;
