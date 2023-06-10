import { useAtomValue } from "jotai";
import React, { useEffect, useState } from "react";
import {
  convertToJPYCurrencyFormatString,
  convertWithTaxPriceToWithOutTaxPrice,
} from "../../../../lib/utility";
import { phItemCacheAtom } from "../../../../store/shipmentList";
import { OrderItem } from "../../../../type/order";
import { Shipment } from "../../../../type/shipment";

export const TotalPrice = ({ shipment }: { shipment: Shipment }) => {
  const [totalPrice, setTotalPrice] = useState(0);
  const phItemCache = useAtomValue(phItemCacheAtom);

  useEffect(() => {
    const withPrice: [OrderItem, number][] = shipment.items
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
  }, [shipment, phItemCache]);
  return <>{convertToJPYCurrencyFormatString(totalPrice)}</>;
};
