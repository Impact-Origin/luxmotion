# Análise detalhada: MBWay rejeitado → mostrar falha a vermelho

## Transfers vs Tours

- **Transfers (Orders):** checkout principal de transferências. Logs em **`[Orders]`** (orders.ts). Action: `orders.checkMbwayOrderStatus`. Frontend: `apps/web/components/checkout/confirmation-modal.tsx` (e customizable-checkout).
- **Tours:** modal de reserva de tours/eventos. Logs em **`[TourBookings]`** (tourBookings.ts). Action: `tourBookings.checkPaymentStatus`. Frontend: `apps/web/components/tours/tour-checkout-modal.tsx`.

Se no terminal só vês `[Orders] startPaymentAction` / `[Orders] startPayment`, estás no **checkout de transfers**. Os logs de rejeição MBWay para transfers estão em **`[Orders] checkMbwayOrderStatus`** (agora adicionados).

## Onde ver os logs

### Opção 1: Terminal (desenvolvimento)
Com o backend Convex a correr em modo dev:
```bash
cd packages/convex && npx convex dev
```
Todos os `console.log` aparecem **nesse terminal** quando:
- O IfThenPay chama o webhook (`/webhooks/ifthenpay/callback/mbway`)
- A action `checkPaymentStatus` é executada (polling do frontend)
- O handler do callback processa tour bookings

### Opção 2: Dashboard Convex (produção ou dev)
1. Abre https://dashboard.convex.dev
2. Seleciona o projeto
3. Menu **Logs** (ou **Functions** → escolher a function → ver logs)
4. Para HTTP: **Functions** → `http` → ver invocações e logs
5. Para actions: **Functions** → `tourBookings:checkPaymentStatus` ou `ifthenpay:checkMbwayStatus`

### O que procurar nos logs
- **`[Ifthenpay][mbway] Webhook received:`** – Se aparece ao rejeitar = o IfThenPay está a chamar o nosso URL. Ver `queryParams` (ex.: existe `status`? valor?).
- **`[Ifthenpay][mbway] Tour booking callback:`** – O que decidimos gravar: `paymentStatusToSet` = "completed" ou "failed".
- **`[TourBookings] checkPaymentStatus IfThenPay result:`** – O que a API IfThenPay devolveu: `resultStatus` (ex.: "020" = rejeitado), `isFailed`.
- **`[TourBookings] Setting payment failed for`** – Confirma que marcámos a reserva como failed.

---

## Fluxo completo (passo a passo)

### 1. Utilizador clica em Pagar com MBWay
- **Frontend:** `handlePay` → `tourBookings.startPaymentAction` com `method: "mbway"`, `phoneNumber`, etc.
- **Backend:** `startPaymentAction` chama IfThenPay `initMbway` → guarda `paymentRequestId` na reserva, devolve ao frontend.
- **Frontend:** Abre ecrã “À espera de confirmação MBWay” e:
  - Subscreve `subscribeToStatus(bookingNumber)` (query reativa).
  - Inicia **polling** com `checkPaymentStatus(bookingId)` de 5 em 5 segundos.

### 2. Utilizador rejeita no app MBWay
- O IfThenPay pode ou não chamar o nosso **webhook** (depende deles; na doc dizem que o callback é “após confirmação”, por isso pode não chamar em rejeição).
- O nosso **polling** chama `checkPaymentStatus`:
  - A action lê a reserva, chama `ifthenpay.checkMbwayStatus(requestId)`.
  - IfThenPay devolve algo como `Status: "020"` (rejeitado), `"101"` (expirado), `"122"` (recusado).
  - Se `result.status` estiver em `["020","101","122"]` → `setPaymentFailed(bookingNumber)` → DB `paymentStatus = "failed"`.
  - A query `subscribeToStatus` reage e devolve `paymentStatus: "failed"`.
- **Frontend:** No `useEffect` que depende de `paymentStatus`, quando `paymentStatus === "failed"`:
  - `setWaitingMbway(false)`, `setPaymentComplete(false)`, `setPaymentRejected(true)`.
  - Ou, se o “failed” vier primeiro do **polling** (sem passar pela query), o callback do polling faz `setWaitingMbway(false)` e `setPaymentRejected(true)` — **mas não fazia `setPaymentComplete(false)`** (bug corrigido em baixo).

### 3. Possíveis causas de “mostrar pago” quando foi rejeitado
1. **Polling só ao fim de 5s** – Primeira verificação tardia; se entretanto o webhook marcar “completed”, o UI fica em sucesso.
2. **No callback do polling não se limpava sucesso** – Se por qualquer razão `paymentComplete` ficasse true, ao receber “failed” no polling só se punha `paymentRejected` e não `setPaymentComplete(false)` → o UI continuava a mostrar sucesso.
3. **Webhook a marcar “completed”** – Se o IfThenPay chamar o callback mesmo em rejeição (sem `status` de falha), nós marcávamos “completed”. Já existe proteção: não sobrescrever “failed” com “completed” e, se vier `status` de falha no URL, marcar “failed”.
4. **Query não reativa a “failed”** – Só subscrevemos quando `waitingMbway || paymentComplete`; ao pôr `paymentRejected(true)` e `waitingMbway(false)`, deixamos de subscrever. O estado `paymentRejected` já fica true no React, por isso o UI de “rejeitado” deve aparecer. O problema era mais o ponto 1 e 2.

---

## Correções aplicadas no código

1. **Polling:** primeira verificação **imediatamente** ao entrar em “À espera MBWay”, e depois de **3 em 3 segundos** (antes era 5s e só a primeira ao fim de 5s). Assim “failed” aparece muito mais rápido.
2. **Polling:** quando `result?.paymentStatus === "failed"` → além de `setPaymentRejected(true)` e `setWaitingMbway(false)`, chamar **`setPaymentComplete(false)`** para nunca deixar o ecrã de sucesso ativo quando o backend diz falha.
3. **UI rejeitado:** bloco “Rejeitaste o pagamento” com estilo **vermelho** (fundo `bg-red-50`, borda `border-red-200`, texto `text-red-700`, ícone X vermelho) para ficar óbvio que é falha.
4. **Logs:** já existem no webhook MBWay e em `checkPaymentStatus`; usar o terminal do `npx convex dev` ou o Dashboard Convex para analisar.

---

## Resumo: onde analisar

| Onde | O quê |
|------|--------|
| **Terminal** onde corre `npx convex dev` | Todos os `console.log` do backend (webhook + actions). |
| **Dashboard Convex → Logs** | Mesmos logs em produção ou ao usar deploy. |
| **Dashboard Convex → Functions → http** | Pedidos ao webhook IfThenPay (URL, método, etc.). |
| **Dashboard Convex → Functions → tourBookings:checkPaymentStatus** | Cada vez que o frontend faz polling e o que a IfThenPay devolveu. |

Com as correções acima, ao rejeitar no MBWay:
- O backend marca a reserva como `paymentStatus: "failed"` (via polling ou webhook com `status` de falha).
- O frontend mostra o ecrã de **pagamento rejeitado a vermelho** e não volta a mostrar “Pagamento feito”.
