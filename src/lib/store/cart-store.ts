"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  partId: number;
  sellerId: number;
  sellerName: string;
  name: string;
  displayedUnitPriceRial: number;
  quantity: number;
  imageUrl?: string;
  priceLockToken?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity" | "priceLockToken">, quantity?: number) => void;
  removeItem: (partId: number, sellerId: number) => void;
  setQuantity: (partId: number, sellerId: number, quantity: number) => void;
  updateItemPrice: (partId: number, sellerId: number, priceRial: number) => void;
  setPriceLock: (partId: number, sellerId: number, token?: string) => void;
  clear: () => void;
}

export function cartLineKey(partId: number, sellerId: number) {
  return `${partId}:${sellerId}`;
}

const isSameLine = (item: CartItem, partId: number, sellerId: number) =>
  item.partId === partId && item.sellerId === sellerId;

function withoutPriceLock(item: CartItem): CartItem {
  const line = { ...item };
  delete line.priceLockToken;
  return line;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item, quantity = 1) =>
        set((state) => {
          const current = state.items.find((cartItem) =>
            isSameLine(cartItem, item.partId, item.sellerId),
          );
          if (current) {
            return {
              items: state.items.map((cartItem) =>
                isSameLine(cartItem, item.partId, item.sellerId)
                  ? ({
                      ...withoutPriceLock(cartItem),
                      ...item,
                      quantity: cartItem.quantity + quantity,
                    })
                  : cartItem,
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity }] };
        }),
      removeItem: (partId, sellerId) =>
        set((state) => ({
          items: state.items.filter((item) => !isSameLine(item, partId, sellerId)),
        })),
      setQuantity: (partId, sellerId, quantity) =>
        set((state) => ({
          items: quantity < 1
            ? state.items.filter((item) => !isSameLine(item, partId, sellerId))
            : state.items.map((item) =>
                isSameLine(item, partId, sellerId)
                  ? { ...withoutPriceLock(item), quantity }
                  : item,
              ),
        })),
      updateItemPrice: (partId, sellerId, displayedUnitPriceRial) =>
        set((state) => {
          const current = state.items.find((item) => isSameLine(item, partId, sellerId));
          if (!current || current.displayedUnitPriceRial === displayedUnitPriceRial) return state;
          return {
            items: state.items.map((item) =>
              isSameLine(item, partId, sellerId)
                ? { ...withoutPriceLock(item), displayedUnitPriceRial }
                : item,
            ),
          };
        }),
      setPriceLock: (partId, sellerId, token) =>
        set((state) => {
          const current = state.items.find((item) => isSameLine(item, partId, sellerId));
          if (!current || current.priceLockToken === token) return state;
          return {
            items: state.items.map((item) => {
              if (!isSameLine(item, partId, sellerId)) return item;
              const line = withoutPriceLock(item);
              return token ? { ...line, priceLockToken: token } : line;
            }),
          };
        }),
      clear: () => set({ items: [] }),
    }),
    {
      name: "cartivo-cart",
      version: 2,
      migrate: (persistedState) => {
        const state = persistedState as { items?: Array<Partial<CartItem> & { price?: number }> };
        return {
          ...state,
          // A legacy line has no seller identity and cannot safely be ordered.
          items: (state.items ?? []).flatMap((item) => {
            const price = item.displayedUnitPriceRial ?? item.price;
            if (
              item.partId == null ||
              item.sellerId == null ||
              !item.sellerName ||
              !item.name ||
              price == null ||
              item.quantity == null
            ) {
              return [];
            }
            return [{
              partId: item.partId,
              sellerId: item.sellerId,
              sellerName: item.sellerName,
              name: item.name,
              displayedUnitPriceRial: Number(price),
              quantity: item.quantity,
              ...(item.imageUrl ? { imageUrl: item.imageUrl } : {}),
              ...(item.priceLockToken ? { priceLockToken: item.priceLockToken } : {}),
            } satisfies CartItem];
          }),
        };
      },
    },
  ),
);
