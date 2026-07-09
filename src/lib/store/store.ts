import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { catalogReducer } from "@/lib/store/slices/catalog-slice";

const rootReducer = combineReducers({
  catalog: catalogReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type PreloadedRootState = Partial<RootState>;

export function makeStore(preloadedState?: PreloadedRootState) {
  if (preloadedState) {
    return configureStore({
      reducer: rootReducer,
      preloadedState,
      devTools: process.env.NODE_ENV !== "production",
    });
  }

  return configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== "production",
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];
