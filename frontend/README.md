# Aesthetic Aroma — Frontend

React 19 + TypeScript + Vite storefront and staff portal for the Aesthetic Aroma
luxury vegetarian cafe.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Vite dev server on http://localhost:5173 |
| `npm run build` | Type-check (`tsc --noEmit`) then production build to `dist/` |
| `npm run typecheck` | Type-check only |
| `npm run lint` | oxlint |
| `npm test` | Vitest suite (single run) |

## Environment

Copy `.env.example` to `.env` and point it at the API:

```
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

Use the same host the API is reached on. Session-cookie auth does not work when the
site is loaded from `localhost` while the API is called on `127.0.0.1` (different
site for `SameSite`), so keep both on the same host name.

## Structure

```
src/
  admin/        Staff portal screens (guarded by AdminAuthContext)
  components/   layout · home sections · menu · cart · ui
  context/      CartContext, AdminAuthContext
  pages/        Public storefront routes
  services/     API clients (one per backend app)
  styles/       luxury-theme.css — the single design-token + class layer
  test/         Vitest setup and unit tests
```

All visual styling comes from `src/styles/luxury-theme.css`. Components should use its
classes (`aa-card`, `aa-tile`, `btn-gold`, …) and CSS variables rather than new colour
literals; there is no Tailwind in this project.
