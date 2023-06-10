import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { atom } from "jotai";
import { phItemStore } from "../lib/cache";
import { privateApiCall } from "../lib/utility";
import { OrderListMapArg, PhItem, Quantity } from "../type";
import { getEmptyQuantity, inventoryLocations } from "../type/inventory";
import { OrderListMapItem } from "../type/order";
dayjs.extend(utc);
dayjs.extend(timezone);

export const suggestionKeywordAtom = atom("");

export const suggestionInputValue = atom("");

export const suggestionsAtom = atom(async (get) => {
  const keyword = get(suggestionKeywordAtom);
  if (keyword === "") return [];
  const response = await fetch(
    `https://phdb.one/phitem_api/v1/public/ph_item?keyword=${keyword}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept-Encoding": "gzip,deflate,br",
      },
    }
  ).catch((err) => {
    console.log(err);
  });
  if (!response) return [];
  const res: PhItem[] = await response.json();
  if (!res) return [];

  return res;
});

export const itemCodeAtom = atom("");

export const itemAtom = atom(async (get) => {
  const code = get(itemCodeAtom);
  if (code === "") return undefined;
  const item = await phItemStore.get([code]);
  return item[0];
});

export const sizeNoAtom = atom("9");

export const colorNoAtom = atom("3");

export const itemCodeExtAtom = atom((get) => {
  const colorNo = get(colorNoAtom);
  const sizeNo = get(sizeNoAtom);
  const item = get(itemAtom);

  return `${item!.code}${sizeNo}${colorNo}`;
});

export const itemIsInStockSignalAtom = atom(0);

export interface FindOneInventoryCode {
  itemCodeExt: string;
}

export const itemIsInStockAtom = atom(async (get) => {
  get(itemIsInStockSignalAtom);
  const size = get(sizeNoAtom);
  const color = get(colorNoAtom);
  const itemCode = get(itemCodeAtom);
  let res;
  try {
    res = await privateApiCall<Quantity[]>(
      `/inventory/quantity/${itemCode}${size}${color}`,
      "GET"
    );
  } catch (error) {
    console.log(error);
    return [];
  }
  if (res.length === 0) {
    return getEmptyQuantity();
  }
  return res;
});

export const orderItemListAtom = atom<Map<string, OrderListMapItem>>(new Map());

interface ChangeItemRateArg {
  itemCodeExt: string;
  rate: number;
}

export const changeItemRateAtom = atom(
  (get) => get(orderItemListAtom),
  (get, set, arg: ChangeItemRateArg) => {
    set(orderItemListAtom, () => {
      const map = get(orderItemListAtom);
      let base = map.get(arg.itemCodeExt)!;
      base.rate = arg.rate;
      map.set(arg.itemCodeExt, { ...base });
      return new Map(map);
    });
  }
);

export const increaseItemListAtom = atom(
  (get) => get(orderItemListAtom),
  (get, set, item: OrderListMapArg) => {
    set(orderItemListAtom, () => {
      const map = get(orderItemListAtom);
      let base = map.get(item.itemCodeExt) ?? {
        rate: 1.0,
        quantity: getEmptyQuantity(),
        price: item.price,
        isManual: item.isManual,
      };
      base.quantity.forEach((q) => {
        if (q.location === item.location) {
          q.quantity += item.count;
        }
      });
      map.set(item.itemCodeExt, { ...base });
      return new Map(map);
    });
  }
);

export const decreaseItemListAtom = atom(
  (get) => get(orderItemListAtom),
  (get, set, item: OrderListMapArg) => {
    set(orderItemListAtom, () => {
      const map = get(orderItemListAtom);
      if (map.has(item.itemCodeExt)) {
        let base = map.get(item.itemCodeExt)!;
        base.quantity.forEach((q) => {
          if (q.location === item.location) {
            if (q.quantity - item.count < 0) return;
            q.quantity -= item.count;
          }
        });
        map.set(item.itemCodeExt, { ...base });
        return new Map(map);
      }
      return new Map(map);
    });
  }
);
// this derive function not need the location arg
export const deleteItemListAtom = atom(
  (get) => get(orderItemListAtom),
  (get, set, item: OrderListMapArg) => {
    set(orderItemListAtom, () => {
      const map = get(orderItemListAtom);
      if (map.has(item.itemCodeExt)) {
        map.delete(item.itemCodeExt);
        return new Map(map);
      }
      return new Map(map);
    });
  }
);

export const clearItemListAtom = atom(
  (get) => get(orderItemListAtom),
  (get, set, _arg) => {
    set(orderItemListAtom, () => {
      const map = get(orderItemListAtom);
      map.clear();
      return new Map(map);
    });
  }
);

export const infoItemInStockAtom = atom((get) => {
  const itemCodeExt = get(itemCodeExtAtom);
  const orderItemList = get(orderItemListAtom);

  const inOrderQuantity = orderItemList.get(itemCodeExt);
  const changed = inOrderQuantity?.quantity.map((q) => ({
    location: q.location,
    quantity: q.quantity + 1,
  }));

  return [
    ...(changed ?? [
      ...inventoryLocations.map((location) => {
        return { location, quantity: 1 };
      }),
    ]),
  ];
});

export const isManualInputAtom = atom(false);

export const orderDatetimeAtom = atom(dayjs().utc());

export const orderNoteAtom = atom("");
