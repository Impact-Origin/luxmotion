#!/usr/bin/env sh
set -e

# As funções do Convex são publicadas ANTES do site, e não depois.
#
# Até aqui o build do Vercel só construía o Next, e o Convex era publicado à
# mão. Bastou uma vez esquecer para o site novo ir buscar uma função que ainda
# não existia: o checkout respondia "algo correu mal" a quem tentava reservar.
#
# A ordem importa e é esta. Publicar funções novas não parte o site antigo —
# ele simplesmente não as chama. O contrário parte.
#
# Sem CONVEX_DEPLOY_KEY nas variáveis do Vercel isto não publica nada e o build
# corre como sempre correu: um aviso é melhor do que um deploy que falha.
if [ -n "$CONVEX_DEPLOY_KEY" ]; then
  echo "→ a publicar as funções do Convex antes do site"
  (cd packages/convex && npx convex deploy -y)
else
  echo "⚠ CONVEX_DEPLOY_KEY não está definido: este build NÃO publica as funções"
  echo "  do Convex. Se alguma função nova for necessária ao site, publica-a à"
  echo "  mão com 'npx convex deploy' ANTES de fazer merge."
fi

pnpm build
