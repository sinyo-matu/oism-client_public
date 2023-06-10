import dayjs from "dayjs";
import React from "react";
import { toast } from "react-toastify";
import { customBounce } from "../styles/animation";
import { InventoryOperation, OperationType } from "../type/invenope";
import Router from "next/router";
import { InventoryLocation } from "../type/inventory";
import { OrderItemStatus } from "../type/order";
import { DownloadUrl, ShipmentStatus } from "../type/shipment";
import { ReadyState } from "react-use-websocket";
import { AppError } from "../type/error";
import { Color, Paid } from "../styles/Color";

const BASE_URL = process.env.NEXT_PUBLIC_API_HOST;
const WS_BASE = process.env.NEXT_PUBLIC_WS_API_HOST;
const JP_OFFSET = 32400;
export const WS_URL = `${WS_BASE}/api/v1/private/control`;
export const PRIVATE_URL = `${BASE_URL}/api/v1/private`;
export const PUBLIC_URL = `${BASE_URL}/api/v1/public`;
export const WS_HEARTBEAT_INTERVAL = 5000;
type HTTP_METHOD = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
export const isBrowser = typeof window !== "undefined";
export async function privateApiCall<T>(
  endpoint: string,
  method: HTTP_METHOD,
  body?: string,
  controller?: AbortController
): Promise<T> {
  const response = await fetch(`${PRIVATE_URL}${endpoint}`, {
    method,
    body: body === "" ? null : body,
    credentials: "same-origin",
    signal: controller?.signal,
    headers: {
      "Content-Type": "application/json",
      "Accept-Encoding": "gzip,deflate,br",
    },
  });
  if (response.status === 401) {
    Router.push("/login");
    return Promise.reject(AppError.NotAuthorization);
  }
  if (response.status === 403) {
    return Promise.reject(AppError.PermissionNotEnough);
  }
  if (response.status === 404) {
    return Promise.reject(AppError.NotFound);
  }
  if (response.status >= 500) {
    return Promise.reject(new Error("Internal server error"));
  }
  if (response.status >= 400) {
    if (response.body) {
      const body = await response.text();
      if (body === "InvalidOperation") {
        return Promise.reject(AppError.InvalidOperation);
      }
      return Promise.reject(new Error(body));
    }
    return Promise.reject(new Error("unknown bad request error"));
  }
  const contentTypeHeader = response.headers.get("Content-type");
  if (contentTypeHeader && contentTypeHeader === "application/json") {
    try {
      const resBody: T = await response.json();
      return resBody;
    } catch (err) {
      console.log(err);
      return Promise.reject(err);
    }
  }
  if (response.status >= 200) {
    return Promise.resolve(null as unknown as T);
  }
  return Promise.reject(Error("unknown error"));
}

export async function publicApiCall(
  endpoint: string,
  method: HTTP_METHOD,
  body?: string
) {
  if (isBrowser) {
    const response = await fetch(`${PUBLIC_URL}${endpoint}`, {
      method,
      body,
      redirect: "follow",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        "Accept-Encoding": "gzip,deflate,br",
      },
    });
    if (response.status === 401) {
      Router.push("/login");
      return;
    }
    if (response.status === 404) {
      return;
    }
    if (response.status >= 500) {
      return Promise.reject(new Error("Internal server error"));
    }
    if (response.status >= 400) {
      if (response.body) {
        const body = await response.text();
        return Promise.reject(new Error(body));
      }
      return Promise.reject(new Error("unknown bad request error"));
    }
    return response;
  }
}

const TAX_RATE = 1.1;
export const convertWithTaxPriceToWithOutTaxPrice = (withTaxPrice: number) =>
  Math.round(withTaxPrice / TAX_RATE);
export const convertToJPYCurrencyFormatString = (number: number) => {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    minimumFractionDigits: 0,
  }).format(Math.round(number));
};

export function parseItemCode(itemCodeExt?: string) {
  if (!itemCodeExt) return ["", "", ""];
  const color = itemCodeExt[itemCodeExt.length - 1];
  const size = itemCodeExt[itemCodeExt.length - 2];
  const itemCode = itemCodeExt.substring(0, 11);
  return [itemCode, size, color];
}

