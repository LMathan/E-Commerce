"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PlusCircle, Search, Trash2, Edit, Eye, Filter } from "lucide-react";
import { formatCurrency } from "@/utils/currency";
import { useToast } from "@/components/ui/Toaster";

export default function AdminProductsPage() {
  const { addToast } = useToast();

  const [products, setProducts] = useState([
    {
      id: "p1",
      name: "SoundPro X1 Wireless Earbuds",
      category: "Electronics",
      price: 49.99,
      compareAtPrice: 60.00,
      stock: 45,
      status: "ACTIVE",
      image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&auto=format&fit=crop&q=80",
    },
    {
      id: "p2",
      name: "Modern LED Table Lamp",
      category: "Home & Living",
      price: 34.99,
      compareAtPrice: 45.00,
      stock: 12,
      status: "ACTIVE",
      image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&auto=format&fit=crop&q=80",
    },
    {
      id: "p3",
      name: "NexFit Smartwatch Series 5",
      category: "Electronics",
      price: 79.99,
      compareAtPrice: 99.99,
      stock: 28,
      status: "ACTIVE",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=80",
    },
    {
      id: "p4",
      name: "UrbanFlex Running Shoes",
      category: "Sports & Fitness",
      price: 59.99,
      compareAtPrice: 79.99,
      stock: 5,
      status: "LOW_STOCK",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=80",
    },
    {
      id: "p5",
      name: "Insulated Stainless Steel Bottle",
      category: "Travel",
      price: 24.99,
      compareAtPrice: 35.00,
      stock: 60,
      status: "ACTIVE",
      image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&auto=format&fit=crop&q=80",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");

  const handleDelete = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    addToast({ type: "success", title: "Product deleted" });
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-neutral-900 font-serif">Products Catalog</h1>
          <p className="text-xs text-neutral-500 mt-1">Manage inventory, prices, and product visibility</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-5 py-3 text-xs font-extrabold text-neutral-950 shadow-md hover:bg-amber-600 transition-all"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-neutral-200/90 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search products by title or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 py-2.5 pl-9 pr-4 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
          />
          <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
        </div>
        <span className="text-xs font-bold text-neutral-500">Showing {filteredProducts.length} items</span>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-200 text-neutral-400 uppercase font-bold text-[10px] bg-neutral-50/50">
                <th className="py-4 px-6">Product</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Price</th>
                <th className="py-4 px-4">Stock</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-neutral-50/60 transition-colors">
                  <td className="py-4 px-6 flex items-center space-x-3">
                    <div className="relative h-12 w-12 rounded-xl bg-neutral-100 overflow-hidden border border-neutral-200 flex-shrink-0">
                      <Image src={p.image} alt={p.name} fill className="object-contain p-1" />
                    </div>
                    <div>
                      <p className="font-bold text-neutral-900 text-xs">{p.name}</p>
                      <p className="text-[10px] text-neutral-400">ID: {p.id}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-semibold text-neutral-600">{p.category}</td>
                  <td className="py-4 px-4 font-black text-neutral-900">
                    {formatCurrency(p.price)}
                    {p.compareAtPrice && (
                      <span className="block text-[10px] text-neutral-400 line-through">
                        {formatCurrency(p.compareAtPrice)}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`font-bold ${p.stock <= 10 ? "text-red-600" : "text-neutral-900"}`}>
                      {p.stock} units
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-extrabold uppercase ${
                        p.stock <= 10
                          ? "bg-red-100 text-red-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {p.stock <= 10 ? "Low Stock" : "Active"}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <Link
                      href={`/product/${p.id}`}
                      className="inline-flex p-2 rounded-xl text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                      title="View"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-2 rounded-xl text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
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
