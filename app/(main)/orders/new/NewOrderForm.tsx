"use client";
import { useEffect, useState } from "react";
import { RiArrowLeftFill } from "react-icons/ri";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useCreateOrder } from "@/hooks/api/useOrderData";
import Link from "next/link";
import ui from "@/app/data/ui.json";

export default function NewOrderForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const number = searchParams.get("number");

  const initialFormData = {
    id: 1,
    date: new Date().toISOString(),
    status: "new",
    phone: "",
    number,
    client: "",
    email: "",
    address: "",
    term: "30",
    prepayment: "0",
    comment: "",
    orderItems: [
      {
        id: 0,
        description: "",
        quantity: "",
        price: "",
        discount: "0",
      },
    ],
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleItemChange = (
    index: number,
    field: "description" | "quantity" | "price" | "discount",
    value: string
  ) => {
    const updatedItems = [...formData.orderItems];
    updatedItems[index][field] = value;
    setFormData({ ...formData, orderItems: updatedItems });
  };

  const addOrderLine = () => {
    setFormData({
      ...formData,
      orderItems: [
        ...formData.orderItems,
        {
          id: formData.orderItems.length + 1,
          description: "",
          quantity: "",
          price: "",
          discount: "0",
        },
      ],
    });
  };

  // Set page title
  useEffect(() => {
    if (number) {
      document.title = `${ui.global.new_order} ${ui.global.num} ${number} - ${ui.pages.site_name}`;
    }
  });

  const mutation = useCreateOrder();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate(formData);
    router.push("/");
  };

  type formItem = {
    id?: number;
    description?: string;
    quantity: string;
    price: string;
    discount: string;
  };

  // Calculate total with discount for an item
  const calculateItemTotal = (item: formItem) => {
    const quantity = parseFloat(item.quantity) || 0;
    const price = parseFloat(item.price) || 0;
    const discount = parseInt(item.discount) || 0;

    const total = quantity * price;
    const discountedTotal = total - (total * discount) / 100;

    return discountedTotal.toFixed(2);
  };

  return (
    <div className="mx-auto p-6">
      <div className="mb-6 flex items-center">
        <Link href="/" className="inline-flex items-center mr-4">
          <RiArrowLeftFill className="text-xl" />
        </Link>
        <h1 className="text-2xl font-bold">
          {ui.sales_table.order} {ui.global.num} {number}
        </h1>
      </div>

      <hr className="mb-6" />

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="col-span-1">
            <label className="block text-sm font-medium  mb-1">
              {ui.sales_table.customer} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="client"
              value={formData.client}
              onChange={handleInputChange}
              required
              className="w-full p-2 border dark:border-zinc-800 dark:bg-transparent rounded"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium  mb-1">
              {ui.global.phone} <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="w-full p-2 border dark:border-zinc-800 dark:bg-transparent rounded"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium  mb-1">
              {ui.sales_table.deadline} {ui.global.dd}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="term"
              value={formData.term}
              onChange={handleInputChange}
              required
              className="w-full p-2 border dark:border-zinc-800 dark:bg-transparent rounded"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium  mb-1">
              {ui.global.email}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-2 border dark:border-zinc-800 dark:bg-transparent rounded"
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium mb-1">
              {ui.global.address}
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full p-2 border dark:border-zinc-800 dark:bg-transparent rounded"
            />
          </div>
        </div>

        <div className="mb-6">
          <div className="col-span-1 row-span-2">
            <label className="block text-sm font-medium  mb-1">
              {ui.sales_table.comment}
            </label>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleInputChange}
              className="w-full p-2 border dark:border-zinc-800 dark:bg-transparent rounded h-full"
            />
          </div>
        </div>

        <h2 className="text-xl font-bold mb-4">{ui.global.items}</h2>

        <div className="overflow-x-auto mb-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-zinc-800">
                <th className="p-2 text-sm text-left w-0.5/12">
                  {ui.global.num}
                </th>
                <th className="p-2 text-sm text-left w-7/12">
                  {ui.global.description}
                </th>
                <th className="p-2 text-sm text-center w-1/12">
                  {ui.order.qty}
                </th>
                <th className="p-2 text-sm text-center w-1/12">
                  {ui.order.price}
                </th>
                <th className="p-2 text-sm text-center w-1/12">
                  {ui.order.sum}
                </th>
                <th className="p-2 text-sm text-center w-0.5/12">
                  {ui.order.discount}
                </th>
                <th className="p-2 text-sm text-center w-1/12">
                  {ui.order.sum_with_discount}
                </th>
              </tr>
            </thead>
            <tbody>
              {formData.orderItems.map((item, index) => (
                <tr key={item.id}>
                  <td className="p-2 border dark:border-zinc-800">
                    {index + 1}
                  </td>
                  <td className="p-2 border dark:border-zinc-800">
                    <textarea
                      value={item.description}
                      onChange={(e) =>
                        handleItemChange(index, "description", e.target.value)
                      }
                      className="w-full p-1 dark:bg-transparent"
                    />
                  </td>
                  <td className="p-2 border dark:border-zinc-800">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(index, "quantity", e.target.value)
                      }
                      className="w-full p-1 text-center dark:bg-transparent"
                    />
                  </td>
                  <td className="p-2 border dark:border-zinc-800">
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) =>
                        handleItemChange(index, "price", e.target.value)
                      }
                      className="w-full p-1 text-center dark:bg-transparent"
                    />
                  </td>
                  <td className="p-2 border dark:border-zinc-800 text-center">
                    {(
                      (parseFloat(item.quantity) || 0) *
                      (parseFloat(item.price) || 0)
                    ).toFixed(2)}
                  </td>
                  <td className="p-2 border dark:border-zinc-800">
                    <select
                      value={item.discount}
                      onChange={(e) =>
                        handleItemChange(index, "discount", e.target.value)
                      }
                      className="w-full p-1 text-center dark:bg-transparent"
                    >
                      <option value="0">0%</option>
                      <option value="5">5%</option>
                      <option value="10">10%</option>
                      <option value="15">15%</option>
                      <option value="20">20%</option>
                    </select>
                  </td>
                  <td className="p-2 border dark:border-zinc-800 text-center">
                    {calculateItemTotal(item)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          type="button"
          onClick={addOrderLine}
          className="border dark:border-zinc-800 border-dashed py-2 text-center w-full mb-6 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          {ui.global.add_line}
        </button>

        <Button type="submit">{ui.global.save}</Button>
      </form>
    </div>
  );
}
