import { createSlice } from "@reduxjs/toolkit";

// Функция для загрузки корзины из localStorage
const loadCartFromStorage = () => {
  const savedCart = localStorage.getItem("cart");
  return savedCart ? JSON.parse(savedCart) : [];
};

// Функция для сохранения корзины в localStorage
const saveCartToStorage = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: loadCartFromStorage(), // Загружаем корзину из localStorage при старте
  },
  reducers: {
    addToCart: (state, action) => {
      const itemIndex = state.items.findIndex(
        (item) => item.id === action.payload.id
      );

      const stock = action.payload.quantity; // ✅ Это количество товара в наличии

      if (itemIndex !== -1) {
        if (state.items[itemIndex].quantity < stock) {
          state.items[itemIndex].quantity += 1;
        }
      } else {
        state.items.push({
          ...action.payload,
          quantity: 1,
          stock, // ✅ Сохраняем ограничение
        });
      }

      saveCartToStorage(state.items);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      saveCartToStorage(state.items); // Обновляем localStorage
    },
    updateQuantity: (state, action) => {
      const itemIndex = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      if (itemIndex !== -1) {
        state.items[itemIndex].quantity += action.payload.change;
        if (state.items[itemIndex].quantity < 1) {
          state.items.splice(itemIndex, 1); // Удаляем товар, если количество стало 0
        }
      }
      saveCartToStorage(state.items); // Обновляем localStorage
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem("cart");
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
