import { useAtomValue } from "jotai";
import { useTranslation } from "next-i18next";
import React, { useEffect, useMemo, useState } from "react";
import {
  convertToJPYCurrencyFormatString,
  convertWithTaxPriceToWithOutTaxPrice,
} from "../../../lib/utility";
import {
  inventoryItemsAtom,
  phItemCacheAtom,
  queryLocationAtom,
} from "../../../store/inventory";

export const TotalCount = () => {
  const { t } = useTranslation(["common", "inventory"]);
  const inventoryItems = useAtomValue(inventoryItemsAtom);
  const queryLocation = useAtomValue(queryLocationAtom);
  const [totalPrice, setTotalPrice] = useState(0);
  const phItemCache = useAtomValue(phItemCacheAtom);
  const totalCount = useMemo(
    () =>
      inventoryItems.reduce(
        (total, current) =>
          (total += current.quantity
            .filter((q) => {
              if (!queryLocation) return true;
              return q.location === queryLocation;
            })
            .reduce((stotal, scurrent) => (stotal += scurrent.quantity), 0)),
        0
      ),
    [inventoryItems, queryLocation]
  );
  useEffect(() => {
    let totalPrice = 0;
    for (const item of inventoryItems) {
      const phItem = phItemCache.get(item.itemCodeExt.slice(0, 11));
      const perItemPrice = item.quantity
        .filter((q) => {
          if (!queryLocation) return true;
          return q.location === queryLocation;
        })
        .reduce(
          (totalPrice, current) =>
            (totalPrice +=
              convertWithTaxPriceToWithOutTaxPrice(phItem?.price ?? 0) *
              current.quantity),
          0
        );
      totalPrice += perItemPrice;
    }
    setTotalPrice(totalPrice);
  }, [inventoryItems, phItemCache, queryLocation]);

  return (
    <div>
      {t("total")}{" "}
      {queryLocation
        ? t(`location.${queryLocation}`, { ns: "inventory" })
        : null}{" "}
      {totalCount}点 {convertToJPYCurrencyFormatString(totalPrice)}
    </div>
  );
};
