import { useAtom } from "jotai";
import { useAtomValue, useSetAtom } from "jotai";
import React from "react";
import {
  colorNoAtom,
  increaseItemListAtom,
  itemIsInStockAtom,
  sizeNoAtom,
  suggestionInputValue,
} from "../../../../store/newOrder";
import { PhItem } from "../../../../type";
import { InventoryLocation } from "../../../../type/inventory";
import { ButtonCompo } from "../../../ButtonCompo";

export const SubmitButton = ({ item }: { item: PhItem }) => {
  const [colorNo] = useAtom(colorNoAtom);
  const [sizeNo] = useAtom(sizeNoAtom);
  const [, increaseItemList] = useAtom(increaseItemListAtom);
  const setCodeInputValue = useSetAtom(suggestionInputValue);
  const isInStock = useAtomValue(itemIsInStockAtom);
  const handleOnClick = () => {
    const inStock = isInStock
      .map((i) => ({ location: i.location, quantity: i.quantity }))
      .reverse()
      .find((q) => q.quantity !== 0);
    setCodeInputValue("");
    increaseItemList({
      itemCodeExt: `${item.code}${sizeNo}${colorNo}`,
      count: 1,
      location: inStock ? inStock.location : InventoryLocation.JP,
      price: item.price,
      isManual: false,
    });
  };
  return (
    <ButtonCompo fontSize="1rem" onClick={handleOnClick}>
      注文に登録する
    </ButtonCompo>
  );
};
