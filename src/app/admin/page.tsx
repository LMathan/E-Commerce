"use client";

import { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  ArrowUpRight,
  Truck,
  PlusCircle,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { formatCurrency } from "@/utils/currency";

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState([
    { id: "NX-984210", customer: "Nathan L.", items: 3, total: 99.97, status: "Delivered", date: "Today 10:14 AM" },
    { id: "NX-984209", customer: "Sarah M.", items: 1, total: 49.99, status: "Shipped", date: "Today 09:30 AM" },
    { id: "NX-984208", customer: "David K.", items: 2, total: 114.98, status: "Processing", date: "Yesterday" },
    { id: "NX-984207", customer: "Emily R.", items: 1, total: 34.99, status: "Pending", date: "Yesterday" },
  ]);

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  return (
    <div className="space-y-8">
      {/* Title & Subtitle */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-neutral-900 font-serif">Dashboard Overview</h1>
          <p className="text-xs text-neutral-500 mt-1">Real-time store performance analytics and recent activity</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-5 py-2.5 text-xs font-extrabold text-neutral-950 shadow-md hover:bg-amber-600 transition-all"
        >
          <PlusCircle className="h-4 w-4" />
          <span>New Product</span>
        </Link>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-3xl border border-neutral-200/90 bg-white shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Total Revenue</span>
            <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-700">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-neutral-900 font-serif">$12,450.00</h3>
          <div className="flex items-center text-xs text-emerald-600 font-bold space-x-1">
            <ArrowUpRight className="h-4 w-4" />
            <span>+18.4% from last month</span>
          </div>
        </div>

        <div className="p-6 rounded-3xl border border-neutral-200/90 bg-white shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Total Orders</span>
            <div className="p-2.5 rounded-2xl bg-blue-100 text-blue-700">
              <ShoppingBag className="h-5 w-5" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-neutral-900 font-serif">142</h3>
          <div className="flex items-center text-xs text-emerald-600 font-bold space-x-1">
            <ArrowUpRight className="h-4 w-4" />
            <span>+12.1% from last week</span>
          </div>
        </div>

        <div className="p-6 rounded-3xl border border-neutral-200/90 bg-white shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Active Customers</span>
            <div className="p-2.5 rounded-2xl bg-purple-100 text-purple-700">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-neutral-900 font-serif">1,280</h3>
          <div className="flex items-center text-xs text-emerald-600 font-bold space-x-1">
            <ArrowUpRight className="h-4 w-4" />
            <span>+8.5% new buyers</span>
          </div>
        </div>

        <div className="p-6 rounded-3xl border border-neutral-200/90 bg-white shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Dropship Profit</span>
            <div className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-700">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-neutral-900 font-serif">$3,420.00</h3>
          <div className="flex items-center text-xs text-emerald-600 font-bold space-x-1">
            <ArrowUpRight className="h-4 w-4" />
            <span>28.4% average margin</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Recent Orders & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders Table (8 cols) */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/90 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
            <div>
              <h3 className="text-lg font-black text-neutral-900 font-serif">Recent Customer Orders</h3>
              <p className="text-xs text-neutral-400">Click dropdown to update order status</p>
            </div>
            <Link href="/admin/orders" className="text-xs font-bold text-amber-600 hover:text-amber-700">
              View All Orders
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-400 uppercase font-bold text-[10px]">
                  <th className="py-3 px-2">Order ID</th>
                  <th className="py-3 px-2">Customer</th>
                  <th className="py-3 px-2">Items</th>
                  <th className="py-3 px-2">Total</th>
                  <th className="py-3 px-2">Status Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-neutral-50">
                    <td className="py-3.5 px-2 font-black text-neutral-900">{ord.id}</td>
                    <td className="py-3.5 px-2 font-bold text-neutral-800">{ord.customer}</td>
                    <td className="py-3.5 px-2 text-neutral-600">{ord.items} items</td>
                    <td className="py-3.5 px-2 font-black text-neutral-900">{formatCurrency(ord.total)}</td>
                    <td className="py-3.5 px-2">
                      <select
                        value={ord.status}
                        onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                        className={`rounded-xl px-3 py-1 text-[11px] font-extrabold border focus:outline-none cursor-pointer ${
                          ord.status === "Delivered"
                            ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                            : ord.status === "Shipped"
                            ? "bg-blue-100 text-blue-800 border-blue-300"
                            : ord.status === "Processing"
                            ? "bg-amber-100 text-amber-900 border-amber-300"
                            : "bg-neutral-100 text-neutral-800 border-neutral-300"
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts & Quick Actions (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-neutral-200/90 shadow-xs space-y-4">
            <div className="flex items-center space-x-2 text-amber-600">
              <AlertTriangle className="h-5 w-5" />
              <h4 className="text-sm font-black text-neutral-900">Low Stock Inventory Alerts</h4>
            </div>

            <div className="space-y-3">
              {[
                { name: "NexBeat Pro Headphones", stock: 3, sku: "NX-HP-01" },
                { name: "Minimal LED Table Lamp", stock: 2, sku: "NX-LAMP-02" },
                { name: "UrbanFlex Running Shoes", stock: 5, sku: "NX-SHOE-04" },
              ].map((item) => (
                <div key={item.sku} className="flex items-center justify-between p-3 rounded-2xl bg-amber-50 border border-amber-200/60 text-xs">
                  <div>
                    <p className="font-bold text-neutral-900">{item.name}</p>
                    <p className="text-[10px] text-neutral-500">SKU: {item.sku}</p>
                  </div>
                  <span className="rounded-full bg-red-500 text-white font-black px-2.5 py-0.5 text-[10px]">
                    {item.stock} left
                  </span>
                </div>
              ))}
            </div>

            <Link
              href="/admin/products"
              className="block text-center w-full py-2.5 rounded-2xl border border-neutral-200 text-xs font-extrabold text-neutral-800 hover:bg-neutral-50 transition-colors"
            >
              Manage Inventory
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
