import dayjs from "dayjs";
import { atom } from "jotai";
import { phItemStore } from "../lib/cache";
import { privateApiCall } from "../lib/utility";
import { PhItem } from "../type";
import { InventoryLocation } from "../type/inventory";
import { OrderItem } from "../type/order";

export const suggestionKeywordAtom = atom("");

export const suggestionInputValue = atom("");

export const shipmentItemSuggestionSignalAtom = atom(0);

interface ItemSuggestionsQuery {
  keyword: string;
  status: string;
}

export const suggestionsAtom = atom(async (get) => {
  get(shipmentItemSuggestionSignalAtom);
  const keyword = get(suggestionKeywordAtom);
  const params = `keyword=${keyword}&status=guaranteed`;
  let res;
  try {
    res = await privateApiCall<OrderItem[]>(`/order_items?${params}`, "GET");
  } catch (error) {
    console.log(error);
    return [];
  }
  return res;
});

export const shipmentItemListAtom = atom<[OrderItem, number][]>([]);

export const removeShipmentItemListAtom = atom(
  (get) => get(shipmentItemListAtom),
  (get, set, itemId: string) => {
    set(shipmentItemListAtom, () => {
      const shipmentItemList = get(shipmentItemListAtom);
      const i = shipmentItemList.findIndex((v) => v[0].id === itemId);
      if (i !== -1) {
        let temp = shipmentItemList;
        temp.splice(i, 1);
        return [...temp];
      }
      return shipmentItemList;
    });
  }
);

export const shipmentLocationAtom = atom<InventoryLocation | null>(null);

export const shipmentDatetimeAtom = atom(dayjs().format("YYYY-MM-DD"));

export const shipmentNoteAtom = atom("");

export const phItemCacheAtom = atom(async (get) => {
  const suggestionItems = get(suggestionsAtom);
  const cache: Map<string, PhItem> = new Map();
  let codes = suggestionItems
    .filter(
      (v, i, a) =>
        a.findIndex(
          (t) => t.itemCodeExt.slice(0, 11) === v.itemCodeExt.slice(0, 11)
        ) === i
    )
    .map((item) => item.itemCodeExt.slice(0, 11));
  const items = await phItemStore.get(codes);
  for (const item of items) {
    cache.set(item.code, item);
  }
  return cache;
});
