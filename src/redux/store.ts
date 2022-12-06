import AsyncStorage from "@react-native-async-storage/async-storage";
import { configureStore } from "@reduxjs/toolkit";
import { accountSlice } from "./accountSlice";
import { persistReducer, persistStore } from "redux-persist";

const persistConfig = {
  key: "accounts",
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, accountSlice.reducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (config) => config({ serializableCheck: false }),
});

export default store;
export const persistor = persistStore(store);
