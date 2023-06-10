import React, { useState } from "react";
import styled from "styled-components";
import { Color } from "../../../styles/Color";
import { Order } from "../../../type/order";
import { OrderItemList } from "./OrderItemList";
import { OrderMeta } from "./OrderMeta";
//TODO add feature: update order
export const OrderListItem = ({ fromParent }: { fromParent: Order }) => {
  const [order, setOrder] = useState<Order>(fromParent);
  return (
    <Wrapper className="relative bg-white flex flex-col items-center content-start gap-1 w-full rounded-2xl">
      <OrderMeta order={order} setOrder={setOrder} />
      <OrderItemList items={order.items} />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  padding: 0 0 10px 0;
  box-shadow: 0px 0px 7px -5px ${Color.Black};
  transition: 0.5s;
  &:hover .controlPanel {
    opacity: 1;
  }
  &:hover {
    box-shadow: 0 0 7px -3px ${Color.Black};
  }
  &:hover .item-controlArea {
    opacity: 1;
  }
`;
