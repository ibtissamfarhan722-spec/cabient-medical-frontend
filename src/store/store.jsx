import { configureStore } from "@reduxjs/toolkit";
import VehiculeSlice from "./VehiculeReducer"

export const store = configureStore({
    reducer : {
        Vehicules : VehiculeSlice
    }
})