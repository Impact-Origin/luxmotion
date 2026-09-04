import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { tabelaLead } from "./pipedrive";
import { ORIGENS, type TabelaLead } from "./lib/pipedriveMapa";

/**
 * O email que avisa que entrou um pedido novo.
 *
 * Havia três sítios onde um pedido podia ser visto — o back-office, o Pipedrive
 * e, em três formulários, a confirmação que sai para o cliente — e nenhum deles
 * chega a quem trata dos pedidos sem alguém ir lá ver. Pedidos ficaram por
 * responder. Isto empurra: por cada submissão sai um email para a caixa de
 * entrada de quem responde.
 *
 * O corpo do email é o mesmo mapeamento que alimenta o Pipedrive
 * (`lib/pipedriveMapa`), e isso é de propósito: é lá que está escrito, campo a
 * campo, o que pode sair da base de dados. IBAN, NIF, documentos e dados de
 * terceiros nunca entram no email porque não entram no mapeamento.
 *
 * Variáveis de ambiente no Convex:
 *   RESEND_API_KEY   — obrigatória; sem ela nenhum aviso sai
 *   RESEND_FROM      — remetente; tem de ser de um domínio verificado no Resend
 *   PEDIDOS_EMAIL    — opcional, para mudar o destino sem mexer no código
 *   ADMIN_BASE_URL   — opcional, base dos links para o back-office
 */

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const DEFAULT_FROM = "LuxMotion <onboarding@resend.dev>";
const DESTINO_POR_OMISSAO = "easytransferpt@gmail.com";
const ADMIN_POR_OMISSAO = "https://www.easytransferportugal.com/admin";

/** Onde é que cada formulário aparece no back-office. */
const LINK_BACKOFFICE: Record<TabelaLead, string> = {
  contactSubmissions: "/inbox?tipo=contactos",
  contactQuotes: "/inbox?tipo=orcamentos",
  tourInquiries: "/inbox?tipo=ultra-luxo",
  weddingQuoteSubmissions: "/inbox?tipo=casamentos",
  schoolQuoteSubmissions: "/inbox?tipo=escolas",
  corporateRequests: "/inbox?tipo=corporate",
  newsletterSubscriptions: "/inbox?tipo=newsletter",
  partnerLeads: "/partner-leads",
  partnerApplications: "/applications?tipo=parceiros",
  driverApplications: "/applications?tipo=condutores",
};

/* Um erro do Resend costuma ser passageiro (limite de envios, avaria de
   minutos). Três repetições espaçadas cobrem isso sem encher a caixa de
   entrada de duplicados. */
const ESPERAS_MS = [60_000, 10 * 60_000, 60 * 60_000];

function escapar(texto: string): string {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export const enviarAviso = internalAction({
  args: { tabela: tabelaLead, id: v.string(), tentativa: v.optional(v.number()) },
  handler: async (ctx, args): Promise<void> => {
    const tentativa = args.tentativa ?? 0;

    const lead = await ctx.runQuery(internal.pipedrive.mapearLead, {
      tabela: args.tabela,
      id: args.id,
    });
    if (!lead) {
      console.error(`[Aviso] ${args.tabela}/${args.id} não existe; aviso não enviado`);
      return;
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      // Não vale a pena repetir: uma variável de ambiente não aparece sozinha.
      console.error(
        `[Aviso] RESEND_API_KEY não está definida — o pedido ${args.tabela}/${args.id} ` +
          `ficou sem aviso por email. Está no back-office e no Pipedrive.`,
      );
      return;
    }

    const destino = process.env.PEDIDOS_EMAIL ?? DESTINO_POR_OMISSAO;
    const admin = (process.env.ADMIN_BASE_URL ?? ADMIN_POR_OMISSAO).replace(/\/$/, "");
    const link = `${admin}${LINK_BACKOFFICE[args.tabela]}`;

    const telefone = lead.pessoa.telefone;
    const contacto = [
      `<p style="margin:0 0 4px"><b>${escapar(lead.pessoa.nome)}</b></p>`,
      `<p style="margin:0 0 4px"><a href="mailto:${escapar(lead.pessoa.email)}">${escapar(lead.pessoa.email)}</a></p>`,
      telefone
        ? `<p style="margin:0"><a href="tel:${escapar(telefone.replace(/\s+/g, ""))}">${escapar(telefone)}</a></p>`
        : "",
      lead.organizacao ? `<p style="margin:4px 0 0">${escapar(lead.organizacao)}</p>` : "",
    ].join("");

    const html = `
      <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1c1b18">
        <p style="font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#9a7535;margin:0 0 8px">${escapar(ORIGENS[args.tabela])}</p>
        <h1 style="font-size:20px;margin:0 0 20px">${escapar(lead.titulo)}</h1>
        <div style="background:#faf8f4;border-radius:8px;padding:16px;margin:0 0 20px;font-size:14px">${contacto}</div>
        <div style="font-size:14px;line-height:1.6">${lead.nota ?? ""}</div>
        <p style="margin:24px 0 0">
          <a href="${link}" style="display:inline-block;background:#1c1b18;color:#fff;text-decoration:none;padding:10px 18px;border-radius:6px;font-size:14px">Abrir no back-office</a>
        </p>
      </div>
    `;

    try {
      const resposta = await fetch(RESEND_ENDPOINT, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM ?? DEFAULT_FROM,
          to: [destino],
          // Responder ao aviso responde ao cliente, sem copiar o endereço à mão.
          reply_to: lead.pessoa.email,
          subject: `${ORIGENS[args.tabela]}: ${lead.titulo}`,
          html,
        }),
        signal: AbortSignal.timeout(20_000),
      });

      if (resposta.ok) return;

      const detalhe = await resposta.text().catch(() => "");
      throw new Error(`Resend ${resposta.status}: ${detalhe.slice(0, 300)}`);
    } catch (erro) {
      const mensagem = erro instanceof Error ? erro.message : String(erro);
      const espera = ESPERAS_MS[tentativa];
      if (espera === undefined) {
        console.error(
          `[Aviso] ${args.tabela}/${args.id} falhou nas ${ESPERAS_MS.length + 1} tentativas: ${mensagem}. ` +
            `O pedido está no back-office (${link}).`,
        );
        return;
      }
      console.error(`[Aviso] ${args.tabela}/${args.id} falhou: ${mensagem}. A repetir.`);
      await ctx.scheduler.runAfter(espera, internal.avisoPedidos.enviarAviso, {
        tabela: args.tabela,
        id: args.id,
        tentativa: tentativa + 1,
      });
    }
  },
});
