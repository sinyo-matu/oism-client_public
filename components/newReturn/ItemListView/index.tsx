import { useAtom } from "jotai";
import React from "react";
import styled from "styled-components";
import {
  convertToJPYCurrencyFormatString,
  convertWithTaxPriceToWithOutTaxPrice,
} from "../../../lib/utility";
import {
  decreaseItemListAtom,
  returnItemsListAtom,
} from "../../../store/newReturn";
import { HStack } from "../../../styles/atoms/HStack";
import { VStack } from "../../../styles/atoms/VStack";
import { ListItem } from "./ListItem";

export const ItemListView = () => {
  const [returnItemsList] = useAtom(returnItemsListAtom);
  const [, decreaseItemsListItem] = useAtom(decreaseItemListAtom);
  return (
    <Wrapper justify="start">
      <HStack justify="between">
        <div>
          合計:
          {Array.from(returnItemsList).reduce(
            (sum, [key, [item, price]], i) => {
              sum += item.quantity[0].quantity;
              return sum;
            },
            0
          )}
          点
        </div>
        <div>
          合計:
          {convertToJPYCurrencyFormatString(
            convertWithTaxPriceToWithOutTaxPrice(
              Array.from(returnItemsList).reduce(
                (sum, [, [item, price]], i) => {
                  sum += item.quantity[0].quantity * price;
                  return sum;
                },
                0
              )
            )
          )}
        </div>
      </HStack>
      <ListItemWrapper>
        {returnItemsList.size !== 0 ? (
          Array.from(returnItemsList)
            .reverse()
            .map(([itemCodeExt, [item]], i) => {
              return (
                <ListItem
                  key={itemCodeExt}
                  index={i}
                  item={item}
                  remover={() => {
                    decreaseItemsListItem(item);
                  }}
                />
              );
            })
        ) : (
          <div>返品を登録してください</div>
        )}
      </ListItemWrapper>
    </Wrapper>
  );
};

const Wrapper = styled(VStack)`
  grid-area: lst;
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
