import { atom } from "jotai";
import { phItemStore } from "../lib/cache";
import { privateApiCall } from "../lib/utility";
import { InventoryItem, PagedResponse, PhItem } from "../type";
import { InventoryLocation } from "../type/inventory";

export const queryKeyWordAtom = atom("");

export const queryCategoryAtom = atom("");

export const queryLocationAtom = atom<InventoryLocation | null>(null);

export const queryShowZeroQuantityAtom = atom(false);

export const inventoryItemSignal = atom(0);

export const inventoryParamsAtom = atom((get) => {
  get(inventoryItemSignal);
  const keyword = get(queryKeyWordAtom);
  const location = get(queryLocationAtom);
  const category = get(queryCategoryAtom);
  const showZeroQuantity = get(queryShowZeroQuantityAtom);
  let query = `keyword=${keyword}&showZeroQuantity=${showZeroQuantity}`;
  if (location) query += `&location=${location}`;
  if (category) query += `&category=${category}`;
  return query;
});

export const inventoryItemsAtom = atom(async (get) => {
  get(inventoryItemSignal);
  const keyword = get(queryKeyWordAtom);
  const location = get(queryLocationAtom);
  const category = get(queryCategoryAtom);
  const showZeroQuantity = get(queryShowZeroQuantityAtom);
  let query = `keyword=${keyword}&showZeroQuantity=${showZeroQuantity}`;
  if (location) query += `&location=${location}`;
  if (category) query += `&category=${category}`;
  let res;
  try {
    res = await privateApiCall<PagedResponse<InventoryItem>>(
      `/inventory?${query}`,
      "GET"
    );
  } catch (error) {
    console.log(error);
    return [];
  }
  return res.data;
});

export const phItemCacheAtom = atom(async (get) => {
  const returns = get(inventoryItemsAtom);
  const cache: Map<string, PhItem> = new Map();
  let codes = returns
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

export const inventoryListScrollTopAtom = atom(0);

export const showHeaderAtom = atom((get) => {
  const scroll = get(inventoryListScrollTopAtom);
  if (scroll > 0) return true;
  return false;
});

export const showQuantityMoveAtom = atom(false);

export const forMoveItemAtom = atom<InventoryItem | undefined>(undefined);

export const showInventoryItemDetailAtom = atom(false);

export const forDetailItemAtom = atom<InventoryItem | undefined>(undefined);

export const showExportModalAtom = atom(false);

export const locationForExport = atom<InventoryLocation>(InventoryLocation.JP);
