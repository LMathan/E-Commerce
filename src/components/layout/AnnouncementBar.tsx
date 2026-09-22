import Link from "next/link";
import { Star, Truck, RotateCcw, HelpCircle } from "lucide-react";

export function AnnouncementBar() {
  return (
    <div className="bg-neutral-950 text-white text-xs py-2 px-4 border-b border-neutral-800">
      <div className="mx-auto max-w-7xl flex items-center justify-between">
        {/* Left Announcement */}
        <div className="flex items-center space-x-2">
          <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
          <span className="font-medium text-neutral-300">
            <strong className="text-amber-400 font-semibold">Get 10% OFF</strong> on your first order
          </span>
          <span className="hidden md:inline text-neutral-600">|</span>
          <span className="hidden md:inline text-neutral-400">Free shipping over ₹999</span>
          <span className="hidden md:inline text-neutral-600">|</span>
          <span className="hidden md:inline text-neutral-400">Easy 30-day returns</span>
        </div>

        {/* Right Aux Links */}
        <div className="hidden sm:flex items-center space-x-6 text-neutral-400">
          <Link href="/account/orders" className="hover:text-amber-400 transition-colors">
            Track Order
          </Link>
          <Link href="/contact" className="hover:text-amber-400 transition-colors flex items-center gap-1">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Help</span>
          </Link>
          <span className="text-neutral-200 font-semibold">INR ₹</span>
        </div>
      </div>
    </div>
  );
}
