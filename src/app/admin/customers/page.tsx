"use client";

import { useState } from "react";
import { Users, Search, Mail, ShieldCheck } from "lucide-react";
import { formatCurrency } from "@/utils/currency";

export default function AdminCustomersPage() {
  const [customers] = useState([
    {
      id: "usr-1",
      name: "Nathan L.",
      email: "nathan@example.com",
      status: "ACTIVE",
      totalOrders: 12,
      totalSpent: 549.90,
      joinedDate: "2026-01-15",
    },
    {
      id: "usr-2",
      name: "Sarah M.",
      email: "sarah.m@example.com",
      status: "ACTIVE",
      totalOrders: 5,
      totalSpent: 280.00,
      joinedDate: "2026-02-10",
    },
    {
      id: "usr-3",
      name: "David K.",
      email: "david.k@example.com",
      status: "ACTIVE",
      totalOrders: 8,
      totalSpent: 410.50,
      joinedDate: "2026-02-28",
    },
    {
      id: "usr-4",
      name: "Emily R.",
      email: "emily.r@example.com",
      status: "ACTIVE",
      totalOrders: 2,
      totalSpent: 89.98,
      joinedDate: "2026-03-14",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-neutral-900 font-serif">Customers Management</h1>
        <p className="text-xs text-neutral-500 mt-1">View registered user accounts, order history, and customer LTV</p>
      </div>

      <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-neutral-200/90 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 py-2.5 pl-9 pr-4 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
          />
          <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
        </div>
        <span className="text-xs font-bold text-neutral-500">{filteredCustomers.length} Customers</span>
      </div>

      <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-200 text-neutral-400 uppercase font-bold text-[10px] bg-neutral-50/50">
                <th className="py-4 px-6">Customer Name</th>
                <th className="py-4 px-4">Email</th>
                <th className="py-4 px-4">Total Orders</th>
                <th className="py-4 px-4">Total Spent</th>
                <th className="py-4 px-6 text-right">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredCustomers.map((user) => (
                <tr key={user.id} className="hover:bg-neutral-50/60 transition-colors">
                  <td className="py-4 px-6 font-bold text-neutral-900">{user.name}</td>
                  <td className="py-4 px-4 text-neutral-500">{user.email}</td>
                  <td className="py-4 px-4 font-extrabold text-neutral-900">{user.totalOrders} orders</td>
                  <td className="py-4 px-4 font-black text-amber-600">{formatCurrency(user.totalSpent)}</td>
                  <td className="py-4 px-6 text-right text-neutral-400">
                    {new Date(user.joinedDate).toLocaleDateString()}
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
