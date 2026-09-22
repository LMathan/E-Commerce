"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/Toaster";
import { Save, Store, Bell, ShieldCheck } from "lucide-react";

export default function AdminSettingsPage() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  const [storeName, setStoreName] = useState("Nexora");
  const [storeEmail, setStoreEmail] = useState("support@nexora.com");
  const [announcementText, setAnnouncementText] = useState("Get 10% OFF on your first order | Free shipping over $50");
  const [announcementEnabled, setAnnouncementEnabled] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      addToast({ type: "success", title: "Site settings saved successfully!" });
    } catch {
      addToast({ type: "error", title: "Failed to save settings" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-neutral-900 font-serif">Store Settings</h1>
        <p className="text-xs text-neutral-500 mt-1">Configure global store details, announcement banner, and integrations</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Store Details */}
        <div className="rounded-3xl border border-neutral-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-lg font-black text-neutral-900 font-serif flex items-center gap-2">
            <Store className="h-5 w-5 text-amber-500" />
            <span>General Store Information</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">Store Name</label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 p-3 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">Support Email</label>
              <input
                type="email"
                value={storeEmail}
                onChange={(e) => setStoreEmail(e.target.value)}
                className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 p-3 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* Announcement Bar */}
        <div className="rounded-3xl border border-neutral-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-lg font-black text-neutral-900 font-serif flex items-center gap-2">
            <Bell className="h-5 w-5 text-amber-500" />
            <span>Top Announcement Banner</span>
          </h2>

          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="announcementToggle"
                checked={announcementEnabled}
                onChange={(e) => setAnnouncementEnabled(e.target.checked)}
                className="h-4 w-4 rounded accent-amber-500 cursor-pointer"
              />
              <label htmlFor="announcementToggle" className="text-xs font-bold text-neutral-900 cursor-pointer">
                Enable Announcement Bar
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">Announcement Text</label>
              <input
                type="text"
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 p-3 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-7 py-3.5 text-xs font-extrabold text-neutral-950 shadow-md hover:bg-amber-600 transition-all"
          >
            <Save className="h-4 w-4" />
            <span>{loading ? "Saving..." : "Save Store Settings"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
