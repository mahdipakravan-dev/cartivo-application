"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  partId: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (partId: number) => void;
  setQuantity: (partId: number, quantity: number) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item, quantity = 1) =>
        set((state) => {
          const current = state.items.find((cartItem) => cartItem.partId === item.partId);
          if (current) {
            return {
              items: state.items.map((cartItem) =>
                cartItem.partId === item.partId
                  ? { ...cartItem, quantity: cartItem.quantity + quantity }
                  : cartItem
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity }] };
        }),
      removeItem: (partId) =>
        set((state) => ({ items: state.items.filter((item) => item.partId !== partId) })),
      setQuantity: (partId, quantity) =>
        set((state) => ({
          items: quantity < 1
            ? state.items.filter((item) => item.partId !== partId)
            : state.items.map((item) => item.partId === partId ? { ...item, quantity } : item),
        })),
      clear: () => set({ items: [] }),
    }),
    { name: "cartivo-cart", version: 1 }
  )
);
