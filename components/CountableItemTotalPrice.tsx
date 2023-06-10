import { Atom } from "jotai";
import { useAtomValue } from "jotai";
import React, { useEffect, useState } from "react";
import {
  convertToJPYCurrencyFormatString,
  convertWithTaxPriceToWithOutTaxPrice,
} from "../lib/utility";
import { CountableItem, PhItem, WithCountableItem } from "../type";

export function TotalPrice<T extends WithCountableItem>({
  withCountableItems,
  phItemCacheAtom,
}: {
  withCountableItems: T;
  phItemCacheAtom: Atom<Promise<Map<string, PhItem>>>;
}) {
  const phItemCache = useAtomValue(phItemCacheAtom);

  const [totalPrice, setTotalPrice] = useState(0);
  useEffect(() => {
    const withPrice: [CountableItem, number][] = withCountableItems.items.map(
      (item) => {
        const phItem = phItemCache.get(item.itemCodeExt.slice(0, 11));
        return [item, phItem?.price ?? 0];
      }
    );
    const tp = withPrice.reduce(
      (acc, [item, price]) => acc + item.count * price,
      0
    );
    setTotalPrice(convertWithTaxPriceToWithOutTaxPrice(tp));
  }, [withCountableItems, phItemCache]);
  return <>{convertToJPYCurrencyFormatString(totalPrice)}</>;
}
