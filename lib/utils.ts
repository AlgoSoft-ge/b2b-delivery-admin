import { ClientOrderType } from "@/types/order";
import { FilterValue } from "antd/es/table/interface";
import { ClassValue, clsx } from "clsx";
import JsBarcode from "jsbarcode";
import queryString from "query-string";
import { twMerge } from "tailwind-merge";

/////////////////////////for tailwind classnames/////////////////////////
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

////////////////////////table utils////////////////////////
export function getUniques<T extends keyof ClientOrderType>(
  data: ClientOrderType[],
  fieldName: T
) {
  return data
    ?.filter(
      (item: ClientOrderType, index, self) =>
        index ===
        self.findIndex((t: ClientOrderType) => t[fieldName] === item[fieldName])
    )
    .map((item: ClientOrderType) => {
      return {
        text: item[fieldName],
        value:
          fieldName == "client_name" && item["client"]
            ? item["client"]
            : item[fieldName],
      };
    });
}

export function getDefaultFilter(storedQuery: string | null, key: string) {
  const keyQuery = storedQuery
    ? queryString.parse(storedQuery, { arrayFormat: "comma" })[key]
    : null;
  const parsedKeyQuery = Array.isArray(keyQuery)
    ? keyQuery
    : keyQuery
    ? [keyQuery]
    : null;

  const defaultFilter =
    parsedKeyQuery && parsedKeyQuery.length > 0 ? parsedKeyQuery : null;

  return defaultFilter as FilterValue | null | undefined;
}

export function getColorForStatus(status: string) {
  switch (status) {
    case "DF":
      return "gray";
    case "RD":
      return "red";
    case "YL":
      return "orange";
    case "GR":
      return "green";
    case "BK":
      return "black";
    case "Pending Approval":
      return "blue";
  }
}

export function getStatusName(status: string) {
  switch (status) {
    case "DF":
      return "სტატუსის გარეშე";
    case "RD":
      return "ვერ ჩაბარდა";
    case "YL":
      return "ჩაბარების პროცესშია";
    case "GR":
      return "ჩაბარებულია";
    case "BK":
      return "დაბრუნებულია";
  }
}

export async function generateBarcodeDataUrl(value: string): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    JsBarcode(canvas, value, {
      format: "CODE128",
      lineColor: "#000",
      width: 1,
      height: 100,
      displayValue: true,
    });
    resolve(canvas.toDataURL("image/png"));
  });
}
