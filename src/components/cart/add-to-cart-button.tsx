"use client";

import { useState } from "react";
import { Check, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/cart-store";

interface AddToCartButtonProps {
  partId: number;
  name: string;
  price: number;
  imageUrl?: string;
}

export function AddToCartButton({ partId, name, price, imageUrl }: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);

  const add = () => {
    addItem({ partId, name, price, ...(imageUrl ? { imageUrl } : {}) });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  return (
    <Button type="button" size="lg" onClick={add} className="mt-5 h-12 w-full rounded-xl text-base shadow-lg shadow-blue-950/15">
      {added ? <><Check className="size-5" /> به سبد اضافه شد</> : <><ShoppingCart className="size-5" /> افزودن به سبد خرید</>}
    </Button>
  );
}
