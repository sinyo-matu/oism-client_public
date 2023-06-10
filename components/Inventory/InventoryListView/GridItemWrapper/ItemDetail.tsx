import { useSetAtom } from "jotai";
import { useTranslation } from "next-i18next";
import React from "react";
import styled from "styled-components";
import { getLocationBGColor, parseItemCode } from "../../../../lib/utility";
import {
  forDetailItemAtom,
  showInventoryItemDetailAtom,
} from "../../../../store/inventory";
import { expand } from "../../../../styles/animation";
import { CapsuleBadge } from "../../../../styles/atoms/CapsuleBadge";
import { HStack } from "../../../../styles/atoms/HStack";
import { VStack } from "../../../../styles/atoms/VStack";
import { InventoryItem } from "../../../../type";
import { CustomImage } from "../../../Image";
import { SizeColor } from "./SizeColor";

export const ItemDetail = ({ item }: { item: InventoryItem }) => {
  const { t } = useTranslation("inventory");
  const [itemCode, size, color] = parseItemCode(item.itemCodeExt);
  const setForDetailItem = useSetAtom(forDetailItemAtom);
  const setDetailModalOpen = useSetAtom(showInventoryItemDetailAtom);
  const handleOnClick = () => {
    setForDetailItem(item);
    setDetailModalOpen(true);
  };
  return (
    <Wrapper onClick={handleOnClick}>
      <ContentWrapper justify="start">
        <SizeColor size={size} color={color} />
        <CustomImage
          itemCode={itemCode}
          width={100}
          colorNo={parseInt(color)}
        />
        <HStack justify="center">
          <div>{itemCode}</div>
        </HStack>
        <div className="hidden md:flex w-full items-center justify-center gap-1">
          {item.quantity.reduce(
            (total, quantity) => (total += quantity.quantity),
            0
          ) === 0 ? (
            <CapsuleBadge>在庫なし</CapsuleBadge>
          ) : (
            item.quantity.map((quantity) => {
              if (quantity.quantity === 0) return null;
              return (
                <CapsuleBadge
                  key={quantity.location}
                  background={getLocationBGColor(quantity.location)}
                >
                  {t(`location.${quantity.location}`)} {quantity.quantity}
                </CapsuleBadge>
              );
            })
          )}
        </div>
        <div className="flex md:hidden w-full items-center justify-center gap-1">
          {item?.quantity.reduce(
            (total, quantity) => (total += quantity.quantity),
            0
          ) === 0 ? (
            <CapsuleBadge>在庫なし</CapsuleBadge>
          ) : (
            item?.quantity.map((quantity) => {
              if (quantity.quantity === 0) return null;
              return (
                <CapsuleBadge
                  key={quantity.location}
                  background={getLocationBGColor(quantity.location)}
                  minWidth="20px"
                >
                  {quantity.quantity}
                </CapsuleBadge>
              );
            })
          )}
        </div>
      </ContentWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  cursor: pointer;
  border-radius: 15px;
  box-sizing: border-box;
  padding: 5px;
  width: 100%;
  height: 100%;
  background-color: white;
  // translateY fix Y misalignment and this is also in the expand animation.
  &:hover {
    transform: scale(1) translateY(-5px);
    animation: ${expand} ease-in-out 0.2s;
    animation-fill-mode: forwards;
  }
`;

const ContentWrapper = styled(VStack)``;