export const CATEGORIES = [
  "top",
  "skirt",
  "onepiece",
  "outer",
  "pants",
  "bag",
  "shoes",
  "accessory",
  "hat",
  "others",
];

export function validationItemCodeInput(input: string) {
  if (input.length !== 11) return false;
  if (!(input.startsWith("A21") || input.startsWith("A23"))) return false;
  return true;
}

export function validationDetailInput(input: string) {
  if (input[1] !== "_") return false;
  if (input.length !== 11) return false;
  if (
    isNaN(parseInt(input.charAt(0))) ||
    isNaN(parseInt(input.charAt(3))) ||
    isNaN(parseInt(input.substring(4))) //code scanner regularly return NaN input
  )
    return false;
  return true;
}

export function isValidTaobaoOrderNo(input: string) {
  const num = parseInt(input);
  if (isNaN(num)) return false;
  const date = dayjs(input.slice(0, 9));
  if (!date.isValid()) return false;
  if (input.length !== 28) return false;
  return true;
}

export function validateSizeColorNoInput(input: string) {
  const parsed = parseInt(input);
  if (isNaN(parsed)) return false;
  if (parsed > 9) return false;
  if (parsed <= 0) return false;
  return true;
}

export function validatePriceInput(input: string) {
  const parsed = parseInt(input);
  if (isNaN(parsed)) return false;
  if (parsed <= 0) return false;
  return true;
}

export function stringifyDateData(d: Date | number) {
  let date;
  switch (typeof d) {
    case "number":
      date = dayjs.unix(d);
      break;
    case "object":
      date = dayjs(new Date(d));
      break;
  }
  const year = date.year();
  const month = ("00" + (date.month() + 1)).slice(-2);
  const day = ("00" + date.date()).slice(-2);
  const hour = date.hour();
  const mins = ("00" + date.minute()).slice(-2);
  return `${year}/${month}/${day} ${hour}:${mins}`;
}

/**
 * this function will always return the YY/MM/DD string what represents ja timezone data
 * @param d time object should be Date or unix timestamp(seconds)
 * @returns ja timezone YY/MM/DD formatted string
 */
export function stringifyDateDataToDate(d: Date | number | undefined) {
  let now = new Date();
  let offsetFromJP = now.getTimezoneOffset() * 60 + JP_OFFSET;
  if (!d) return "";
  let date;
  switch (typeof d) {
    case "number":
      date = dayjs.unix(d + offsetFromJP).toDate();
      break;
    case "object":
      date = new Date(d);
      break;
  }
  const year = date.getFullYear();
  const month = ("00" + (date.getMonth() + 1)).slice(-2);
  const day = ("00" + date.getDate()).slice(-2);
  return `${year}/${month}/${day}`;
}

export function stringifyDateDataToMonthDay(d: Date | number | undefined) {
  if (!d) return "";
  let date;
  switch (typeof d) {
    case "number":
      date = dayjs.unix(d).toDate();
      break;
    case "object":
      date = new Date(d);
      break;
  }
  const month = ("00" + (date.getMonth() + 1)).slice(-2);
  const day = ("00" + date.getDate()).slice(-2);
  return `${month}/${day}`;
}

