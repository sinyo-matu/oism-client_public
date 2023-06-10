import { InventoryLocation } from "./inventory";
import { OrderItem } from "./order";

export interface PagedResponse<D> {
  data: D[];
  hasNext: boolean;
  next: number;
}
export interface PhItem {
  code: string;
  itemName: string | null;
  createdAt: Date | null | string;
  madeIn: string | null;
  size: ItemSize | null;
  price: number;
}

export interface ItemSize {
  size_table: SizeTable | null;
  size_description: string | null;
  size_zh: string;
}

export interface SizeTable {
  head: string[];
  body: string[][];
}

export interface PhItemDetail {
  size: number;
  color: number;
  price: number;
}

export interface StockRegisterStockItem {
  itemCodeExt: string;
  itemName: string;
  count: number;
  price?: number;
  isManual?: boolean;
}

export interface OrderListMapArg {
  itemCodeExt: string;
  count: number;
  location: InventoryLocation;
  price?: number;
  isManual?: boolean;
}

export interface RegisterItem {
  itemCodeExt: string;
  count: number;
}

export interface Register {
  id: string;
  createdAt: number;
  arrivalDate: number;
  no: string;
  items: RegisterItem[];
  itemInfos: PhItem[];
}

export interface StockRegisterInput {
  arrivalDate: number;
  no: string;
  items: RegisterItem[];
}

export interface InventoryItem {
  itemCodeExt: string;
  quantity: Quantity[];
  createdAt: number;
  updateAt: number;
  operationIds: string[];
}

export interface CountableItem {
  itemCodeExt: string;
  count: number;
}
export interface WithCountableItem {
  items: CountableItem[];
}

export interface HaveOrderItems {
  items: OrderItem[];
}

export interface Quantity {
  location: InventoryLocation;
  quantity: number;
}

export interface InventoryQuery {
  keyword: string;
  category: string;
  showZeroQuantity: boolean;
  location?: InventoryLocation;
}

export interface WsMsg {
  event: WS_MSG_EVENT;
  message: string;
}

export type WS_MSG_EVENT =
  | "ping"
  | "pong"
  | "refreshOrderList"
  | "refreshOrderItem"
  | "refreshInventory"
  | "refreshRegisterList"
  | "refreshReturnList"
  | "refreshShipmentList"
  | "refreshShipmentItem"
  | "refreshTransferList"
  | "refreshInventoryItemQuantity"
  | "refreshNewShipmentBucket"
  | "refreshWaitForShipmentItemList";
