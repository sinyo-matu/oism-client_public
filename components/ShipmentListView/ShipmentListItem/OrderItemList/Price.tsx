import { useAtomValue } from "jotai";
import React, { useEffect, useState } from "react";
import {
  convertToJPYCurrencyFormatString,
  convertWithTaxPriceToWithOutTaxPrice,
} from "../../../../lib/utility";
import { phItemCacheAtom } from "../../../../store/shipmentList";
import { OrderItem } from "../../../../type/order";

export const Price = ({ item }: { item: OrderItem }) => {
  const phItemCache = useAtomValue(phItemCacheAtom);
  const [price, setPrice] = useState(0);
  useEffect(() => {
    const itemInfo = phItemCache.get(item.itemCodeExt.slice(0, 11));
    if (itemInfo)
      setPrice(
        convertWithTaxPriceToWithOutTaxPrice(itemInfo.price) * item.rate
      );
  }, [item, phItemCache]);
  return <>{convertToJPYCurrencyFormatString(price)}</>;
};
