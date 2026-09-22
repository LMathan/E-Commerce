"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toaster";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function AddProductPage() {
  const router = useRouter();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [compareAtPrice, setCompareAtPrice] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !basePrice) {
      addToast({ type: "error", title: "Product name and price are required." });
      return;
    }

    setLoading(true);
    try {
      addToast({ type: "success", title: "Product created successfully!" });
      router.push("/admin/products");
    } catch {
      addToast({ type: "error", title: "Failed to create product" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center space-x-3">
        <Link href="/admin/products">
          <button className="p-2.5 rounded-2xl border border-neutral-200 bg-white hover:bg-neutral-100 transition-colors">
            <ArrowLeft className="h-4 w-4 text-neutral-700" />
          </button>
        </Link>
        <div>
          <h1 className="text-3xl font-black text-neutral-900 font-serif">Add New Product</h1>
          <p className="text-xs text-neutral-500">Create a new product listing in your catalog.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-neutral-200/90 bg-white p-6 sm:p-8 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">Product Title *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. NexBeat Pro Wireless Headphones"
              className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 p-3 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">Brand Name</label>
            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="e.g. Nexora"
              className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 p-3 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">Selling Price ($) *</label>
            <input
              type="number"
              required
              step="0.01"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              placeholder="49.99"
              className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 p-3 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">Compare-at Price ($)</label>
            <input
              type="number"
              step="0.01"
              value={compareAtPrice}
              onChange={(e) => setCompareAtPrice(e.target.value)}
              placeholder="99.99"
              className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 p-3 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">Cost Price ($ - Dropship)</label>
            <input
              type="number"
              step="0.01"
              value={costPrice}
              onChange={(e) => setCostPrice(e.target.value)}
              placeholder="18.50"
              className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 p-3 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 p-3 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
            >
              <option value="">Select Category</option>
              <option value="electronics">Electronics</option>
              <option value="home-living">Home & Living</option>
              <option value="fashion">Fashion</option>
              <option value="beauty-care">Beauty & Care</option>
              <option value="sports-fitness">Sports & Fitness</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">Image URL</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 p-3 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">Short Summary</label>
          <input
            type="text"
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            placeholder="A brief highlight of the product..."
            className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 p-3 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">Full Description</label>
          <textarea
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detailed features, specifications, and warranty details..."
            className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 p-3 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
          <Link href="/admin/products">
            <button type="button" className="rounded-2xl border border-neutral-200 bg-white px-5 py-3 text-xs font-bold text-neutral-700 hover:bg-neutral-50">
              Cancel
            </button>
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-6 py-3 text-xs font-extrabold text-neutral-950 shadow-md hover:bg-amber-600 transition-all"
          >
            <Save className="h-4 w-4" />
            <span>{loading ? "Saving..." : "Save Product"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
