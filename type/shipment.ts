import { OrderItem } from "./order";

export interface NewShipmentInput {
  shipmentNo: string;
  note: string;
  vendor: Vendor;
  shipmentDate: number;
  itemIds: string[];
}
export const vendors = [
  "yy",
  "ss",
  "bc",
  "sd",
  "ems",
  "sj",
  "ml",
  "pml",
] as const;

export type Vendor = typeof vendors[number];

const clearanceVendors = ["sj"] as const;

export type ClearanceVendor = typeof clearanceVendors[number];
export const ACHIEVED_VENDORS: Vendor[] = ["sd"];
export function isClearanceVendor(
  v: Vendor | ClearanceVendor
): v is ClearanceVendor {
  return clearanceVendors.includes(v as ClearanceVendor);
}

export type ShipmentStatus = "ongoing" | "arrival";

export interface Shipment {
  id: string;
  createdAt: number;
  updateAt: number;
  shipmentNo: string;
  note: string;
  vendor: Vendor;
  shipmentDate: number;
  items: OrderItem[];
  status: ShipmentStatus;
}

export interface ShipmentLite {
  id: string;
  createdAt: number;
  updateAt: number;
  shipmentNo: string;
  note: string;
  vendor: Vendor;
  shipmentDate: number;
  order_item_ids: string[];
  status: ShipmentStatus;
}

export interface DownloadUrl {
  filename: string;
  url: string;
}
