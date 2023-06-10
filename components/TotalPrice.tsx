import { Atom } from "jotai";
import { useAtomValue } from "jotai";
import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import {
  convertToJPYCurrencyFormatString,
  convertWithTaxPriceToWithOutTaxPrice,
} from "../lib/utility";
import { HaveOrderItems, PhItem } from "../type";

interface Props<T> {
  cacheAtom: Atom<Promise<Map<string, PhItem>>>;
  itemsAtom: Atom<Promise<T[]>>;
}

export const TotalPrice = <T extends HaveOrderItems>({
  cacheAtom,
  itemsAtom,
}: Props<T>) => {
  const { t } = useTranslation();
  const [totalPrice, setTotalPrice] = useState(0);
  const phItemCache = useAtomValue(cacheAtom);
  const orders = useAtomValue(itemsAtom);
  useEffect(() => {
    let totalPrice = 0;
    for (const item of orders
      .map((s) => s.items)
      .flat()
      .filter((item) => item.status !== "concealed")) {
      const phItem = phItemCache.get(item.itemCodeExt.slice(0, 11));
      totalPrice += convertWithTaxPriceToWithOutTaxPrice(
        (phItem?.price ?? 0) * item.rate
      );
    }
    setTotalPrice(totalPrice);
  }, [orders, phItemCache]);

  return (
    <div>
      {t("totalAmount")}:{convertToJPYCurrencyFormatString(totalPrice)}
    </div>
  );
};
