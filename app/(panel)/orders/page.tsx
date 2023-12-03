import ClientOrder from "@/components/ClientOrder";
import { cn } from "@/lib/utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "გაგზავნილი შეკვეთები",
};

export default function OrdersPage() {
  const orders = [
    {
      id: 1,
      town: "თბილისი",
      fullName: "ბექა მაისურაძე",
      phone: "579-09-55-87",
      address: "გურამიშვილის 9",
      //თანხა არ ვიცი ჯერ რას ნიშნავს
      comment: "",
      price: 200,
      courierPrice: 10,
      total: function () {
        return this.price + this.courierPrice;
      },
    },
    {
      id: 2,
      town: "თბილისი",
      fullName: "ბექა მაისურაძე",
      phone: "579-09-55-87",
      address: "გურამიშვილის 9",
      //თანხა არ ვიცი ჯერ რას ნიშნავს
      comment: "",
      price: 200,
      courierPrice: 10,
      total: function () {
        return this.price + this.courierPrice;
      },
    },
    // More people...
  ];

  const clientRows = [
    "ქალაქი",
    "სახელი და გვარი",
    "ნივთის ღირებულება",
    "საკურიერო",
    "ჯამი",
    
  ];
  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    {clientRows.map((item, index) => (
                      <th
                        scope="col"
                        className={cn(
                          " py-3.5 text-left text-sm font-semibold text-gray-900",
                          index !== 0 ? "px-3" : ""
                        )}
                      >
                        {item}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {orders.map((order) => (
                    <ClientOrder order={order} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
