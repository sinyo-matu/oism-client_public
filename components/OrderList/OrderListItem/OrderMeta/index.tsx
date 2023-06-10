import React, { Suspense } from "react";
import styled from "styled-components";
import {
  clickToCopyToClipboard,
  stringifyDateData,
} from "../../../../lib/utility";
import { Color } from "../../../../styles/Color";
import { Order } from "../../../../type/order";
import { ControlPanel } from "./ControlPanel";
import { Note } from "./Note";
import { TotalPrice } from "./TotalPrice";

export const OrderMeta = ({
  order,
  setOrder,
}: {
  order: Order;
  setOrder: React.Dispatch<React.SetStateAction<Order>>;
}) => {
  const itemQ = order.items.filter(
    (item) => item.status !== "concealed"
  ).length;
  return (
    <div className="metaWrapper w-full flex flex-wrap p-2 items-center rounded-tl-2xl rounded-tr-2xl transition duration-500 gap-2 bg-sub">
      <div onClick={clickToCopyToClipboard} className="controlPanel transition-opacity cursor-pointer opacity-0 absolute right-2 lg:right-16 z-10 top-0 text-[8px] text-default" >{order.taobaoOrderNo}</div>
      <NoWrapper onClick={clickToCopyToClipboard}>{order.customerId}</NoWrapper>
      <NoWrapper>{itemQ}点</NoWrapper>
      <NoWrapper>
        <Suspense fallback="">
          <TotalPrice order={order} />
        </Suspense>
      </NoWrapper>
      <Note order={order} setOrder={setOrder} />
      <div className="flex items-center text-default gap-1 justify-between w-full lg:w-fit">
        {stringifyDateData(order.orderDatetime)}
        <ControlPanel order={order} />
      </div>
    </div>
  );
};

const NoWrapper = styled.div`
  cursor: pointer;
  box-sizing: border-box;
  text-align: center;
  background-color: ${Color.Default};
  border: 1px solid ${Color.SUB};
  color: ${Color.SUB};
  border-radius: 999px;
  padding: 0px 7px;
`;
