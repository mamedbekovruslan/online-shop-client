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

      if (itemIndex !== -1) {
        state.items[itemIndex].quantity += 1; // Если товар уже в корзине, увеличиваем кол-во
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }

      saveCartToStorage(state.items); // Сохраняем корзину в localStorage
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
  },
});

export const { addToCart, removeFromCart, updateQuantity } = cartSlice.actions;
export default cartSlice.reducer;
