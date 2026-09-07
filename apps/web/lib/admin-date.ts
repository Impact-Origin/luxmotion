/**
 * As datas do back-office, num sítio só.
 *
 * Havia oito formatadores locais, cada um com o seu feitio: uns em `en-US`
 * fixo, outros no idioma do browser, um chamava-se `formatDateTime` e mostrava
 * só o dia. A mesma lead lia-se "Sep 7, 2026" num separador e "07/09/2026"
 * noutro.
 *
 * O back-office é em português e quem o usa está em Portugal, por isso a data é
 * `pt-PT` e não segue o idioma do browser: um portátil configurado em inglês
 * passava a mostrar meses em inglês a quem lê "set" o dia inteiro.
 */

const DATA_HORA = new Intl.DateTimeFormat("pt-PT", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const DIA = new Intl.DateTimeFormat("pt-PT", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

/* Dois formatadores porque as palavras contam. `auto` dá "ontem", que se lê
   melhor do que "há 1 dia" — mas também dá "semana passada" para nove dias, e
   nove dias é precisamente o que interessa ver com precisão. Por isso `auto` só
   é usado onde a palavra é melhor, e o resto conta a unidade. */
const RELATIVO_AUTO = new Intl.RelativeTimeFormat("pt-PT", { numeric: "auto" });
const RELATIVO = new Intl.RelativeTimeFormat("pt-PT", { numeric: "always" });

const MINUTO = 60_000;
const HORA = 60 * MINUTO;
const DIA_MS = 24 * HORA;

function valida(ts: number | undefined | null): Date | null {
  if (ts === undefined || ts === null) return null;
  const d = new Date(ts);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** "07/09/2026, 20:14" */
export function formatAdminDate(ts: number | undefined | null): string {
  const d = valida(ts);
  return d ? DATA_HORA.format(d) : "—";
}

/** "07/09/2026", quando a hora não interessa. */
export function formatAdminDay(ts: number | undefined | null): string {
  const d = valida(ts);
  return d ? DIA.format(d) : "—";
}

/**
 * "há 3 dias", "ontem", "há 2 meses".
 *
 * É isto que faz saltar à vista um pedido esquecido: uma data absoluta numa
 * lista de vinte linhas não diz nada, "há 9 dias" diz.
 *
 * Os dias contam-se de meia-noite a meia-noite e não de 24 em 24 horas, senão
 * um pedido das 23h de ontem lido às 8h de hoje aparecia como "há 9 horas" em
 * vez de "ontem".
 */
export function formatAdminRelative(ts: number | undefined | null): string {
  const d = valida(ts);
  if (!d) return "—";

  const agora = Date.now();
  const decorrido = agora - d.getTime();

  // No futuro (relógios dessincronizados, dados semeados) não se inventa nada.
  if (decorrido < 0) return formatAdminDate(ts);
  if (decorrido < MINUTO) return "agora mesmo";
  if (decorrido < HORA) return RELATIVO.format(-Math.floor(decorrido / MINUTO), "minute");

  const meiaNoiteHoje = new Date(agora).setHours(0, 0, 0, 0);
  const meiaNoiteData = new Date(d).setHours(0, 0, 0, 0);
  const dias = Math.round((meiaNoiteHoje - meiaNoiteData) / DIA_MS);

  if (dias === 0) return RELATIVO.format(-Math.floor(decorrido / HORA), "hour");
  if (dias === 1) return RELATIVO_AUTO.format(-1, "day");
  // Até dois meses conta-se em dias: "há 45 dias" diz o que "mês passado" cala.
  if (dias <= 60) return RELATIVO.format(-dias, "day");
  if (dias < 365) return RELATIVO.format(-Math.round(dias / 30), "month");
  return RELATIVO.format(-Math.floor(dias / 365), "year");
}
