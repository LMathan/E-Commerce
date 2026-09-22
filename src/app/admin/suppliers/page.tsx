"use client";

import { useState } from "react";
import { Truck, Calculator, DollarSign, ExternalLink, RefreshCw, CheckCircle2 } from "lucide-react";
import { formatCurrency } from "@/utils/currency";

export default function AdminSuppliersPage() {
  const [suppliers] = useState([
    {
      id: "sup-1",
      name: "CJ Dropshipping Global",
      contactPerson: "Alex Chen",
      email: "support@cjdropshipping.com",
      status: "ACTIVE",
      linkedProducts: 24,
      avgDeliveryDays: "7-12 Days",
      marginRate: "42%",
    },
    {
      id: "sup-2",
      name: "Spocket US & EU Suppliers",
      contactPerson: "Elena Rostova",
      email: "fulfillment@spocket.co",
      status: "ACTIVE",
      linkedProducts: 14,
      avgDeliveryDays: "3-5 Days",
      marginRate: "35%",
    },
    {
      id: "sup-3",
      name: "Zendrop Direct Fulfillment",
      contactPerson: "Marcus Vance",
      email: "partners@zendrop.com",
      status: "ACTIVE",
      linkedProducts: 10,
      avgDeliveryDays: "5-8 Days",
      marginRate: "48%",
    },
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-neutral-900 font-serif">Dropshipping Suppliers</h1>
        <p className="text-xs text-neutral-500 mt-1">Manage supplier integrations, product cost syncing, and profit margins</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Suppliers Cards (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <h2 className="text-lg font-black text-neutral-900 font-serif">Connected Partner Networks</h2>

          <div className="space-y-4">
            {suppliers.map((s) => (
              <div key={s.id} className="p-6 rounded-3xl border border-neutral-200/90 bg-white shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 rounded-2xl bg-amber-100 text-amber-700">
                      <Truck className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-neutral-900">{s.name}</h3>
                      <p className="text-xs text-neutral-500">{s.contactPerson} • {s.email}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-3 py-1">
                    {s.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-3 border-t border-neutral-100 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-400">Linked Items</span>
                    <p className="font-black text-neutral-900">{s.linkedProducts} items</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-400">Avg Delivery</span>
                    <p className="font-black text-neutral-900">{s.avgDeliveryDays}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-400">Profit Margin</span>
                    <p className="font-black text-emerald-600">{s.marginRate}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dropshipping Calculator (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-neutral-200/90 shadow-xs space-y-4">
            <h3 className="text-base font-black text-neutral-900 font-serif flex items-center gap-2">
              <Calculator className="h-5 w-5 text-amber-500" />
              <span>Profit Margin Estimator</span>
            </h3>
            <p className="text-xs text-neutral-500">
              Instant calculation of net profit after supplier wholesale price and shipping costs.
            </p>

            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200/60 text-xs space-y-2.5">
              <div className="flex justify-between font-bold text-neutral-900">
                <span>Avg Customer Price:</span>
                <span>$49.99</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Supplier Cost:</span>
                <span>-$18.50</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Est. Shipping & Handling:</span>
                <span>-$4.99</span>
              </div>
              <div className="flex justify-between font-black text-sm border-t border-amber-200 pt-2 text-amber-900">
                <span>Net Profit per Sale:</span>
                <span className="text-emerald-700">$26.50 (53%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
