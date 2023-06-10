export enum Color {
  Default = "#fffbf2",
  MAIN = "#caad5f",
  Success = "#2c974b",
  Error = "#DC3545",
  Warning = "#eac54f",
  SUB = "#A2B7A0",
  Black = "#2d2d2d",
  SUBLight = "#A2B7A066",
  MAINLight = "#caad5f66",
  JPRed = "#bc002d",
  CNRed = "#de2910",
  CNYellow = "#ffde00",
}

export function Paid(c: Color) {
  return `#${0x0000ff ^ +("0x" + c.substring(1))}`;
}
