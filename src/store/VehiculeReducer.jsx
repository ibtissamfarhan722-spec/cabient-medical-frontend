import { createSlice } from "@reduxjs/toolkit";

const VehiculeSlice = createSlice({
  name: "Vehicule",
  initialState: {
    list: [],
    nextId: 1
  },
  reducers: {
    ajouter: (state, action) => {
      state.list.push({
        IdVehicule: state.nextId,
        ...action.payload
      });
      state.nextId += 1;
    },

    modifier: (state, action) => {
      const index = state.list.findIndex(
        v => v.IdVehicule === action.payload.IdVehicule
      );
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },

    supprimer: (state, action) => {
      state.list = state.list.filter(
        v => v.IdVehicule !== action.payload
      );
    }
  }
});

export const { ajouter, modifier, supprimer } = VehiculeSlice.actions;
export default VehiculeSlice.reducer;
