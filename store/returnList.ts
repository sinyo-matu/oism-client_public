import dayjs from "dayjs";
import { atom } from "jotai";
import { phItemStore } from "../lib/cache";
import { privateApiCall } from "../lib/utility";
import { PhItem } from "../type";
import { Return } from "../type/return";

export const returnsAtomSignal = atom(0);
export const queryKeywordAtom = atom("");

export const fromDateAtom = atom(
  dayjs().subtract(3, "month").format("YYYY-MM-DD")
);
export const ToDateAtom = atom(dayjs().format("YYYY-MM-DD"));

export const returnIdsAtom = atom(async (get) => {
  const from_str = get(fromDateAtom);
  const to_str = get(ToDateAtom);
  const keyword = get(queryKeywordAtom);

  get(returnsAtomSignal);
  const from = dayjs(from_str).add(1, "hour").unix();
  const to = dayjs(to_str + "23:59:59")
    .add(1, "hour")
    .unix();
  let params = `from=${from}&to=${to}`;
  if (keyword.length !== 0) {
    params = params + `&keyword=${keyword}`;
  }
  let returns;
  try {
    returns = await privateApiCall<Return[]>(`/return?${params}`, "GET");
  } catch (error) {
    console.log(error);
    return [];
  }
  return returns;
});
export const phItemCacheAtom = atom(async (get) => {
  const returns = get(returnIdsAtom);
  const cache: Map<string, PhItem> = new Map();
  let codes = returns
    .map((order) => order.items)
    .flat()
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

export const deleteAlertOpenAtom = atom(false);

export const returnForDelete = atom<Return | undefined>(undefined);
