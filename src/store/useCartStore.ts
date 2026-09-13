'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '@/types';

interface CartState {
  items: CartItem[];
  promoCode: string | null;
  discount: number;
  deliverySlot: string;
  wishlist: string[];

  // Actions
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  setDeliverySlot: (slot: string) => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Computed helper getters
  getItemCount: () => number;
  getSubtotal: () => number;
  getDeliveryFee: () => number;
  getTax: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      promoCode: null,
      discount: 0,
      deliverySlot: 'Morning (8:00 AM - 11:00 AM)',
      wishlist: [],

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.product.id === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
              )
            };
          }
          return {
            items: [...state.items, { product, quantity }]
          };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.product.id !== productId)
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.product.id === productId ? { ...i, quantity } : i
          )
        }));
      },

      clearCart: () => {
        set({ items: [], promoCode: null, discount: 0 });
      },

      applyPromoCode: (code: string) => {
        const clean = code.trim().toUpperCase();
        const subtotal = get().getSubtotal();

        if (clean === 'FRESH10') {
          if (subtotal < 30) {
            return { success: false, message: 'FRESH10 requires a minimum order of $30' };
          }
          const discount = 10.0;
          set({ promoCode: 'FRESH10', discount });
          return { success: true, message: 'Coupon applied! $10 off your fresh basket.' };
        }

        if (clean === 'SUVIDHA') {
          const discount = 4.99;
          set({ promoCode: 'SUVIDHA', discount });
          return { success: true, message: 'Suvidha Special! Free delivery applied.' };
        }

        if (clean === 'WELCOME') {
          const discount = Math.round(subtotal * 0.15 * 100) / 100;
          set({ promoCode: 'WELCOME', discount });
          return { success: true, message: '15% Welcome discount applied!' };
        }

        return { success: false, message: 'Invalid promo code. Try FRESH10, SUVIDHA, or WELCOME.' };
      },

      removePromoCode: () => {
        set({ promoCode: null, discount: 0 });
      },

      setDeliverySlot: (slot: string) => {
        set({ deliverySlot: slot });
      },

      toggleWishlist: (productId: string) => {
        set((state) => {
          const exists = state.wishlist.includes(productId);
          return {
            wishlist: exists
              ? state.wishlist.filter((id) => id !== productId)
              : [...state.wishlist, productId]
          };
        });
      },

      isInWishlist: (productId: string) => {
        return get().wishlist.includes(productId);
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getSubtotal: () => {
        const sum = get().items.reduce((total, item) => total + item.product.price * item.quantity, 0);
        return Math.round(sum * 100) / 100;
      },

      getDeliveryFee: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        if (subtotal >= 50 || get().promoCode === 'SUVIDHA') return 0;
        return 4.99;
      },

      getTax: () => {
        const subtotal = get().getSubtotal();
        const discount = get().discount;
        const taxable = Math.max(0, subtotal - discount);
        return Math.round(taxable * 0.1 * 100) / 100;
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0) return 0;
        const discount = get().discount;
        const deliveryFee = get().getDeliveryFee();
        const tax = get().getTax();
        const total = Math.max(0, subtotal - discount + deliveryFee + tax);
        return Math.round(total * 100) / 100;
      }
    }),
    {
      name: 'vegimart_cart_storage'
    }
  )
);
