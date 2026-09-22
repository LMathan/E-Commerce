"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  User,
  Package,
  MapPin,
  Heart,
  Star,
  Bell,
  Shield,
  Settings,
  LogOut,
  ChevronRight,
  ShoppingBag,
} from "lucide-react";

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("overview");

  const mockOrders = [
    { id: "NX-984210", product: "NexBeat Pro Wireless Headphones", date: "04/18/2026", price: 49.99, status: "Delivered" },
    { id: "NX-984209", product: "Minimal LED Table Lamp", date: "04/10/2026", price: 34.99, status: "Shipped" },
    { id: "NX-984208", product: "UrbanFlex Running Shoes", date: "03/28/2026", price: 59.99, status: "Processing" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Welcome Banner Header */}
      <div className="rounded-3xl bg-neutral-950 text-white p-6 sm:p-8 mb-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-amber-500 bg-neutral-800 flex-shrink-0">
            <Image
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80"
              alt="Nathan"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h1 className="text-2xl font-black font-serif">Welcome back, Nathan!</h1>
            <p className="text-xs text-neutral-400 mt-0.5">nathan@example.com</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center space-x-6 text-center text-xs">
          <div className="px-4 py-2 rounded-2xl bg-neutral-900 border border-neutral-800">
            <p className="text-neutral-400 text-[10px]">Total Orders</p>
            <p className="text-lg font-black text-amber-400">12</p>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-neutral-900 border border-neutral-800">
            <p className="text-neutral-400 text-[10px]">Total Spent</p>
            <p className="text-lg font-black text-amber-400">$549.90</p>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-neutral-900 border border-neutral-800">
            <p className="text-neutral-400 text-[10px]">Wishlist Items</p>
            <p className="text-lg font-black text-amber-400">8</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Navigation (3 cols) */}
        <aside className="lg:col-span-3 space-y-1">
          {[
            { id: "overview", label: "Overview", icon: User },
            { id: "orders", label: "Orders", icon: Package },
            { id: "addresses", label: "Addresses", icon: MapPin },
            { id: "wishlist", label: "Wishlist", icon: Heart },
            { id: "reviews", label: "Reviews", icon: Star },
            { id: "notifications", label: "Notifications", icon: Bell },
            { id: "security", label: "Security", icon: Shield },
            { id: "settings", label: "Settings", icon: Settings },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                  isActive
                    ? "bg-amber-500 text-neutral-950 shadow-md"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors pt-4">
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </aside>

        {/* Main Content Area (9 cols) */}
        <main className="lg:col-span-9 bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
            <h3 className="text-lg font-black text-neutral-900 font-serif">Recent Orders</h3>
            <Link href="/shop" className="text-xs font-bold text-amber-600 hover:text-amber-700">
              View All Orders
            </Link>
          </div>

          <div className="space-y-3">
            {mockOrders.map((ord) => (
              <div
                key={ord.id}
                className="flex items-center justify-between p-4 rounded-2xl border border-neutral-200/80 bg-neutral-50/50 hover:bg-white transition-all text-xs"
              >
                <div className="space-y-1">
                  <span className="font-extrabold text-neutral-900">{ord.product}</span>
                  <p className="text-[11px] text-neutral-400">Order #{ord.id} • {ord.date}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="font-black text-neutral-900">${ord.price.toFixed(2)}</span>
                  <span
                    className={`rounded-full px-3 py-1 text-[10px] font-extrabold uppercase ${
                      ord.status === "Delivered"
                        ? "bg-emerald-100 text-emerald-800"
                        : ord.status === "Shipped"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {ord.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
