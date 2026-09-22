import Link from "next/link";
import { auth } from "@/lib/auth/auth";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Truck,
  Users,
  Settings,
  Store,
  Sparkles,
  PlusCircle,
  Bell,
} from "lucide-react";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="min-h-screen flex bg-neutral-50 text-neutral-900">
      {/* Sidebar */}
      <aside className="w-64 border-r border-neutral-200 bg-white flex flex-col justify-between p-5 flex-shrink-0 shadow-xs">
        <div className="space-y-6">
          <div className="flex items-center space-x-3 border-b border-neutral-100 pb-4">
            <div className="h-9 w-9 rounded-2xl bg-amber-500 flex items-center justify-center font-black text-neutral-950 shadow-md shadow-amber-500/20">
              <Sparkles className="h-5 w-5 fill-neutral-950 text-amber-500" />
            </div>
            <div>
              <span className="font-black text-lg font-serif tracking-tight text-neutral-900">Nexora</span>
              <span className="block text-[9px] uppercase font-black tracking-widest text-amber-600">
                Admin Control Panel
              </span>
            </div>
          </div>

          <nav className="space-y-1.5 text-xs font-bold">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-neutral-700 hover:bg-amber-50 hover:text-amber-700 transition-all"
            >
              <LayoutDashboard className="h-4 w-4 text-amber-600" />
              <span>Dashboard Overview</span>
            </Link>

            <Link
              href="/admin/products"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-neutral-700 hover:bg-amber-50 hover:text-amber-700 transition-all"
            >
              <Package className="h-4 w-4 text-amber-600" />
              <span>Products Catalog</span>
            </Link>

            <Link
              href="/admin/orders"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-neutral-700 hover:bg-amber-50 hover:text-amber-700 transition-all"
            >
              <ShoppingCart className="h-4 w-4 text-amber-600" />
              <span>Orders Management</span>
            </Link>

            <Link
              href="/admin/suppliers"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-neutral-700 hover:bg-amber-50 hover:text-amber-700 transition-all"
            >
              <Truck className="h-4 w-4 text-amber-600" />
              <span>Dropship Suppliers</span>
            </Link>

            <Link
              href="/admin/customers"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-neutral-700 hover:bg-amber-50 hover:text-amber-700 transition-all"
            >
              <Users className="h-4 w-4 text-amber-600" />
              <span>Customers</span>
            </Link>

            <Link
              href="/admin/settings"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-neutral-700 hover:bg-amber-50 hover:text-amber-700 transition-all"
            >
              <Settings className="h-4 w-4 text-amber-600" />
              <span>Store Settings</span>
            </Link>
          </nav>
        </div>

        <div className="pt-4 border-t border-neutral-100 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <Store className="h-4 w-4 text-amber-500" />
            <span>View Live Storefront</span>
          </Link>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-neutral-200/80 px-8 py-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-3">
            <h2 className="text-lg font-black text-neutral-900 font-serif">Store Overview</h2>
            <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5">
              Live Syncing
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-4 py-2 text-xs font-extrabold text-neutral-950 shadow-md hover:bg-amber-600 transition-all"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Add Product</span>
            </Link>

            <div className="h-8 w-[1px] bg-neutral-200" />

            <div className="flex items-center space-x-2 text-xs">
              <div className="h-8 w-8 rounded-full bg-neutral-900 text-amber-400 font-bold flex items-center justify-center">
                A
              </div>
              <div>
                <p className="font-bold text-neutral-900 text-xs">Store Administrator</p>
                <p className="text-[10px] text-neutral-400">admin@nexora.com</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
}
