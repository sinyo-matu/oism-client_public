import { Quantity } from ".";
import { InventoryLocation } from "./inventory";
import { Vendor } from "./shipment";

export interface NewTransferMessage {
  shipmentNo: string;
  note: string;
  transferDate: number;
  shipmentVendor: Vendor;
  toLocation: InventoryLocation;
  items: NewTransferItem[];
}

export interface NewTransferItem {
  itemCodeExt: string;
  quantity: Quantity[];
}

export interface TransferItem {
  itemCodeExt: string;
  count: number;
  location: InventoryLocation;
}

export interface Transfer {
  id: string;
  createAt: number;
  updateAt: number;
  shipmentNo: string;
  shipmentId?: string;
  transferDate: number;
  shipmentVendor: Vendor;
  note: string;
  items: TransferItem[];
}
