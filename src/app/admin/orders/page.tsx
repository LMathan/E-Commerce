"use client";

import { useState } from "react";
import { formatCurrency } from "@/utils/currency";
import { Search, Eye, Filter } from "lucide-react";
import { useToast } from "@/components/ui/Toaster";

export default function AdminOrdersPage() {
  const { addToast } = useToast();

  const [orders, setOrders] = useState([
    {
      id: "NX-984210",
      orderNumber: "NX-984210",
      createdAt: "2026-04-18T10:14:00Z",
      customerName: "Nathan L.",
      city: "San Francisco",
      status: "DELIVERED",
      paymentStatus: "PAID",
      totalAmount: 99.97,
    },
    {
      id: "NX-984209",
      orderNumber: "NX-984209",
      createdAt: "2026-04-18T09:30:00Z",
      customerName: "Sarah M.",
      city: "New York",
      status: "SHIPPED",
      paymentStatus: "PAID",
      totalAmount: 49.99,
    },
    {
      id: "NX-984208",
      orderNumber: "NX-984208",
      createdAt: "2026-04-17T15:20:00Z",
      customerName: "David K.",
      city: "Chicago",
      status: "PROCESSING",
      paymentStatus: "PAID",
      totalAmount: 114.98,
    },
    {
      id: "NX-984207",
      orderNumber: "NX-984207",
      createdAt: "2026-04-17T11:05:00Z",
      customerName: "Emily R.",
      city: "Los Angeles",
      status: "PENDING",
      paymentStatus: "PENDING",
      totalAmount: 34.99,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");

  const handleStatusChange = (id: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
    addToast({ type: "success", title: `Order ${id} status updated to ${newStatus}` });
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-neutral-900 font-serif">Orders Management</h1>
        <p className="text-xs text-neutral-500 mt-1">Track customer orders, payment status, and fulfillment updates</p>
      </div>

      <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-neutral-200/90 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search by order # or customer name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 py-2.5 pl-9 pr-4 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
          />
          <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
        </div>
        <span className="text-xs font-bold text-neutral-500">{filteredOrders.length} Orders</span>
      </div>

      <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-200 text-neutral-400 uppercase font-bold text-[10px] bg-neutral-50/50">
                <th className="py-4 px-6">Order #</th>
                <th className="py-4 px-4">Date</th>
                <th className="py-4 px-4">Customer</th>
                <th className="py-4 px-4">Payment</th>
                <th className="py-4 px-4">Fulfillment Status</th>
                <th className="py-4 px-6 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-neutral-50/60 transition-colors">
                  <td className="py-4 px-6 font-black text-amber-600">{order.orderNumber}</td>
                  <td className="py-4 px-4 text-neutral-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-bold text-neutral-900">{order.customerName}</span>
                    <span className="block text-[10px] text-neutral-400">{order.city}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${
                        order.paymentStatus === "PAID"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={`rounded-xl px-3 py-1 text-[11px] font-extrabold border focus:outline-none cursor-pointer ${
                        order.status === "DELIVERED"
                          ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                          : order.status === "SHIPPED"
                          ? "bg-blue-100 text-blue-800 border-blue-300"
                          : order.status === "PROCESSING"
                          ? "bg-amber-100 text-amber-900 border-amber-300"
                          : "bg-neutral-100 text-neutral-800 border-neutral-300"
                      }`}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>
                  <td className="py-4 px-6 text-right font-black text-neutral-900">
                    {formatCurrency(order.totalAmount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
