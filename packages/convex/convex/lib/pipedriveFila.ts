/**
 * A linha que cada formulário acrescenta para a lead ir parar ao Pipedrive.
 *
 * Fica numa função à parte por duas razões. A primeira é que são dez chamadas
 * iguais em dez ficheiros, e a segunda é que a linha de `pipedriveSync` tem de
 * ser escrita **na mesma transação** da submissão: escrita mais tarde, dentro
 * da action, duas submissões simultâneas do mesmo formulário liam ambas "ainda
 * não foi enviado" e criavam duas leads.
 */

import type { MutationCtx } from "../_generated/server";
import { internal } from "../_generated/api";
import type { TabelaLead } from "./pipedriveMapa";

export async function enfileirarLead(
  ctx: MutationCtx,
  tabela: TabelaLead,
  id: string,
): Promise<void> {
  const jaExiste = await ctx.db
    .query("pipedriveSync")
    .withIndex("by_origem", (q) => q.eq("origem", tabela).eq("origemId", id))
    .first();
  if (jaExiste) return;

  const agora = Date.now();
  await ctx.db.insert("pipedriveSync", {
    origem: tabela,
    origemId: id,
    estado: "pendente",
    tentativas: 0,
    criadoEm: agora,
    atualizadoEm: agora,
  });
  await ctx.scheduler.runAfter(0, internal.pipedrive.enviarLead, { tabela, id });
}

/* A reserva paga tem o equivalente em `pipedrive.enfileirarReserva`: como é
   chamada de dentro do `sendOrderPayload`, que é uma action, precisa de ser uma
   mutation e não uma função de ajuda. */
