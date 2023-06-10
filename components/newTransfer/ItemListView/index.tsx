import { useAtom } from "jotai";
import { useAtomValue } from "jotai";
import { useTranslation } from "next-i18next";
import React from "react";
import styled from "styled-components";
import {
  decreaseItemListAtom,
  toLocationAtom,
  transferListAtom,
} from "../../../store/newTransfer";
import { HStack } from "../../../styles/atoms/HStack";
import { VStack } from "../../../styles/atoms/VStack";
import { ListItem } from "./ListItem";

export const ItemListView = () => {
  const { t } = useTranslation("inventory");
  const [transferItemList] = useAtom(transferListAtom);
  const [, decreaseItemsListItem] = useAtom(decreaseItemListAtom);
  const toLocation = useAtomValue(toLocationAtom);
  return (
    <Wrapper justify="start">
      <HStack justify="between">
        <div>
          合計:
          {Array.from(transferItemList).reduce((sum, [key, [item, cq]], i) => {
            sum += cq;
            return sum;
          }, 0)}
          点
        </div>
        <div>To {t(`location.${toLocation}`)}</div>
      </HStack>
      <ListWrapper justify="start">
        <ListItemWrapper>
          {transferItemList.size !== 0 ? (
            Array.from(transferItemList)
              .reverse()
              .map(([itemCodeExt, [item, cq]], i) => {
                return (
                  <ListItem
                    key={itemCodeExt}
                    index={i}
                    item={item}
                    cq={cq}
                    remover={() => {
                      decreaseItemsListItem({
                        itemCodeExt: item.itemCodeExt,
                        createdAt: item.createdAt,
                        updateAt: item.updateAt,
                        quantity: item.quantity.map((q) => ({
                          quantity: q.quantity,
                          location: q.location,
                        })),
                        operationIds: item.operationIds,
                      });
                    }}
                  />
                );
              })
          ) : (
            <div>返品を登録してください</div>
          )}
        </ListItemWrapper>
      </ListWrapper>
    </Wrapper>
  );
};

const Wrapper = styled(VStack)`
  grid-area: lst;
  width: 100%;
`;
const ListWrapper = styled(VStack)`
  width: 100%;
`;

const ListItemWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: calc(100vh - 240px);
  gap: 10px;
  overflow-y: auto;
  box-sizing: border-box;
  padding: 5px;
`;
