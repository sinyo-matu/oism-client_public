import React from "react";
import { OrderItem } from "../../../../type/order";
import { Item } from "./Item";

export const OrderItemList = ({ items }: { items: OrderItem[] }) => {
  return (
    <div className="flex w-full flex-col gap-1 px-2">
      {items.map((item, i) => (
        <Item key={item.id} item={item} index={i} />
      ))}
    </div>
  );
};
