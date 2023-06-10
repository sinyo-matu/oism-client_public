import { atom } from "jotai";
import { privateApiCall } from "../lib/utility";
import { InventoryItem, PagedResponse } from "../type";
import { getEmptyQuantity } from "../type/inventory";

export const suggestionKeywordAtom = atom("");

export const suggestionInputValue = atom("");

export const returnInventorySuggestionSignalAtom = atom(0);
export const inventoryItemParamsAtom = atom((get) => {
  get(returnInventorySuggestionSignalAtom);
  const keyword = get(suggestionKeywordAtom);
  return `keyword=${keyword}&showZeroQuantity=false&location=jp`;
});

export const suggestionsAtom = atom(async (get) => {
  get(returnInventorySuggestionSignalAtom);
  const keyword = get(suggestionKeywordAtom);
  const params = `keyword=${keyword}&showZeroQuantity=false&location=jp`;
  let res;
  try {
    res = await privateApiCall<PagedResponse<InventoryItem>>(
      `/inventory?${params}`,
      "GET"
    );
  } catch (error) {
    console.log(error);
    return [];
  }
  return res.data;
});

export const returnItemsListAtom = atom<Map<string, [InventoryItem, number]>>(
  new Map()
);

export const increaseItemListAtom = atom(
  (get) => get(returnItemsListAtom),
  (get, set, inputItem: [InventoryItem, number]) => {
    set(returnItemsListAtom, () => {
      const [item, price] = inputItem;
      const map = get(returnItemsListAtom);
      let base = map.get(item.itemCodeExt) ?? [
        {
          itemCodeExt: item.itemCodeExt,
          updateAt: item.updateAt,
          createdAt: item.createdAt,
          operationIds: item.operationIds,
          quantity: getEmptyQuantity(),
        },
        price,
      ];
      base[0].quantity[0].quantity += 1;
      map.set(item.itemCodeExt, [...base]);
      return new Map(map);
    });
  }
);

export const decreaseItemListAtom = atom(
  (get) => get(returnItemsListAtom),
  (get, set, item: InventoryItem) => {
    set(returnItemsListAtom, () => {
      const map = get(returnItemsListAtom);
      if (map.has(item.itemCodeExt)) {
        let base = map.get(item.itemCodeExt)!;
        base[0].quantity[0].quantity -= 1;
        if (base[0].quantity[0].quantity === 0) {
          map.delete(item.itemCodeExt);
          return new Map(map);
        }
        map.set(item.itemCodeExt, [...base]);
        return new Map(map);
      }
      return new Map(map);
    });
  }
);

export const clearItemListAtom = atom(
  (get) => get(returnItemsListAtom),
  (get, set, _arg) => {
    set(returnItemsListAtom, () => {
      const map = get(returnItemsListAtom);
      map.clear();
      return new Map(map);
    });
  }
);
