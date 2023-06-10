import { PhItem, Quantity } from ".";
import { InventoryLocation } from "./inventory";


export interface Order {
  id: string;
  createdAt: number;
  updateAt: number;
  orderDatetime: number;
  taobaoOrderNo: string;
  customerId: string;
  note: string;
  items: OrderItem[];
  itemInfos: PhItem[];
}

export interface OrderItem {
  id: string;
  createdAt: number;
  updateAt: number;
  orderDatetime: number;
  itemCodeExt: string;
  customerId: string;
  rate: number;
  location: InventoryLocation;
  status: OrderItemStatus;
  orderId: string;
  note: string;
  shipmentId: string | null;
}

export type OrderItemStatus =
  | "backordering"
  | "guaranteed"
  | "shipped"
  | "concealed";

export interface OrderListMapItem {
  rate: number;
  quantity: Quantity[];
  price?: number;
  isManual?: boolean;
}

export interface OrderRegisterInput {
  taobaoOrderNo: string;
  customerId: string;
  note: string;
  orderDatetime: number;
  items: InputOrderItem[];
}

export interface InputOrderItem {
  itemCodeExt: string;
  rate: number;
  quantity: Quantity[];
  price: number;
}
