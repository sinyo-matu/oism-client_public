import { PhItem, Quantity } from ".";

export interface NewReturnInput {
  returnNo: string;
  note: string;
  returnDate: number;
  items: NewReturnInputItem[];
}

export interface NewReturnInputItem {
  itemCodeExt: string;
  quantity: Quantity[];
}

export interface ReturnItem {
  itemCodeExt: string;
  count: number;
}

export interface Return {
  id: string;
  createdAt: number;
  updateAt: number;
  returnNo: string;
  returnDate: number;
  Note: string;
  items: ReturnItem[];
}
