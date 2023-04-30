import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers";

// the store so we can access these throughout the app
const store = configureStore({
    reducer: rootReducer,
});

export default store;
