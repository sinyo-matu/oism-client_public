import { useAtom } from "jotai";
import React from "react";
import styled from "styled-components";
import {
  convertToJPYCurrencyFormatString,
  convertWithTaxPriceToWithOutTaxPrice,
} from "../../../lib/utility";
import { decreaseItemListAtom } from "../../../store/StockRegister";
import { HStack } from "../../../styles/atoms/HStack";
import { VStack } from "../../../styles/atoms/VStack";
import { ListItem } from "./ListItem";

export const ItemList = () => {
  const [stockItemList, decreaseStockItemsList] = useAtom(decreaseItemListAtom);
  return (
    <Wrapper justify="start">
      <HStack justify="between">
        <div>
          合計:
          {Array.from(stockItemList).reduce((sum, [key, item], i) => {
            sum += item.count;
            return sum;
          }, 0)}
          点
        </div>
        <div>
          合計:
          {convertToJPYCurrencyFormatString(
            convertWithTaxPriceToWithOutTaxPrice(
              Array.from(stockItemList).reduce((sum, [key, item], i) => {
                sum += item.count * (item.price ?? 0);
                return sum;
              }, 0)
            )
          )}
        </div>
      </HStack>
      <ItemListWrapper>
        {stockItemList.size !== 0 ? (
          Array.from(stockItemList)
            .reverse()
            .map(([itemCodeExt, stockItem], i) => {
              return (
                <ListItem
                  key={`${itemCodeExt}-${i}`}
                  index={i}
                  stockItem={stockItem}
                  remover={() => {
                    decreaseStockItemsList({
                      itemCodeExt,
                      itemName: stockItem.itemName,
                      count: 1,
                    });
                  }}
                />
              );
            })
        ) : (
          <div>アイテムを登録してください</div>
        )}
      </ItemListWrapper>
    </Wrapper>
  );
};

const Wrapper = styled(VStack)`
  grid-area: lst;
  width: 100%;
`;
const ItemListWrapper = styled.div`
  grid-area: lst;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: calc(100vh - 240px);
  gap: 10px;
  overflow-y: auto;
  box-sizing: border-box;
  padding: 5px;
`;
