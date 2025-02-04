import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  favoriterecipes: [], // Updated to handle favorite articles
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    toggleFavorite: (state, action) => {
      const recipe = action.payload;
      const index = state.favoriterecipes.findIndex(
        (item) => item.idFood === recipe.idFood
      );
      if (index === -1) {
        state.favoriterecipes.push(recipe);
      } else {
        state.favoriterecipes.splice(index, 1);
      }
    },
  },
});

export const { toggleFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
