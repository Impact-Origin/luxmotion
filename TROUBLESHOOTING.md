# 🔧 Troubleshooting - Orders Table Empty

## Problema: Tabela de Orders está vazia no Convex

### Checklist de Verificação

#### 1. ✅ Verificar Variável de Ambiente

Certifique-se de que `NEXT_PUBLIC_BACKEND_API_BASE_URL` está configurada corretamente:

**Arquivo:** `apps/web/.env.local`

```env
# Deve apontar para o Convex, NÃO para localhost:8080
NEXT_PUBLIC_BACKEND_API_BASE_URL=https://your-project.convex.site
```

**⚠️ IMPORTANTE:** Se ainda estiver apontando para `http://localhost:8080`, as ordens não serão criadas no Convex!

#### 2. ✅ Verificar Deploy do Convex

Certifique-se de que o Convex foi deployado:

```bash
cd packages/convex
npx convex deploy
```

Após o deploy, você receberá uma URL. Use essa URL no `NEXT_PUBLIC_BACKEND_API_BASE_URL`.

#### 3. ✅ Verificar Logs do Convex

No Convex Dashboard:
1. Vá para https://dashboard.convex.dev
2. Selecione seu projeto
3. Vá para **Logs**
4. Procure por:
   - `[HTTP] POST /orders/init`
   - `[Orders] Creating order`
   - Erros relacionados

#### 4. ✅ Verificar Console do Navegador

Abra o DevTools (F12) e verifique:
- **Console**: Procure por erros de rede ou de API
- **Network**: Verifique se as requisições para `/orders/init` estão sendo feitas
  - URL deve ser: `https://your-project.convex.site/orders/init`
  - Status deve ser: `200 OK`

#### 5. ✅ Testar Endpoint Manualmente

Você pode testar o endpoint diretamente:

```bash
curl -X POST https://your-project.convex.site/orders/init \
  -H "Content-Type: application/json" \
  -d '{
    "departure": {
      "location": "Lisbon Airport",
      "placeId": "test",
      "lat": 38.7749,
      "lng": -9.1344
    },
    "arrival": {
      "location": "Lisbon City Center",
      "placeId": "test2",
      "lat": 38.7223,
      "lng": -9.1393
    },
    "passengers": 2,
    "departureDate": "2024-01-15T10:00:00"
  }'
```

Se funcionar, você deve receber uma resposta com `order.id` e ver a ordem no Convex Dashboard.

### Problemas Comuns

#### ❌ Erro: "Missing environment variable: NEXT_PUBLIC_BACKEND_API_BASE_URL"

**Solução:**
1. Crie/edite `apps/web/.env.local`
2. Adicione: `NEXT_PUBLIC_BACKEND_API_BASE_URL=https://your-project.convex.site`
3. Reinicie o servidor Next.js

#### ❌ Erro: "Network error" ou "Failed to fetch"

**Causas possíveis:**
1. URL do Convex incorreta
2. Convex não está deployado
3. Problema de CORS (improvável, mas possível)

**Solução:**
1. Verifique a URL no Convex Dashboard
2. Certifique-se de que o deploy foi feito
3. Verifique os logs do Convex

#### ❌ Orders não aparecem no Dashboard

**Causas possíveis:**
1. Endpoint não está sendo chamado
2. Mutation está falhando silenciosamente
3. Schema do Convex não está sincronizado

**Solução:**
1. Verifique os logs do Convex Dashboard
2. Verifique o console do navegador
3. Execute `npx convex dev` para ver logs em tempo real

### Debug Adicionado

Adicionei logs detalhados para ajudar no debug:

- `[HTTP] POST /orders/init - Request body:` - Mostra o que está sendo recebido
- `[HTTP] POST /orders/init - Success:` - Mostra a resposta
- `[HTTP] POST /orders/init - Error:` - Mostra erros
- `[Orders] Creating order with orderNumber:` - Mostra quando a ordem está sendo criada
- `[Orders] Order created successfully:` - Confirma criação

### Próximos Passos

1. **Verifique os logs do Convex Dashboard** - Procure pelas mensagens acima
2. **Verifique o console do navegador** - Procure por erros de rede
3. **Teste o endpoint manualmente** - Use o curl acima
4. **Verifique a variável de ambiente** - Certifique-se de que está apontando para o Convex

### Se Nada Funcionar

1. Execute `npx convex dev` em um terminal separado
2. Tente criar uma ordem pelo frontend
3. Observe os logs em tempo real
4. Compartilhe os logs para análise
