import React, { useState } from "react";
import { Button, Checkbox } from "antd";
import { ClientOrderType } from "@/types/order";
import { generateBarcodeDataUrl } from "@/lib/utils";

const columnNames = {
  id: "კოდი",
  address: "მისამართი",
  phone_number: "ტელეფონი",
  item_price: "შეკვეთის ფასი",
  courier_fee: "საკურიერო",
  client_name: "კლიენტი",
  comment: "კომენტარი",
  barcode: "ბარკოდი",
} as const;

type ColumnKey = keyof typeof columnNames;

const ColumnPrint = ({
  selectedRowKeys,
  orders,
}: {
  selectedRowKeys: React.Key[];
  orders: ClientOrderType[];
}) => {
  const [checkedValues, setCheckedValues] = useState<ColumnKey[]>([]);

  const handleCheckChange = (checked: boolean, column: ColumnKey) => {
    if (checked) {
      setCheckedValues((prev) => [...prev, column]);
    } else {
      setCheckedValues((prev) => prev.filter((item) => item !== column));
    }
  };

  const handlePrint = async () => {
    const printWindow = window.open("", "_blank");

    // Get the selected rows from the data using the selected keys
    const selectedRows = orders.filter((row) =>
      selectedRowKeys.includes(row.id)
    );
    printWindow?.document.write("<table style='width:100%'>");

    // Write table headers
    printWindow?.document.write("<tr style='border: 1px solid black'>");
    checkedValues.forEach((key) => {
      printWindow?.document.write(
        `<th style="border: 1px solid black">${columnNames[key]}</th>`
      );
    });
    printWindow?.document.write("</tr>");

    interface NewClientOrderType extends ClientOrderType {
      [key: string]: string | number | null | boolean | undefined;
    }

    // Write table rows
    const barcodePromises = selectedRows.map((record: ClientOrderType) => {
      const value = (record as NewClientOrderType)["barcode"] as string;
      return generateBarcodeDataUrl(value);
    });
    const barcodes = await Promise.all(barcodePromises);

    selectedRows.forEach((record: ClientOrderType, index) => {
      printWindow?.document.write("<tr style='border: 1px solid black'>");
      checkedValues.forEach((key) => {
        if (key === "barcode") {
          printWindow?.document.write(
            `<td style="text-align: center; border: 1px solid black">
            <img src="${barcodes[index]}" ${
              index === 1 ? 'onload="window.print()"' : ""
            } /></td>`
          );
        } else {
          printWindow?.document.write(
            `<td style="text-align: center; border: 1px solid black">${
              (record as NewClientOrderType)[key]
            }</td>`
          );
        }
      });
      printWindow?.document.write("</tr>");
    });

    printWindow?.document.write("</table>");

    printWindow?.document.write("</body></html>");
    printWindow?.document.close();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2">
        {Object.entries(columnNames).map(([value, label]) => (
          <Checkbox
            key={value}
            onChange={(e) =>
              handleCheckChange(e.target.checked, value as ColumnKey)
            }
          >
            {label}
          </Checkbox>
        ))}
      </div>
      <Button onClick={handlePrint}>დაპრინტვა</Button>
    </div>
  );
};

export default ColumnPrint;
