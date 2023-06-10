import dayjs from "dayjs";
import { atom } from "jotai";
import { phItemStore } from "../lib/cache";
import { privateApiCall } from "../lib/utility";
import { PhItem } from "../type";
import { Transfer } from "../type/transfer";

export const transfersAtomSignal = atom(0);
export const queryKeywordAtom = atom("");
export const fromDateAtom = atom(
  dayjs().subtract(3, "month").format("YYYY-MM-DD")
);
export const ToDateAtom = atom(dayjs().format("YYYY-MM-DD"));

export const transferIdsAtom = atom(async (get) => {
  const from_str = get(fromDateAtom);
  const to_str = get(ToDateAtom);
  const keyword = get(queryKeywordAtom);

  get(transfersAtomSignal);
  const from = dayjs(from_str).add(1, "hour").unix();
  const to = dayjs(to_str + "23:59:59")
    .add(1, "hour")
    .unix();
  let params = `from=${from}&to=${to}`;
  if (keyword.length !== 0) {
    params = params + `&keyword=${keyword}`;
  }
  let transfers;
  try {
    transfers = await privateApiCall<Transfer[]>(`/transfer?${params}`, "GET");
  } catch (error) {
    console.log(error);
    return [];
  }
  return transfers;
});

export const phItemCacheAtom = atom(async (get) => {
  const transfers = get(transferIdsAtom);
  const cache: Map<string, PhItem> = new Map();
  let codes = transfers
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

export const returnForDelete = atom<Transfer | undefined>(undefined);

export const updateOpenAtom = atom(false);

export const transferForUpdateAtom = atom<Transfer>(
  null as unknown as Transfer
);