export function convertUnixTimestampToDate(unixTimestamp: number) {
  return dayjs.unix(unixTimestamp).toDate();
}
export const getRandomStr = (length = 8) => {
  // Declare all characters
  let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  // Pick characters randomly
  let str = "";
  for (let i = 0; i < length; i++) {
    str += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return str;
};

export function stringifyOrderItemRate(rate: number) {
  if (rate === 1) return "なし";
  return `【${rate * 10}折】`;
}

export function processInventoryOperationCount(
  operation: InventoryOperation,
  operations: InventoryOperation[]
) {
  let locationCount: { [location: string]: number } = {};
  for (let location of Object.values(InventoryLocation)) {
    locationCount[location] = 0;
  }
  for (let o of operations.reverse()) {
    if (o.location in locationCount) {
      locationCount[o.location] += o.count;
    } else {
      locationCount[o.location] = o.count;
    }
    if (o.id === operation.id) break;
  }
  return locationCount;
}

export function stringifyInventoryOperationCountOld(
  operation: InventoryOperation,
  operations: InventoryOperation[]
) {
  const count =
    operation.count >= 0
      ? `+${operation.count}`
      : `-${Math.abs(operation.count)}`;
  switch (operation.operationType.type) {
    case "move":
      const i = operations.findIndex((o) => o.id === operation.id);
      return `${operations[i + 1]?.location}>${operation.location}:${
        operation.count
      }`;
    default:
      return `${operation.location}:${count}`;
  }
}

export function stringifyInventoryOperationType(operationType: OperationType) {
  switch (operationType.type) {
    case "arrival":
      return "納品";
    case "createEmpty":
      return "空作成";
    case "deleteOrder":
      return "注文削除";
    case "deleteRegister":
      return "納品書削除";
    case "concealOrderItem":
      return "注文取消";
    case "move":
      return "移動";
    case "ordered":
      return "新規注文";
    case "returned":
      return "返品";
    case "deleteReturn":
      return "返品取消";
    case "deleteTransfer":
      return "移動取消";
  }
}

export const SIZES: string[] = ["9", "8", "7", "6", "5", "4", "3", "2", "1"];

export const SizeSymbolNumberMap = {
  XS: "1",
  S: "2",
  M: "3",
  L: "4",
  XL: "5",
  XXL: "6",
  XXXL: "7",
  XXXXL: "8",
  FREE: "9",
};

export type SizeSymbol = keyof typeof SizeSymbolNumberMap;

export const COLORS: string[] = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

export const SHIPMENT_STATUSES: ShipmentStatus[] = ["ongoing", "arrival"];

export const ORDERITEM_STATUS: OrderItemStatus[] = [
  "backordering",
  "guaranteed",
  "shipped",
  "concealed",
];

export async function clickToCopyToClipboard(
  e: React.MouseEvent<HTMLDivElement>
) {
  e.stopPropagation();
  const text = e.currentTarget.innerText;
  toast.success(`${text}をコピーしました`, {
    position: toast.POSITION.BOTTOM_CENTER,
    transition: customBounce,
  });
  navigator.clipboard.writeText(text);
}

export const sendNumSignal = (old: number) => old + 1;

export function stringifyWsReadyState(readyState: ReadyState) {
  switch (readyState) {
    case 0:
      return "connecting";
    case 1:
      return "connected";
    case 2:
      return "disconnecting";
    default:
      return "disconnected";
  }
}

export async function myCopyImageToClipboard(image: string) {
  let response;
  try {
    response = await fetch(
      `https://phdb.one/phitem_api/v1/public/ph_image/${image}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept-Encoding": "gzip,deflate,br",
        },
      }
    );
  } catch (err) {
    throw Error("can not load image");
  }
  const resBlob = await response.blob();
  const img = await createImageBitmap(resBlob);
  let canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = img.width;
  canvas.height = img.height;
  context!.drawImage(img, 0, 0);
  canvas.toBlob((blob) => {
    if (blob) {
      //@ts-ignore
      navigator.clipboard.write([
        //@ts-ignore
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);
    }
  });
}

export function parseItemPriceFromDetailCode(detailCode: string) {
  const postfix = detailCode.substring(4);
  return Number(postfix) * 1.1;
}

export function triggerDownload(data: DownloadUrl) {
  fetch(data.url, {
    method: "GET",
    headers: {
      "Accept-Encoding": "gzip,deflate,br",
    },
  })
    .then((response) => response.blob())
    .then((blob) => {
      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", data.filename);

      // Append to html link element page
      document.body.appendChild(link);

      // Start download
      link.click();

      // Clean up and remove the link
      link.parentNode!.removeChild(link);
    });
}

export function getLocationBGColor(l: InventoryLocation) {
  switch (l) {
    case InventoryLocation.JP:
      return Color.JPRed;
    case InventoryLocation.CN:
      return Color.CNYellow;
    case InventoryLocation.PCN:
      return Paid(Color.CNYellow);
  }
}

export function repSearch(input: string): string {
  return input.replace(" ", "_");
}

export function extractActivatedSizeNumber(input: string[]): string[] {
  if (input.length === 0) return SIZES;
  if (!isSizeSymbols(input)) return SIZES;
  return input.map((s) => SizeSymbolNumberMap[s]);
}

export function isSizeSymbols(input: string[]): input is SizeSymbol[] {
  return input.every((s) => s in SizeSymbolNumberMap);
}
