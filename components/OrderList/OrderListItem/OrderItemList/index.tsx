import { useAtomValue } from "jotai";
import React from "react";
import { queryOrderItemStatusAtom } from "../../../../store/orderList";
import { OrderItem } from "../../../../type/order";
import { Item } from "./Item";

export const OrderItemList = ({ items }: { items: OrderItem[] }) => {
  const orderItemStatus = useAtomValue(queryOrderItemStatusAtom);
  return (
    <div className="flex w-full flex-col gap-1 px-2">
      {items
        .filter((item) =>
          Array.from(orderItemStatus).length === 0
            ? true
            : Array.from(orderItemStatus).includes(item.status)
        )
        .map((item) => (
          <Item key={item.id} fromParent={item} />
        ))}
    </div>
  );
};
