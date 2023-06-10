import { atom } from "jotai";
import { PhItem, PhItemDetail, StockRegisterStockItem } from "../type";
import { atomWithStorage } from "jotai/utils";
import { phItemStore } from "../lib/cache";
import { parseItemPriceFromDetailCode } from "../lib/utility";

export const currentItemCodeAtom = atom<string>("");

export const currentItemAtom = atom(async (get) => {
  const code = get(currentItemCodeAtom);
  if (code === "") return undefined;
  const item = await phItemStore.getOne(code);
  if (!item) {
    let dummy: PhItem = {
      code,
      itemName: "",
      createdAt: null,
      madeIn: null,
      price: 0,
      size: null,
    };
    return dummy;
  }
  localStorage.setItem("item", JSON.stringify(item));
  return item;
});

export const currentItemDetailCodeAtom = atom<string>("");

export const currentItemDetailAtom = atom<PhItemDetail | undefined>((get) => {
  const code = get(currentItemDetailCodeAtom);
  if (code === "") return undefined;
  const size = parseInt(code.charAt(0));
  const color = parseInt(code.charAt(3));
  const price = parseItemPriceFromDetailCode(code);
  return { size, color, price };
});

export const previousItemAtom = atomWithStorage<PhItem | undefined>(
  "item",
  undefined
);
export const previousItemDetailAtom = atomWithStorage<PhItemDetail | undefined>(
  "itemDetail",
  undefined
);

export const itemAtom = atom((get) => {
  const current = get(currentItemAtom);
  const previous = get(previousItemAtom);
  return current || previous;
});

export const itemDetailAtom = atom((get) => {
  const current = get(currentItemDetailAtom);
  const previous = get(previousItemDetailAtom);

  return current || previous;
});

export const StockRegisterStockItemListAtom = atom<
  Map<string, StockRegisterStockItem>
>(new Map());

export const increaseItemListAtom = atom(
  (get) => get(StockRegisterStockItemListAtom),
  (get, set, item: StockRegisterStockItem) => {
    set(StockRegisterStockItemListAtom, () => {
      const map = get(StockRegisterStockItemListAtom);
      let base = map.get(item.itemCodeExt) ?? {
        itemCodeExt: item.itemCodeExt,
        itemName: item.itemName,
        count: 0,
        price: item.price,
        isManual: item.isManual,
      };
      base.count += 1;
      map.set(item.itemCodeExt, { ...base });
      return new Map(map);
    });
  }
);

export const decreaseItemListAtom = atom(
  (get) => get(StockRegisterStockItemListAtom),
  (get, set, item: StockRegisterStockItem) => {
    set(StockRegisterStockItemListAtom, () => {
      const map = get(StockRegisterStockItemListAtom);
      if (map.has(item.itemCodeExt)) {
        let base = map.get(item.itemCodeExt)!;
        base.count -= 1;
        if (base.count === 0) {
          map.delete(item.itemCodeExt);
          return new Map(map);
        }
        map.set(item.itemCodeExt, { ...base });
        return new Map(map);
      }
      return new Map(map);
    });
  }
);

export const clearItemListAtom = atom(
  (get) => get(StockRegisterStockItemListAtom),
  (get, set, _arg) => {
    set(StockRegisterStockItemListAtom, () => {
      const map = get(StockRegisterStockItemListAtom);
      map.clear();
      return new Map(map);
    });
  }
);

export const isManualInputAtom = atom(false);
