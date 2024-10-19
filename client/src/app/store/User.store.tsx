import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { UserType } from "../types/User.type";

type StoreType = {
  user: UserType;
  isAuthenticated: boolean;
  // addToCart: (product: IProduct) => void;
  // removeFromCart: (product: IProduct) => void;
  // decreaseQuantity: (product: IProduct) => void;
};

export const useCartStore = create<StoreType>()(
  devtools((set) => ({
    user: { id: "", email: "", isActivated: false },
    isAuthenticated: false,
    setAuth: (user: UserType) => set({ user }),
    // addToCart: (product: IProduct) =>
    //   set(
    //     (state) => {
    //       const index = state.cart.findIndex((item) => item.id === product.id);
    //       const updatedCart = [...state.cart];

    //       if (index !== -1) {
    //         // If product exists in the cart, increase the quantity
    //         updatedCart[index].quantity = (updatedCart[index].quantity || 1) + 1;
    //       } else {
    //         // If product doesn't exist in the cart, add it with quantity 1
    //         updatedCart.push({ ...product, quantity: 1 });
    //       }

    //       return {
    //         cart: updatedCart,
    //         totalPrice: Math.round((state.totalPrice + product.price) * 100) / 100,
    //       };
    //     },
    //     false,
    //     'addToCart'
    //   ),
  }))
);
