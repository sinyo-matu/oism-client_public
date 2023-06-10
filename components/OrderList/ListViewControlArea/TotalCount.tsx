import { useAtomValue } from "jotai";
import React from "react";
import styled from "styled-components";
import {
  ordersAtom,
  queryOrderItemStatusAtom,
  phItemCacheAtom,
} from "../../../store/orderList";
import { TotalPrice } from "../../TotalPrice";

export const TotalCount = () => {
  const orders = useAtomValue(ordersAtom);
  const items = orders.flatMap((order) => order.items);
  const orderItemStatus = useAtomValue(queryOrderItemStatusAtom);
  return (
    <div className="flex gap-1">
      <Wrapper>
        {
          items.filter((item) =>
            Array.from(orderItemStatus).length === 0
              ? true
              : Array.from(orderItemStatus).includes(item.status)
          ).length
        }
        点
      </Wrapper>
      <Wrapper>
        <TotalPrice cacheAtom={phItemCacheAtom} itemsAtom={ordersAtom} />
      </Wrapper>
    </div>
  );
};

const Wrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;
