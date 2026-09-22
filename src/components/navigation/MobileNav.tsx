"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { X, User, Heart, ShoppingBag, Home, Grid3X3, Package, Info } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/utils/cn";
import { siteConfig } from "@/config/site";

interface NavLink {
  href: string;
  label: string;
  children?: Array<{ href: string; label: string }>;
}

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  links?: NavLink[];
}

const DEFAULT_LINKS: NavLink[] = [
  { href: "/shop", label: "Shop Catalog" },
  { href: "/shop?bestseller=true", label: "Best Sellers" },
  { href: "/shop?featured=true", label: "Featured" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Support" },
];

export function MobileNav({ isOpen, onClose, links = DEFAULT_LINKS }: MobileNavProps) {
  const { data: session } = useSession();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Trap focus inside drawer
  useEffect(() => {
    if (isOpen) {
      drawerRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[1100] bg-black/50"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        id="mobile-nav"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        tabIndex={-1}
        className={cn(
          "fixed inset-y-0 left-0 z-[1200] w-80 max-w-[90vw] bg-white shadow-2xl transition-transform duration-300 ease-in-out focus:outline-none flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
          <Link
            href="/"
            onClick={onClose}
            className="font-bold text-lg text-neutral-900"
          >
            {siteConfig.name}
          </Link>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto p-4" aria-label="Mobile navigation">
          <ul className="space-y-1">
            <li>
              <Link
                href="/"
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg"
              >
                <Home className="h-4 w-4" />
                Home
              </Link>
            </li>
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg"
                >
                  <Grid3X3 className="h-4 w-4" />
                  {link.label}
                </Link>
                {link.children && (
                  <ul className="ml-7 mt-1 space-y-1">
                    {link.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          onClick={onClose}
                          className="block px-3 py-2 text-sm text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
            <li className="pt-2 border-t border-neutral-100 mt-2">
              <Link
                href="/track-order"
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg"
              >
                <Package className="h-4 w-4" />
                Track Order
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg"
              >
                <Info className="h-4 w-4" />
                About
              </Link>
            </li>
          </ul>
        </nav>

        {/* Account section */}
        <div className="p-4 border-t border-neutral-100">
          {session ? (
            <div className="space-y-2">
              <Link
                href="/account"
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg"
              >
                <User className="h-4 w-4" />
                My Account
              </Link>
              <Link
                href="/account/wishlist"
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg"
              >
                <Heart className="h-4 w-4" />
                Wishlist
              </Link>
              <button
                onClick={() => { onClose(); signOut(); }}
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg w-full text-left"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <Link
                href="/login"
                onClick={onClose}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-medium bg-neutral-900 text-white rounded-lg hover:bg-neutral-700"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={onClose}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-medium border border-neutral-300 text-neutral-900 rounded-lg hover:bg-neutral-50"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
