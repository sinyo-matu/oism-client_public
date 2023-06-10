import { InventoryLocation } from "./inventory";

export interface InventoryOperation {
  id: string;
  time: number;
  itemCodeExt: string;
  itemCode: string;
  operationType: OperationType;
  relatedId: string;
  count: number;
  location: InventoryLocation;
}

export interface OperationType {
  type:
    | "createEmpty"
    | "arrival"
    | "returned"
    | "deleteReturn"
    | "concealOrderItem"
    | "deleteRegister"
    | "deleteOrder"
    | "deleteTransfer"
    | "ordered"
    | "move";
}
