import { Quantity } from ".";

export enum InventoryLocation {
  JP = "jp",
  CN = "cn",
  PCN = "pcn",
}

export enum PaidInventoryLocation {
  PCN = "pcn",
}

export const inventoryLocations = Object.values(InventoryLocation);
export const paidInventoryLocations = Object.values(PaidInventoryLocation);

export function isPaidInventoryLocation(
  l: InventoryLocation | PaidInventoryLocation
): l is PaidInventoryLocation {
  return paidInventoryLocations.includes(l as PaidInventoryLocation);
}

export const getEmptyQuantity = () =>
  [
    ...inventoryLocations.map((location) => {
      return { location, quantity: 0 };
    }),
  ] as Quantity[];
