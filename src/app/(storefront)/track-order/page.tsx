"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Clock, MapPin, Package, Search, Truck } from "lucide-react";

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("NX984210");
  const [email, setEmail] = useState("nathan@example.com");
  const [searched, setSearched] = useState(true);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-2xl mx-auto text-center mb-10 space-y-3">
        <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 font-serif">Track Your Order</h1>
        <p className="text-xs sm:text-sm text-neutral-500">
          Enter your order number and email address to view real-time shipping updates.
        </p>
      </div>

      {/* Order Lookup Form */}
      <form onSubmit={handleTrack} className="max-w-xl mx-auto bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm space-y-4 mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">Order Number</label>
            <input
              type="text"
              required
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="e.g. NX984210"
              className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">Email or Phone</label>
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nathan@example.com"
              className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full rounded-2xl bg-neutral-950 py-3 text-xs font-extrabold text-white hover:bg-amber-500 hover:text-neutral-950 transition-all shadow-sm"
        >
          Track Order
        </button>
      </form>

      {/* Tracking Results Card */}
      {searched && (
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Timeline (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div>
                <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Order Status</p>
                <h3 className="text-lg font-black text-neutral-900 font-serif">Order #{orderNumber}</h3>
              </div>
              <span className="rounded-full bg-amber-100 text-amber-900 font-extrabold text-xs px-3 py-1">
                In Transit
              </span>
            </div>

            {/* Steps Timeline */}
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-amber-200">
              {[
                { status: "Order Placed", date: "04/18/2026 10:14 AM", done: true },
                { status: "Payment Confirmed", date: "04/18/2026 10:15 AM", done: true },
                { status: "Processing", date: "04/19/2026 02:30 PM", done: true },
                { status: "Shipped", date: "04/20/2026 09:00 AM", done: true, current: true },
                { status: "Out for Delivery", date: "Pending", done: false },
                { status: "Delivered", date: "Estimated: Fri, 25 Apr 2026", done: false },
              ].map((step, idx) => (
                <div key={idx} className="relative flex items-start space-x-3">
                  <div
                    className={`absolute -left-6 top-0.5 h-5 w-5 rounded-full flex items-center justify-center text-white ${
                      step.done
                        ? "bg-emerald-500"
                        : step.current
                        ? "bg-amber-500 ring-4 ring-amber-100"
                        : "bg-neutral-200"
                    }`}
                  >
                    {step.done ? <CheckCircle2 className="h-3.5 w-3.5" /> : <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                  </div>
                  <div>
                    <h4 className={`text-xs font-extrabold ${step.done || step.current ? "text-neutral-900" : "text-neutral-400"}`}>
                      {step.status}
                    </h4>
                    <p className="text-[10px] text-neutral-400">{step.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Info Box & Map Simulation (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-amber-50/80 p-6 rounded-3xl border border-amber-200/60 text-center space-y-2">
              <Truck className="h-8 w-8 text-amber-600 mx-auto" />
              <h4 className="text-xs uppercase font-extrabold tracking-wider text-amber-900">Estimated Delivery</h4>
              <p className="text-2xl font-black text-neutral-900 font-serif">Fri, 25 Apr 2026</p>
              <p className="text-xs text-neutral-600">Carrier: Express Logistics (Ref: EX-902184)</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">Delivery Address</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Nathan L.<br />
                123 Main Street, Apt 4B<br />
                San Francisco, CA 94105
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
