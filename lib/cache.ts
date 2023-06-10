import { PhItem } from "../type";
import { isBrowser, privateApiCall } from "./utility";

class PhItemCacheStore {
  private store: Map<string, PhItem> = new Map();

  async getOne(code: string) {
    let item = this.store.get(code);
    if (item) return item;
    if (isBrowser) {
      let response = await fetch(
        `https://phdb.one/phitem_api/v1/public/ph_item/${code}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Accept-Encoding": "gzip,deflate,br",
          },
        }
      ).catch((err) => {
        console.log(err);
        return undefined;
      });
      if (response?.status !== 200) {
        return undefined;
      }
      let item: PhItem = await response.json();
      this.store.set(item.code, item);
      return item;
    }
  }

  async get(codes: string[]) {
    let items: PhItem[] = [];
    if (codes.length === 0) return [];
    for (let i = 0; i < codes.length; i++) {
      let item = this.store.get(codes[i]);
      if (item) {
        items.push(item);
        codes[i] = "";
      }
    }
    let queryCodes = codes.filter((code) => code.length !== 0).join(",");
    if (queryCodes.length === 0) return items;
    if (isBrowser) {
      let response = await fetch(
        `https://phdb.one/phitem_api/v1/public/ph_item/item_codes?codes=${queryCodes}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Accept-Encoding": "gzip,deflate,br",
          },
        }
      ).catch((err) => {
        console.log(err);
        return undefined;
      });

      if (response && response.status === 200) {
        const res: PhItem[] = await response.json();
        for (const item of res) {
          items.push(item);
          this.store.set(item.code, item);
        }
      }
    }
    return items;
  }

  getExisted(itemCodeExt: string) {
    const code = itemCodeExt.slice(0, 11);
    let item = this.store.get(code);
    if (item) return item;
    return undefined;
  }
}

export const phItemStore = new PhItemCacheStore();
