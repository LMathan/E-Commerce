"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, Heart, User } from "lucide-react";
import { useCartContext } from "@/components/providers/CartProvider";
import { cn } from "@/utils/cn";

export function BottomNav() {
  const pathname = usePathname();
  const { itemCount } = useCartContext();

  // Hide bottom nav on admin routes
  if (pathname.startsWith("/admin")) return null;

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/shop", label: "Shop", icon: ShoppingBag, badge: itemCount > 0 ? itemCount : null },
    { href: "/wishlist", label: "Wishlist", icon: Heart },
    { href: "/account", label: "Account", icon: User },
  ];

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-lg border-t border-neutral-200/90 py-2 px-3 lg:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200",
                isActive
                  ? "text-amber-600 font-extrabold"
                  : "text-neutral-500 hover:text-neutral-900 font-medium"
              )}
            >
              <div className="relative">
                <Icon className={cn("h-5 w-5", isActive && "stroke-[2.5px] scale-110")} />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-2.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] font-black text-neutral-950">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight">{item.label}</span>
              {isActive && (
                <span className="absolute -bottom-1 h-1 w-5 rounded-full bg-amber-500" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
