"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import React from "react";
import ExcelForm from "./ExcelForm";
import OrderForm from "./OrderForm";
import { ClientOrderType } from "@/types/order";
import { UserType } from "@/types/user";
import { message } from "antd";
import Scanner from "./Scanner";

export default function AddOrder({
  user,
  setOrders,
  orders,
  setIsAdd,
}: {
  user: UserType | undefined;
  setOrders: (orders: ClientOrderType[]) => void;
  orders: ClientOrderType[];
  setIsAdd: (isAdd: boolean) => void;
}) {
  const [type, setType] = useState<"form" | "excel" | "barcode">("form");
  const [barcode, setBarcode] = useState("");

  const onSubmit = async (data: ClientOrderType) => {
    const modifiedData = {
      ...data,
      sum: Number(data.item_price) + Number(data.courier_fee),
      status: "DF",
      created_at: new Date().toISOString(),
      phone_number: data.phone_number,
    };

    !modifiedData.barcode && delete modifiedData.barcode;

    try {
      message.config({ maxCount: 1 });
      message.loading("დაელოდეთ...");
      const response = await fetch(`${process.env.API_URL}/orders/`, {
        method: "POST",
        body: JSON.stringify(modifiedData),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${user?.token}`,
        },
      });
      const newOrder = await response.json();

      if (response.ok) {
        setOrders([...orders, newOrder]);
        message.success("შეკვეთა წარმატებით დაემატა");
        setIsAdd(false);
      } else {
        message.error("შეკვეთის დამატება ვერ მოხერხდა");
      }
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div>
      <div className="flex flex-col md:flex-row gap-3 pb-2 pr-3">
        <button
          type="button"
          className={cn(
            "rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 ",
            type == "form" ? "bg-indigo-600 text-white" : ""
          )}
          onClick={() => {
            setType("form"), setBarcode("");
          }}
        >
          ფორმით
        </button>
        <button
          type="button"
          className={cn(
            "rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300",
            type == "excel" ? "bg-indigo-600 text-white" : ""
          )}
          onClick={() => setType("excel")}
        >
          ექსელით
        </button>
        <button
          type="button"
          className={cn(
            "rounded-full flex items-center justify-center gap-3 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300",
            type == "barcode" ? "bg-indigo-600 text-white" : ""
          )}
          onClick={() => setType("barcode")}
        >
          ბარკოდის დასკანერება
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1h-3zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5zM.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5zM3 4.5a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0v-7zm2 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0v-7zm2 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0v-7zm2 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-7zm3 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0v-7z" />
          </svg>
        </button>
      </div>
      {type == "form" && (
        <OrderForm
          order={null}
          onSubmit={onSubmit}
          mode="add"
          barcode={barcode}
        />
      )}
      {type == "excel" && <ExcelForm token={user?.token} />}
      {type == "barcode" && (
        <Scanner setBarcode={setBarcode} setType={setType} />
      )}
    </div>
  );
}
