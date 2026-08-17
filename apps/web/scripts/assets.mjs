#!/usr/bin/env node
/**
 * Guarda da pasta `public`.
 *
 * O `next.config.mjs` tem `images.unoptimized: true`, portanto os caminhos das
 * imagens não passam por optimizador nenhum e nada os valida no build: um
 * caminho errado é um 404 silencioso em produção, que só se descobre a olhar
 * para a página. Este script é o que falta.
 *
 *   node scripts/assets.mjs --partidas   referências que apontam para o vazio
 *   node scripts/assets.mjs --orfaos     ficheiros que ninguém referencia
 *   node scripts/assets.mjs              as duas coisas
 *
 * Sai com código 1 se houver referências partidas, para poder correr antes de
 * um commit. Os órfãos não fazem falhar: um ficheiro por usar é desperdício,
 * não avaria.
 */

import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const PUBLICO = join(RAIZ, "public");

/** Onde se procuram referências. */
const FONTES = ["app", "components", "lib", "hooks", "i18n", "messages"];
const EXTENSOES_FONTE = /\.(tsx?|jsx?|mjs|json|css)$/;
const EXTENSOES_ASSET = /\.(webp|png|jpe?g|svg|mp4|mov|gif|ico|avif|woff2?)$/i;

/**
 * Caminhos construídos a partir de variáveis, que nenhum grep apanha. Cada
 * entrada é um prefixo que se considera usado por inteiro.
 *
 * Só existe um construtor destes no projecto — `lib/fleet-vehicles-data.ts`,
 * onde `p()` cola o prefixo e a extensão dentro da função. Se aparecerem mais,
 * acrescentam-se aqui, senão o `--orfaos` manda apagar coisas em uso.
 */
const PREFIXOS_DINAMICOS = ["/fleet/v/"];

/** Pedidos pelo browser ou por links já partilhados; nunca são órfãos. */
const INTOCAVEIS = ["/favicon.png", "/og-luxmotion.jpg", "/robots.txt", "/sitemap.xml"];

/** Não é código nosso; não se varre. */
const PASTAS_IGNORADAS = new Set(["node_modules", ".next", ".git", "novas_imagens"]);

function percorrer(dir, encontrados = []) {
  for (const entrada of readdirSync(dir, { withFileTypes: true })) {
    if (PASTAS_IGNORADAS.has(entrada.name)) continue;
    const caminho = join(dir, entrada.name);
    if (entrada.isDirectory()) percorrer(caminho, encontrados);
    else encontrados.push(caminho);
  }
  return encontrados;
}

/** Todas as referências a `/algo.ext` encontradas nas fontes, com a origem. */
function lerReferencias() {
  const encontradas = new Map(); // caminho -> Set(ficheiro:linha)

  for (const pasta of FONTES) {
    const base = join(RAIZ, pasta);
    if (!existsSync(base)) continue;

    for (const ficheiro of percorrer(base)) {
      if (!EXTENSOES_FONTE.test(ficheiro)) continue;
      const linhas = readFileSync(ficheiro, "utf8").split("\n");

      linhas.forEach((linha, i) => {
        /* Aspas duplas, simples e crase: os três aparecem no projecto —
           `url('/x.webp')` no CSS em linha e `url(${badge.src})` no rodapé. */
        for (const m of linha.matchAll(/["'`](\/[^"'`\n]{2,200}?)["'`]/g)) {
          const caminho = m[1];
          if (!EXTENSOES_ASSET.test(caminho)) continue;
          if (caminho.startsWith("//")) continue; // protocolo relativo, é externo
          // Caminho construído com variável: quem o valida é PREFIXOS_DINAMICOS.
          if (caminho.includes("${")) continue;
          const onde = `${relative(RAIZ, ficheiro)}:${i + 1}`;
          encontradas.set(caminho, (encontradas.get(caminho) ?? new Set()).add(onde));
        }
      });
    }
  }
  return encontradas;
}

function ficheirosPublicos() {
  return percorrer(PUBLICO).map((f) => "/" + relative(PUBLICO, f).split(sep).join("/"));
}

function tamanho(url) {
  const caminho = join(PUBLICO, url.slice(1));
  try {
    return statSync(caminho).size;
  } catch {
    return 0;
  }
}

const mb = (bytes) => (bytes / 1e6).toFixed(1);

// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
const querPartidas = args.length === 0 || args.includes("--partidas");
const querOrfaos = args.length === 0 || args.includes("--orfaos");

const referencias = lerReferencias();
const publicos = new Set(ficheirosPublicos());

let houveErro = false;

if (querPartidas) {
  const partidas = [...referencias.entries()].filter(([caminho]) => !publicos.has(caminho));

  if (partidas.length === 0) {
    console.log("✔ referências partidas: nenhuma");
  } else {
    houveErro = true;
    console.log(`✘ referências partidas: ${partidas.length}\n`);
    for (const [caminho, sitios] of partidas.sort()) {
      console.log(`  ${caminho}`);
      for (const s of [...sitios].sort()) console.log(`      ${s}`);
    }
    console.log("");
  }
}

if (querOrfaos) {
  const usados = new Set(referencias.keys());
  const orfaos = [...publicos].filter(
    (u) =>
      !usados.has(u) &&
      !INTOCAVEIS.includes(u) &&
      !PREFIXOS_DINAMICOS.some((p) => u.startsWith(p)),
  );

  const total = orfaos.reduce((s, u) => s + tamanho(u), 0);
  console.log(
    `${orfaos.length === 0 ? "✔" : "•"} sem referência: ${orfaos.length} ficheiros, ${mb(total)} MB`,
  );

  /* Agrupado por pasta: uma lista de 245 caminhos não se lê, e o que interessa
     decidir é a pasta inteira. */
  const porPasta = new Map();
  for (const u of orfaos) {
    const partes = u.split("/").slice(1);
    const chave = partes.length > 1 ? partes.slice(0, 2).join("/") : "(raiz)";
    const atual = porPasta.get(chave) ?? { n: 0, bytes: 0, exemplos: [] };
    atual.n++;
    atual.bytes += tamanho(u);
    if (atual.exemplos.length < 2) atual.exemplos.push(u);
    porPasta.set(chave, atual);
  }

  for (const [pasta, d] of [...porPasta.entries()].sort((a, b) => b[1].bytes - a[1].bytes)) {
    console.log(`    ${pasta.padEnd(38)} ${String(d.n).padStart(4)} f  ${mb(d.bytes).padStart(7)} MB`);
  }

  if (args.includes("--lista")) {
    console.log("\n" + orfaos.sort().join("\n"));
  }
}

process.exit(houveErro ? 1 : 0);
