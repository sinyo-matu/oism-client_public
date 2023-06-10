import dayjs from "dayjs";
import { atom } from "jotai";
import { privateApiCall } from "../lib/utility";
import { InventoryItem, PagedResponse } from "../type";
import { InventoryLocation } from "../type/inventory";
import { isClearanceVendor, Vendor } from "../type/shipment";

export const suggestionKeywordAtom = atom("");

export const suggestionInputValue = atom("");

export const fromLocationAtom = atom<InventoryLocation>(InventoryLocation.JP);

export const vendorAtom = atom<Vendor>("yy");

export const toLocationAtom = atom<InventoryLocation>((get) => {
  const fromLocation = get(fromLocationAtom);
  const vendor = get(vendorAtom);
  switch (fromLocation) {
    case InventoryLocation.JP:
      if (isClearanceVendor(vendor)) {
        return InventoryLocation.PCN;
      }
      return InventoryLocation.CN;
    case InventoryLocation.CN:
      return InventoryLocation.JP;
    case InventoryLocation.PCN:
      return InventoryLocation.JP;
  }
});

export const transferInventorySuggestionSignalAtom = atom(0);

export const inventoryItemParamsAtom = atom((get) => {
  get(transferInventorySuggestionSignalAtom);
  const location = get(fromLocationAtom);
  const keyword = get(suggestionKeywordAtom);
  return `keyword=${keyword}&showZeroQuantity=false&location=${location}`;
});

export const suggestionsAtom = atom(async (get) => {
  get(transferInventorySuggestionSignalAtom);
  const location = get(fromLocationAtom);
  const keyword = get(suggestionKeywordAtom);
  const params = `keyword=${keyword}&showZeroQuantity=false&location=${location}`;
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

export const transferListAtom = atom<Map<string, [InventoryItem, number]>>(
  new Map()
);

export const increaseItemListAtom = atom(
  (get) => get(transferListAtom),
  (get, set, item: InventoryItem) => {
    set(transferListAtom, () => {
      const map = get(transferListAtom);
      const fromLocation = get(fromLocationAtom);
      const toLocation = get(toLocationAtom);
      let [base, cq] = map.get(item.itemCodeExt) ?? [item, 0];
      const fromIndex = base.quantity.findIndex(
        (v) => v.location === fromLocation
      );
      const toIndex = base.quantity.findIndex((v) => v.location === toLocation);
      base.quantity[fromIndex].quantity -= 1;
      base.quantity[toIndex].quantity += 1;
      map.set(item.itemCodeExt, [{ ...base }, cq + 1]);
      return new Map(map);
    });
  }
);

export const decreaseItemListAtom = atom(
  (get) => get(transferListAtom),
  (get, set, item: InventoryItem) => {
    set(transferListAtom, () => {
      const fromLocation = get(fromLocationAtom);
      const toLocation = get(toLocationAtom);
      const map = get(transferListAtom);
      if (map.has(item.itemCodeExt)) {
        let [base, cq] = map.get(item.itemCodeExt)!;
        const fromIndex = base.quantity.findIndex(
          (v) => v.location === fromLocation
        );
        const toIndex = base.quantity.findIndex(
          (v) => v.location === toLocation
        );
        base.quantity[fromIndex].quantity += 1;
        base.quantity[toIndex].quantity -= 1;
        cq = cq - 1;
        if (cq === 0) {
          map.delete(item.itemCodeExt);
          return new Map(map);
        }
        map.set(item.itemCodeExt, [{ ...base }, cq]);
        return new Map(map);
      }
      return new Map(map);
    });
  }
);

export const clearItemListAtom = atom(
  (get) => get(transferListAtom),
  (get, set, _arg) => {
    set(transferListAtom, () => {
      const map = get(transferListAtom);
      map.clear();
      return new Map(map);
    });
  }
);

export function getToLocation(from: InventoryLocation, vendor: Vendor) {
  switch (from) {
    case InventoryLocation.JP:
      if (isClearanceVendor(vendor)) {
        return InventoryLocation.PCN;
      }
      return InventoryLocation.CN;
    case InventoryLocation.CN:
      return InventoryLocation.JP;
    case InventoryLocation.JP:
      return InventoryLocation.CN;
  }
}

export const shipmentNoAtom = atom("");

export const transferDatetimeAtom = atom(dayjs().format("YYYY-MM-DD"));

export const transferNoteAtom = atom("");
