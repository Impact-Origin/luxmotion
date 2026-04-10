# Configuração da Integração com Instagram

Este documento explica como configurar a integração com a Instagram Graph API para exibir posts e estatísticas atualizadas do Instagram na seção "Follow us on Social Media".

## Pré-requisitos

1. **Conta do Instagram Business ou Creator**: A conta do Instagram precisa ser uma conta Business ou Creator (não pode ser uma conta pessoal).

2. **Facebook Page conectada**: A conta do Instagram precisa estar conectada a uma Facebook Page.

3. **App do Facebook**: Você precisa criar um app no Facebook Developers.

## Passo a Passo

### 1. Criar um App no Facebook Developers

1. Acesse [Facebook Developers](https://developers.facebook.com/)
2. Clique em "Meus Apps" → "Criar App"
3. Escolha o tipo de app: "Outro" ou "Negócios"
4. Preencha os dados do app e clique em "Criar App"

### 2. Adicionar o Produto Instagram Graph API

1. No dashboard do seu app, vá em "Adicionar Produto"
2. Procure por "Instagram Graph API" e clique em "Configurar"
3. Siga as instruções para configurar o produto

### 3. Obter o Access Token

#### Opção A: Token de Longa Duração (Recomendado)

1. No dashboard do app, vá em "Ferramentas" → "Explorador da API do Graph"
2. Selecione seu app no dropdown superior
3. Clique em "Gerar Token de Acesso"
4. Selecione as permissões necessárias:
   - `instagram_basic`
   - `pages_read_engagement`
   - `pages_show_list`
5. Copie o token gerado (este é um token de curta duração)

#### Converter para Token de Longa Duração

1. Use a ferramenta "Token Debugger" do Facebook para converter o token
2. Ou faça uma requisição HTTP:

```bash
curl -X GET "https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id={APP_ID}&client_secret={APP_SECRET}&fb_exchange_token={SHORT_LIVED_TOKEN}"
```

Substitua:
- `{APP_ID}`: ID do seu app do Facebook
- `{APP_SECRET}`: Secret do seu app (encontrado em Configurações → Básico)
- `{SHORT_LIVED_TOKEN}`: O token de curta duração obtido anteriormente

### 4. Obter o Instagram Business Account ID

1. No Graph API Explorer, faça uma requisição GET para:
   ```
   https://graph.facebook.com/v18.0/me/accounts?access_token={ACCESS_TOKEN}
   ```
2. Encontre a página do Facebook conectada ao Instagram
3. Use o `id` da página para fazer outra requisição:
   ```
   https://graph.facebook.com/v18.0/{PAGE_ID}?fields=instagram_business_account&access_token={ACCESS_TOKEN}
   ```
4. O `instagram_business_account.id` é o `INSTAGRAM_ACCOUNT_ID` que você precisa

### 5. Configurar Variáveis de Ambiente no Convex

No dashboard do Convex, adicione as seguintes variáveis de ambiente:

1. **INSTAGRAM_ACCESS_TOKEN**: O token de longa duração obtido no passo 3
2. **INSTAGRAM_ACCOUNT_ID**: O ID da conta do Instagram Business obtido no passo 4

#### Como adicionar no Convex:

1. Acesse o dashboard do Convex
2. Vá em "Settings" → "Environment Variables"
3. Adicione cada variável:
   - Nome: `INSTAGRAM_ACCESS_TOKEN`
   - Valor: Seu token de longa duração
   - Nome: `INSTAGRAM_ACCOUNT_ID`
   - Valor: O ID da conta do Instagram

## Testando a Integração

Após configurar as variáveis de ambiente, a seção "Follow us on Social Media" na landing page irá:

1. Buscar automaticamente os últimos 6 posts do Instagram
2. Exibir o número de posts, seguidores e seguindo
3. Mostrar a foto de perfil do Instagram
4. Atualizar os dados sempre que a página for carregada

## Troubleshooting

### Erro: "Instagram access token not configured"
- Verifique se a variável `INSTAGRAM_ACCESS_TOKEN` está configurada no Convex

### Erro: "Instagram account ID not configured"
- Verifique se a variável `INSTAGRAM_ACCOUNT_ID` está configurada no Convex

### Erro: "Instagram API error: 400"
- Verifique se o token ainda é válido (tokens expiram após ~60 dias)
- Verifique se a conta do Instagram é Business ou Creator
- Verifique se a conta está conectada a uma Facebook Page

### Erro: "Instagram API error: 401"
- O token pode ter expirado - gere um novo token de longa duração
- Verifique se o token tem as permissões corretas

### Posts não aparecem
- Verifique se há posts públicos na conta do Instagram
- Verifique os logs do Convex para ver erros específicos
- A seção usará posts fallback (imagens locais) se a API falhar

## Renovação do Token

Tokens de longa duração expiram após aproximadamente 60 dias. Para renovar:

1. Gere um novo token de curta duração
2. Converta para token de longa duração
3. Atualize a variável `INSTAGRAM_ACCESS_TOKEN` no Convex

## Limitações da API

- A API do Instagram tem limites de rate limiting (cerca de 200 requisições por hora por usuário)
- Apenas posts públicos são retornados
- Alguns campos podem não estar disponíveis dependendo das permissões do token

## Referências

- [Instagram Graph API Documentation](https://developers.facebook.com/docs/instagram-api)
- [Facebook Graph API Explorer](https://developers.facebook.com/tools/explorer/)
- [Token Debugger](https://developers.facebook.com/tools/debug/accesstoken/)
