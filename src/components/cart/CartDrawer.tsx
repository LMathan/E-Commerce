"use client";

import Link from "next/link";
import Image from "next/image";
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { useCartContext } from "@/components/providers/CartProvider";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/utils/currency";
import { cn } from "@/utils/cn";
import { useEffect, useRef } from "react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, itemCount, isLoading, removeItem, updateQuantity } = useCartContext();
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      drawerRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const subtotal = items.reduce((sum, item) => sum + (item.unitPrice || item.price || 0) * item.quantity, 0);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[1100] bg-black/30 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Shopping cart — ${itemCount} items`}
        tabIndex={-1}
        className={cn(
          "fixed inset-y-0 right-0 z-[1200] w-96 max-w-full bg-white shadow-2xl transition-transform duration-300 ease-in-out focus:outline-none flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-neutral-700" />
            <h2 className="font-semibold text-neutral-900">
              Cart {itemCount > 0 && <span className="text-neutral-400">({itemCount})</span>}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close cart"
            className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <ShoppingBag className="h-12 w-12 text-neutral-200 mb-4" />
              <p className="font-medium text-neutral-900 mb-1">Your cart is empty</p>
              <p className="text-sm text-neutral-500 mb-6">Add some products to get started</p>
              <Link
                href="/shop"
                onClick={onClose}
                className="text-sm font-medium text-neutral-900 underline underline-offset-4"
              >
                Continue shopping
              </Link>
            </div>
          ) : (
            <ul className="space-y-4" aria-label="Cart items">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex gap-3 pb-4 border-b border-neutral-100 last:border-0"
                >
                  {/* Image */}
                  <div className="relative h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden bg-neutral-100">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.productName}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="w-full h-full bg-neutral-100" />
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/product/${item.productSlug || item.productId}`}
                      onClick={onClose}
                      className="text-sm font-medium text-neutral-900 hover:underline line-clamp-2"
                    >
                      {item.productName}
                    </Link>

                    <p className="text-sm font-semibold text-neutral-900 mt-1">
                      {formatCurrency((item.unitPrice || item.price || 0) * item.quantity)}
                    </p>

                    {/* Quantity control */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={isLoading || item.quantity <= 1}
                        aria-label="Decrease quantity"
                        className="p-1 rounded-md hover:bg-neutral-100 disabled:opacity-40 transition-colors"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="text-sm font-medium w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={isLoading}
                        aria-label="Increase quantity"
                        className="p-1 rounded-md hover:bg-neutral-100 disabled:opacity-40 transition-colors"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        disabled={isLoading}
                        aria-label={`Remove ${item.productName} from cart`}
                        className="ml-auto p-1 text-neutral-400 hover:text-red-500 rounded-md transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 py-4 border-t border-neutral-100 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600">Subtotal</span>
              <span className="font-semibold text-neutral-900">{formatCurrency(subtotal)}</span>
            </div>
            <p className="text-xs text-neutral-400">Shipping and taxes calculated at checkout</p>
            <Button
              asChild
              className="w-full"
              size="lg"
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              <Link href="/checkout" onClick={onClose}>
                Checkout
              </Link>
            </Button>
            <Button variant="ghost" className="w-full" size="sm" asChild>
              <Link href="/cart" onClick={onClose}>
                View Full Cart
              </Link>
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
