"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  ChevronDown,
  LayoutDashboard,
  Sparkles,
} from "lucide-react";
import { useCartContext } from "@/components/providers/CartProvider";
import { MobileNav } from "@/components/navigation/MobileNav";
import { CartDrawer } from "@/components/cart/CartDrawer";

const NAV_LINKS = [
  { href: "/shop", label: "Shop", hasDropdown: true },
  { href: "/shop?featured=true", label: "Collections" },
  { href: "/shop?new=true", label: "New Arrivals" },
  { href: "/shop?sale=true", label: "Deals" },
  { href: "/about", label: "About" },
];

export function Header() {
  const { data: session } = useSession();
  const { itemCount, isOpen, openCart, closeCart } = useCartContext();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setAccountDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 py-3 shadow-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Left: Mobile Toggle & Brand Logo */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileNavOpen(true)}
              className="lg:hidden p-2 text-neutral-700 hover:text-neutral-900 transition-colors rounded-lg hover:bg-neutral-100"
              aria-label="Open Mobile Menu"
            >
              <Menu className="h-6 w-6" />
            </button>

            <Link href="/" className="flex items-center space-x-2 group">
              <div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-neutral-950 font-black shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="h-5 w-5 fill-neutral-950 text-amber-500" />
              </div>
              <span className="text-2xl font-black tracking-tight text-neutral-900 font-serif">
                Nexora<span className="text-amber-500">.</span>
              </span>
            </Link>
          </div>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-7 text-sm font-bold text-neutral-800">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-1 hover:text-amber-600 transition-colors py-1"
              >
                <span>{link.label}</span>
                {link.hasDropdown && <ChevronDown className="h-3.5 w-3.5 text-neutral-400" />}
              </Link>
            ))}
          </nav>

          {/* Center Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-xs lg:max-w-md relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products, brands and more..."
              className="w-full rounded-full border border-neutral-200 bg-neutral-100/90 py-2.5 pl-4 pr-10 text-xs text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all shadow-inner"
            />
            <button type="submit" className="absolute right-3.5 top-3 text-neutral-400 hover:text-amber-600 transition-colors">
              <Search className="h-4 w-4" />
            </button>
          </form>

          {/* Right Icons: User, Wishlist, Cart */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Search Icon button for mobile */}
            <Link
              href="/shop"
              className="md:hidden p-2 text-neutral-700 hover:text-amber-600 transition-colors rounded-full hover:bg-neutral-100"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Link>

            {/* User Account Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setAccountDropdownOpen((prev) => !prev)}
                className="p-2 text-neutral-700 hover:text-amber-600 transition-colors rounded-full hover:bg-neutral-100"
                aria-label="Account"
              >
                <User className="h-5 w-5" />
              </button>

              {accountDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-white border border-neutral-200 p-2 shadow-2xl z-50 text-neutral-800">
                  {session?.user ? (
                    <div className="space-y-1">
                      <div className="px-4 py-2 border-b border-neutral-100 mb-1">
                        <p className="text-xs font-bold text-neutral-900 truncate">{session.user.name || "Customer"}</p>
                        <p className="text-[10px] text-neutral-500 truncate">{session.user.email}</p>
                      </div>
                      <Link
                        href="/account"
                        onClick={() => setAccountDropdownOpen(false)}
                        className="block px-4 py-2 text-xs font-semibold hover:bg-neutral-100 hover:text-amber-600 rounded-xl transition-colors"
                      >
                        My Account
                      </Link>
                      {(session.user as any).isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setAccountDropdownOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-xs font-bold text-amber-600 hover:bg-amber-50 rounded-xl transition-colors"
                        >
                          <LayoutDashboard className="h-3.5 w-3.5" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Link
                        href="/auth/login"
                        onClick={() => setAccountDropdownOpen(false)}
                        className="block px-4 py-2 text-xs font-semibold hover:bg-neutral-100 hover:text-amber-600 rounded-xl transition-colors"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/auth/register"
                        onClick={() => setAccountDropdownOpen(false)}
                        className="block px-4 py-2 text-xs font-semibold hover:bg-neutral-100 hover:text-amber-600 rounded-xl transition-colors"
                      >
                        Create Account
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Wishlist Icon */}
            <Link
              href="/wishlist"
              className="relative p-2 text-neutral-700 hover:text-amber-600 transition-colors rounded-full hover:bg-neutral-100"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
            </Link>

            {/* Cart Icon with Item Count Badge */}
            <button
              onClick={openCart}
              className="relative p-2.5 rounded-full bg-amber-500 text-neutral-950 font-bold hover:bg-amber-600 transition-all hover:scale-105 shadow-md shadow-amber-500/20"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-neutral-950 text-[10px] font-extrabold text-white border-2 border-white">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <CartDrawer isOpen={isOpen} onClose={closeCart} />
    </>
  );
}
