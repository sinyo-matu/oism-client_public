import dayjs from "dayjs";
import { atom } from "jotai";
import { phItemStore } from "../lib/cache";
import { privateApiCall } from "../lib/utility";
import { PagedResponse, PhItem, Register } from "../type";

export const registersAtomSignal = atom(0);

export const queryKeywordAtom = atom("");

export const fromDateAtom = atom(
  dayjs().subtract(3, "month").format("YYYY-MM-DD")
);
export const ToDateAtom = atom(dayjs().format("YYYY-MM-DD"));
export const registersParamsAtom = atom((get) => {
  get(registersAtomSignal);
  const from_str = get(fromDateAtom);
  const to_str = get(ToDateAtom);
  const keyword = get(queryKeywordAtom);

  const from = dayjs(from_str).add(1, "hour").unix();
  const to = dayjs(to_str + "23:59:59")
    .add(1, "hour")
    .unix();
  let params = `from=${from}&to=${to}`;
  if (keyword.length !== 0) {
    params = params + `&keyword=${keyword}`;
  }
  return params;
});

export const registersAtom = atom(async (get) => {
  get(registersAtomSignal);
  const from_str = get(fromDateAtom);
  const to_str = get(ToDateAtom);
  const keyword = get(queryKeywordAtom);

  const from = dayjs(from_str).add(1, "hour").unix();
  const to = dayjs(to_str + "23:59:59")
    .add(1, "hour")
    .unix();
  let params = `from=${from}&to=${to}`;
  if (keyword.length !== 0) {
    params = params + `&keyword=${keyword}`;
  }
  let registers;
  try {
    registers = await privateApiCall<PagedResponse<Register>>(
      `/registers?${params}`,
      "GET"
    );
  } catch (error) {
    console.log(error);
    return [];
  }
  return registers.data;
});

export const phItemCacheAtom = atom(async (get) => {
  const registers = get(registersAtom);
  const cache: Map<string, PhItem> = new Map();
  let codes = registers
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

export const registerForDelete = atom<Register | undefined>(undefined);
