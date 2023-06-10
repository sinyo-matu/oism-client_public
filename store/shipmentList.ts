import dayjs from "dayjs";
import { atom } from "jotai";
import { phItemStore } from "../lib/cache";
import { privateApiCall } from "../lib/utility";
import { PagedResponse, PhItem } from "../type";
import { Shipment, ShipmentStatus, Vendor } from "../type/shipment";

export const shipmentsAtomSignal = atom(0);

export const queryKeywordAtom = atom("");

export const fromDateAtom = atom(
  dayjs().subtract(3, "month").format("YYYY-MM-DD")
);
export const ToDateAtom = atom(dayjs().format("YYYY-MM-DD"));

export const shipmentStatusAtom = atom<ShipmentStatus | "">("");

export const shipmentVendorAtom = atom<Vendor | "">("");

export const shipmentStatusSignalAtom = atom<[string, boolean]>(["", true]);

export interface QueryShipmentsMessage {
  keyword: string;
  showComplete: boolean;
  from: Date;
  to: Date;
  status: string;
  vendor: string;
}

export const shipmentParamsAtom = atom((get) => {
  const keyword = get(queryKeywordAtom);
  const status = get(shipmentStatusAtom);
  const vendor = get(shipmentVendorAtom);
  const from_str = get(fromDateAtom);
  const to_str = get(ToDateAtom);

  get(shipmentsAtomSignal);
  const from = dayjs(from_str).unix();
  const to = dayjs(to_str + "23:59:59").unix();
  return `keyword=${keyword}&status=${status}&vendor=${vendor}&from=${from}&to=${to}`;
});

export const shipmentsAtom = atom(async (get) => {
  const keyword = get(queryKeywordAtom);
  const status = get(shipmentStatusAtom);
  const vendor = get(shipmentVendorAtom);
  const from_str = get(fromDateAtom);
  const to_str = get(ToDateAtom);

  get(shipmentsAtomSignal);
  const from = dayjs(from_str).unix();
  const to = dayjs(to_str + "23:59:59").unix();
  const params = `keyword=${keyword}&status=${status}&vendor=${vendor}&from=${from}&to=${to}`;
  let shipments;
  try {
    shipments = await privateApiCall<PagedResponse<Shipment>>(
      `/shipment?${params}`,
      "GET"
    );
  } catch (error) {
    console.log(error);
    return [];
  }
  return shipments.data;
});
export const phItemCacheAtom = atom(async (get) => {
  const shipments = get(shipmentsAtom);
  const cache: Map<string, PhItem> = new Map();
  let codes = shipments
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

export const shipmentForDelete = atom<Shipment | undefined>(undefined);

export const exportOpenAtom = atom(false);

export const shipmentForExport = atom<[Shipment | undefined, boolean]>([
  undefined,
  false,
]);

export const exportByIdsModalOpenAtom = atom(false);

export const changeStatusAlertOpenAtom = atom(false);

export const shipmentForChange = atom<Shipment | undefined>(undefined);

export const updateOpenAtom = atom(false);

export const shipmentForUpdateAtom = atom<Shipment>(
  null as unknown as Shipment
);
