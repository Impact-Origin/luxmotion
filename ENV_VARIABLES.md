# Environment variables

After transferring the Convex project (or creating a new one), set variables in **three places**.

---

## 0. Convex project link (`packages/convex/.env`)

This file links your local code to a Convex deployment. The Convex CLI often writes these when you run `npx convex dev`; if you transferred the project, set them manually:

| Variable | What to put |
|----------|-------------|
| **CONVEX_DEPLOYMENT** | `dev:<name>` or `prod:<name>`. The `<name>` is the deployment name (e.g. `blessed-wildcat-444`). Find it in [Convex Dashboard](https://dashboard.convex.dev) → your project → URL or Settings. |
| **CONVEX_URL** | The deployment URL, e.g. `https://<deployment-name>.convex.cloud` or your custom domain (e.g. `https://convex.easytransferportugal.com`). No trailing slash. |

**Easiest:** From the repo root run `pnpm --filter @workspace/convex dev`. If the project isn’t linked, Convex will prompt you to create/select a deployment and will write `CONVEX_DEPLOYMENT` and `CONVEX_URL` into `packages/convex/.env` for you.

---

## 1. Web app (`apps/web/`)

Create `apps/web/.env` or `apps/web/.env.local` and add:

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_CONVEX_URL` | Yes | Convex deployment URL (e.g. `https://your-deployment.convex.cloud` or custom domain like `https://convex.easytransferportugal.com`) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes | From [Clerk Dashboard](https://dashboard.clerk.com) |
| `CLERK_SECRET_KEY` | Yes | From Clerk Dashboard |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Yes | From Google Cloud Console |
| `NEXT_PUBLIC_SITE_URL` or `NEXT_PUBLIC_APP_URL` | No | Public site URL for SEO/sitemap (e.g. `https://easytransferportugal.com`) |
| `NEXT_PUBLIC_BACKEND_API_BASE_URL` | No | Only if you use a separate backend API |

---

## 2. Convex (Dashboard)

In **Convex Dashboard** → your project → **Settings** → **Environment Variables**, add these. They are used by Convex functions (packages/convex), not by the Next.js app.

### Auth
| Variable | Required | Description |
|----------|----------|-------------|
| `CLERK_JWT_ISSUER_DOMAIN` | Yes | Clerk JWT issuer (e.g. `https://climbing-puma-3.clerk.accounts.dev`) – same as in Clerk Dashboard → JWT template |

### Payments (IfThenPay)
| Variable | Required | Description |
|----------|----------|-------------|
| `IFTHENPAY_MB_KEY` | Yes | Multibanco key |
| `IFTHENPAY_MBWAY_KEY` | Yes | MB Way key |
| `IFTHENPAY_CCARD_KEY` | Yes | Credit card key |
| `IFTHENPAY_ANTIPHISHING_KEY` | Yes | Anti-phishing key (min 15 chars) |
| `IFTHENPAY_USE_TEST_AMOUNT` | No | Set to `1` to use test amounts |

### Webhooks
| Variable | Required | Description |
|----------|----------|-------------|
| `INTEGRATION_WEBHOOK_HEADER_AUHTORIZATION` | Yes | Secret header value; payment provider must send this when calling your `/payments/webhook` |
| `EASYTRANSFER_ORDER_WEBHOOK_URL` | No | URL to send order payloads (default in code if not set) |
| `EASYTRANSFER_LEAD_WEBHOOK_URL` | No | URL to send lead payloads (default in code if not set) |
| `ORDERS_API_SECRET` | No | Used in HTTP actions for orders API auth |

### Flights (Amadeus)
| Variable | Required | Description |
|----------|----------|-------------|
| `AMADEUS_CLIENT_ID` | Yes | Amadeus API client ID |
| `AMADEUS_CLIENT_SECRET` | Yes | Amadeus API client secret |

### Instagram (optional)
| Variable | Required | Description |
|----------|----------|-------------|
| `INSTAGRAM_ACCESS_TOKEN` | No | Instagram Graph API access token |
| `INSTAGRAM_ACCOUNT_ID` | No | Instagram business account ID |

---

## Quick checklist after Convex project transfer

1. **Convex Dashboard**  
   - New project → **Settings** → **Environment Variables**: add all Convex variables above.

2. **apps/web/.env**  
   - Set `NEXT_PUBLIC_CONVEX_URL` to the **new** deployment URL (or your custom domain).  
   - Keep Clerk and Google Maps keys (or replace if you created a new Clerk app).

3. **Clerk**  
   - If you use a new Clerk application, update Clerk keys in `apps/web/.env` and set `CLERK_JWT_ISSUER_DOMAIN` in Convex to the new JWT issuer.

4. **Payment provider**  
   - If Convex URL changed (e.g. custom domain), update webhook URL in IfThenPay to your new Convex HTTP URL (e.g. `https://your-convex-url/payments/webhook`).

---

## Troubleshooting: "Convex não se liga" / connection issues

- **Um deployment só**  
  O `CONVEX_DEPLOYMENT` no teu `.env` (ex.: `prod:clean-starling-300`) tem de ser **o mesmo** deployment que aparece no Dashboard onde configuras o custom domain e as env vars. Se o erro ou o link do Dashboard mostrarem outro nome (ex.: `lovely-lemming-363`), estás noutro projeto/deployment — confirma no Dashboard qual é o deployment correto e usa esse nome em todo o lado.

- **Custom domain**  
  Em [Convex Dashboard](https://dashboard.convex.dev) → teu projeto → **Settings** → **Custom domain** (ou equivalente), o domínio `convex.easytransferportugal.com` tem de estar associado a **esse** deployment. Sem isto, o browser não consegue falar com o teu backend através do custom domain.

- **Testar sem custom domain**  
  Em `apps/web/.env` põe temporariamente:
  ```env
  NEXT_PUBLIC_CONVEX_URL=https://clean-starling-300.convex.cloud
  ```
  (troca `clean-starling-300` pelo nome do teu deployment). Reinicia o dev server. Se assim funcionar, o problema é a configuração do custom domain no Convex. Se não funcionar, o problema são as env vars (ex.: `CLERK_JWT_ISSUER_DOMAIN`) no Dashboard **desse** deployment.
