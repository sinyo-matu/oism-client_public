import { useAtom } from "jotai";
import React from "react";
import styled from "styled-components";
import { orderItemListAtom } from "../../../store/newOrder";
import { ListItem } from "./ListItem";

export const OrderItemList = () => {
  const [orderItemList] = useAtom(orderItemListAtom);
  return (
    <Wrapper>
      {orderItemList.size !== 0 ? (
        Array.from(orderItemList.entries()).map(
          ([itemCodeExt, listMapItem], i) => {
            return (
              <ListItem
                key={itemCodeExt}
                index={i}
                itemCodeExt={itemCodeExt}
                listMapItem={listMapItem}
              />
            );
          }
        )
      ) : (
        <div>アイテムを登録してください</div>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  grid-area: lst;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: calc(100vh - 220px);
  gap: 10px;
  overflow-y: auto;
  box-sizing: border-box;
  padding: 5px;
`;
