import { useAtomValue } from "jotai";
import React, { useEffect, useState } from "react";
import {
  convertToJPYCurrencyFormatString,
  convertWithTaxPriceToWithOutTaxPrice,
} from "../../../../lib/utility";
import { phItemCacheAtom } from "../../../../store/orderList";
import { Order, OrderItem } from "../../../../type/order";

export const TotalPrice = ({ order }: { order: Order }) => {
  const [totalPrice, setTotalPrice] = useState(0);
  const phItemCache = useAtomValue(phItemCacheAtom);

  useEffect(() => {
    const withPrice: [OrderItem, number][] = order.items
      .filter((item) => item.status !== "concealed")
      .map((item) => {
        const phItem = phItemCache.get(item.itemCodeExt.slice(0, 11));
        return [item, phItem?.price ?? 0];
      });
    const tp = withPrice.reduce(
      (acc, [item, price]) => acc + item.rate * price,
      0
    );
    setTotalPrice(convertWithTaxPriceToWithOutTaxPrice(tp));
  }, [order, phItemCache]);
  return <>{convertToJPYCurrencyFormatString(totalPrice)}</>;
};
