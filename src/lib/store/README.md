# Redux Store

Redux is scoped to client components, but the store is created with a factory so
server-rendered routes can safely pass backend data without sharing state across
requests.

## Global Provider

`src/app/layout.tsx` mounts `StoreProvider` once for normal client state.

## Server Data Hydration

For server components that already fetched backend data, use the focused
hydrator for that domain:

```tsx
const { items: brands } = await getBrands({ size: 200 });

return (
  <>
    <CatalogHydrator brands={brands} />
    <ClientComponent />
  </>
);
```

If a route needs data available immediately at the first client render, create a
route-level provider with `createCatalogPreloadedState`:

```tsx
const preloadedState = createCatalogPreloadedState({ brands });

return (
  <StoreProvider preloadedState={preloadedState}>
    <ClientComponent />
  </StoreProvider>
);
```

Keep backend fetching in server functions under `src/lib/api`, and use slices to
store only serializable state needed by interactive client components.
