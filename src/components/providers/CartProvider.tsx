"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string | null;
  productName: string;
  productSlug?: string;
  variantTitle?: string | null;
  unitPrice: number;
  price?: number;
  quantity: number;
  image?: string | null;
  subtotal: number;
}

export interface Cart {
  cartId?: string;
  items: CartItem[];
  subtotal: number;
  count: number;
  coupon?: any;
}

interface AddItemParams {
  productId: string;
  variantId?: string;
  productName?: string;
  price?: number;
  image?: string | null;
  quantity?: number;
}

interface CartContextValue {
  cart: Cart;
  items: CartItem[];
  itemCount: number;
  isLoading: boolean;
  loading: boolean;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (params: AddItemParams | string, variantId?: string, quantity?: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>({ items: [], subtotal: 0, count: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);

  const refreshCart = useCallback(async () => {
    try {
      const res = await fetch("/api/cart");
      if (res.ok) {
        const data = await res.json();
        setCart({
          cartId: data.cartId,
          items: data.items || [],
          subtotal: data.subtotal || 0,
          count: data.count || 0,
          coupon: data.coupon,
        });
      }
    } catch {
      // Network error — silently fail
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addItem = async (
    param: AddItemParams | string,
    vId?: string,
    qty: number = 1
  ) => {
    setIsLoading(true);
    let productId: string;
    let variantId: string | undefined = vId;
    let quantity: number = qty;

    if (typeof param === "object") {
      productId = param.productId;
      variantId = param.variantId;
      quantity = param.quantity || 1;
    } else {
      productId = param;
    }

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, variantId, quantity }),
      });
      if (res.ok) {
        await refreshCart();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (itemId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/cart?itemId=${itemId}`, { method: "DELETE" });
      if (res.ok) {
        await refreshCart();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, quantity }),
      });
      if (res.ok) {
        await refreshCart();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const itemCount = cart.count;

  return (
    <CartContext.Provider
      value={{
        cart,
        items: cart.items,
        itemCount,
        isLoading,
        loading: isLoading,
        isOpen,
        openCart,
        closeCart,
        toggleCart,
        addItem,
        removeItem,
        updateQuantity,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCartContext must be used within CartProvider");
  return ctx;
}
