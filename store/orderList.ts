import dayjs from "dayjs";
import { atom } from "jotai";
import { phItemStore } from "../lib/cache";
import { privateApiCall } from "../lib/utility";
import { PagedResponse, PhItem } from "../type";
import { Order, OrderItem, OrderItemStatus } from "../type/order";

export const ordersAtomSignal = atom(0);

export const orderItemsStatusSignalAtom = atom(["", true]);

export const orderItemsSignal = atom(["", true]);

export const queryKeywordAtom = atom("");

const newSet = new Set([]) as Set<OrderItemStatus>;

export const queryOrderItemStatusAtom = atom<Set<OrderItemStatus>>(newSet);

export const addQueryOrderItemStatusAtom = atom(
  (get) => get(queryOrderItemStatusAtom),
  (get, set, item: OrderItemStatus) => {
    set(queryOrderItemStatusAtom, () => {
      const statusSet = get(queryOrderItemStatusAtom);
      statusSet.add(item);
      return new Set(statusSet);
    });
  }
);

export const deleteQueryOrderItemStatusAtom = atom(
  (get) => get(queryOrderItemStatusAtom),
  (get, set, item: OrderItemStatus) => {
    set(queryOrderItemStatusAtom, () => {
      const statusSet = get(queryOrderItemStatusAtom);
      statusSet.delete(item);
      return new Set(statusSet);
    });
  }
);

export const fromDateAtom = atom(
  dayjs().subtract(3, "month").format("YYYY-MM-DD")
);
export const ToDateAtom = atom(dayjs().format("YYYY-MM-DD"));

export const ordersParamsAtom = atom((get) => {
  get(ordersAtomSignal);
  const keyword = get(queryKeywordAtom);
  const statusSet = get(queryOrderItemStatusAtom);
  const from_str = get(fromDateAtom);
  const to_str = get(ToDateAtom);
  const status = Array.from(statusSet).reduce((sum, status) => {
    if (sum === "") return sum + status;
    return `${sum},${status}`;
  }, "");

  const from = dayjs(from_str).add(1, "hour").unix();
  const to = dayjs(to_str + "23:59:59")
    .add(1, "hour")
    .unix();
  return `keyword=${keyword}&status=${status}&from=${from}&to=${to}`;
});
export const ordersAtom = atom(async (get) => {
  get(ordersAtomSignal);
  const keyword = get(queryKeywordAtom);
  const statusSet = get(queryOrderItemStatusAtom);
  const from_str = get(fromDateAtom);
  const to_str = get(ToDateAtom);
  const status = Array.from(statusSet).reduce((sum, status) => {
    if (sum === "") return sum + status;
    return `${sum},${status}`;
  }, "");
  const from = dayjs(from_str).add(1, "hour").unix();
  const to = dayjs(to_str + "23:59:59")
    .add(1, "hour")
    .unix();
  const params = `keyword=${keyword}&status=${status}&from=${from}&to=${to}`;
  let response;
  try {
    response = await privateApiCall<PagedResponse<Order>>(
      `/orders?${params}`,
      "GET"
    );
  } catch (error) {
    console.log(error);
    return [];
  }
  return response.data;
});

export const phItemCacheAtom = atom(async (get) => {
  const orders = get(ordersAtom);
  const cache: Map<string, PhItem> = new Map();
  let codes = orders
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

export const newOrdersAtom = atom(null, (get, set, action) => {});

export const deleteAlertOpenAtom = atom(false);

export const orderForDelete = atom<Order | undefined>(undefined);

export const concealAlertOpenAtom = atom(false);

export const orderItemForConcealAtom = atom<OrderItem | undefined>(undefined);

export const updateRateOpenAtom = atom(false);

export const orderItemForUpdateAtom = atom<OrderItem>(
  null as unknown as OrderItem
);
