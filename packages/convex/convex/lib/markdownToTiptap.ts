/**
 * Markdown → TipTap (ProseMirror) JSON.
 *
 * Os artigos gerados pela automação chegam em Markdown, mas `blogs.content`
 * guarda o documento do TipTap. O renderer do site
 * (apps/web/components/blogs/blog-article-content.tsx) só desenha um conjunto
 * fechado de nós e ignora silenciosamente tudo o resto, por isso este conversor
 * produz APENAS esses:
 *
 *   paragraph, heading (level 2 e 3), bulletList/listItem, orderedList,
 *   blockquote, codeBlock, horizontalRule, table/tableRow/tableHeader/tableCell
 *
 * e apenas estas marks: bold, italic, underline, strike, code, link.
 *
 * O que não souber converter nunca é deitado fora: vira parágrafo com o texto
 * cru e fica registado em `warnings`, para o chamador poder decidir não publicar.
 */

export type TiptapMark =
  | { type: "bold" | "italic" | "underline" | "strike" | "code" }
  | { type: "link"; attrs: { href: string; target: string } };

export type TiptapNode = {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TiptapNode[];
  text?: string;
  marks?: TiptapMark[];
};

export type TiptapDoc = { type: "doc"; content: TiptapNode[] };

export type ConversionResult = {
  doc: TiptapDoc;
  warnings: string[];
  /** Palavras de texto corrido, para as salvaguardas de comprimento. */
  wordCount: number;
  /** Nós de bloco de primeiro nível. */
  blockCount: number;
};

/* ------------------------------------------------------------------ inline */

function textNode(text: string, marks: TiptapMark[]): TiptapNode {
  return marks.length > 0 ? { type: "text", text, marks } : { type: "text", text };
}

/**
 * Divide uma linha em nós de texto com marks. A ordem importa: o código é
 * tratado primeiro para que ** e * dentro de `crases` não sejam interpretados.
 */
function parseInline(input: string, inherited: TiptapMark[] = []): TiptapNode[] {
  if (input === "") return [];

  const patterns: {
    re: RegExp;
    mark: (m: RegExpExecArray) => TiptapMark;
    /** O grupo que contém o texto a continuar a analisar. */
    group: number;
    /** O código não leva parsing por dentro. */
    literal?: boolean;
  }[] = [
    { re: /`([^`]+)`/, mark: () => ({ type: "code" }), group: 1, literal: true },
    {
      re: /\[([^\]]+)\]\(([^)\s]+)\)/,
      mark: (m) => ({
        type: "link",
        attrs: { href: m[2]!, target: "_blank" },
      }),
      group: 1,
    },
    // Não-guloso e a aceitar qualquer conteúdo: **negrito com *itálico* dentro**
    // tem de casar como negrito primeiro, e a recursão trata do itálico.
    { re: /\*\*([\s\S]+?)\*\*/, mark: () => ({ type: "bold" }), group: 1 },
    { re: /__([\s\S]+?)__/, mark: () => ({ type: "bold" }), group: 1 },
    { re: /~~([\s\S]+?)~~/, mark: () => ({ type: "strike" }), group: 1 },
    { re: /(?<![*\w])\*([^*]+)\*(?!\*)/, mark: () => ({ type: "italic" }), group: 1 },
    { re: /(?<![_\w])_([^_]+)_(?!_)/, mark: () => ({ type: "italic" }), group: 1 },
  ];

  let best: { index: number; match: RegExpExecArray; p: (typeof patterns)[0] } | null =
    null;
  for (const p of patterns) {
    const m = p.re.exec(input);
    if (m && (best === null || m.index < best.index)) {
      best = { index: m.index, match: m, p };
    }
  }

  if (!best) return [textNode(input, inherited)];

  const { match, p } = best;
  const before = input.slice(0, match.index);
  const after = input.slice(match.index + match[0].length);
  const innerText = match[p.group] ?? "";
  const innerMarks = [...inherited, p.mark(match)];

  const out: TiptapNode[] = [];
  if (before) out.push(...parseInline(before, inherited));
  if (innerText) {
    out.push(
      ...(p.literal
        ? [textNode(innerText, innerMarks)]
        : parseInline(innerText, innerMarks)),
    );
  }
  if (after) out.push(...parseInline(after, inherited));
  return out;
}

function paragraph(text: string): TiptapNode {
  return { type: "paragraph", content: parseInline(text) };
}

/* ------------------------------------------------------------------- blocos */

function isTableRow(line: string): boolean {
  return /^\s*\|.*\|\s*$/.test(line);
}

/** A linha separadora de uma tabela GFM: | --- | :---: | */
function isTableDivider(line: string): boolean {
  return /^\s*\|(\s*:?-{2,}:?\s*\|)+\s*$/.test(line);
}

function splitRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((c) => c.trim());
}

function cell(text: string, header: boolean): TiptapNode {
  return {
    type: header ? "tableHeader" : "tableCell",
    attrs: { colspan: 1, rowspan: 1, colwidth: null },
    content: [paragraph(text)],
  };
}

export function markdownToTiptap(
  markdown: string,
  options: { title?: string } = {},
): ConversionResult {
  const warnings: string[] = [];
  const content: TiptapNode[] = [];
  const normalisedTitle = normaliseForCompare(options.title ?? "");

  // Normaliza fins de linha e remove um bloco ```markdown ... ``` que envolva
  // o artigo todo, que os modelos gostam de acrescentar.
  let src = markdown.replace(/\r\n?/g, "\n").trim();
  const fenced = /^```(?:markdown|md)?\n([\s\S]*)\n```$/.exec(src);
  if (fenced) src = fenced[1]!.trim();

  const lines = src.split("\n");
  let i = 0;

  while (i < lines.length) {
    const line = lines[i]!;
    const trimmed = line.trim();

    // Linha vazia
    if (trimmed === "") {
      i++;
      continue;
    }

    // Separador
    if (/^(\*{3,}|-{3,}|_{3,})$/.test(trimmed)) {
      content.push({ type: "horizontalRule" });
      i++;
      continue;
    }

    // Heading. O H1 é rebaixado a 2: o título do artigo já é o H1 da página e o
    // renderer só desenha 2 e 3.
    const heading = /^(#{1,6})\s+(.*)$/.exec(trimmed);
    if (heading) {
      const hashes = heading[1]!.length;
      const text = heading[2]!.trim();
      // O H1 que repete o título é ruído: a página já o desenha como <h1>.
      // Um H1 diferente é conteúdo e só é rebaixado.
      if (hashes === 1 && normaliseForCompare(text) === normalisedTitle) {
        i++;
        continue;
      }
      const level = hashes <= 2 ? 2 : 3;
      if (hashes === 1) warnings.push("H1 no corpo rebaixado para H2");
      if (hashes > 3) warnings.push(`H${hashes} rebaixado para H3`);
      content.push({
        type: "heading",
        attrs: { level },
        content: parseInline(text),
      });
      i++;
      continue;
    }

    // Bloco de código
    if (/^```/.test(trimmed)) {
      const lang = trimmed.slice(3).trim();
      const body: string[] = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i]!.trim())) {
        body.push(lines[i]!);
        i++;
      }
      i++; // fecha a cerca
      content.push({
        type: "codeBlock",
        attrs: { language: lang || null },
        content: body.length ? [{ type: "text", text: body.join("\n") }] : [],
      });
      continue;
    }

    // Tabela
    if (isTableRow(line) && i + 1 < lines.length && isTableDivider(lines[i + 1]!)) {
      const headerCells = splitRow(line);
      const rows: TiptapNode[] = [
        {
          type: "tableRow",
          content: headerCells.map((c) => cell(c, true)),
        },
      ];
      i += 2; // cabeçalho + separador
      while (i < lines.length && isTableRow(lines[i]!)) {
        const cells = splitRow(lines[i]!);
        // Normaliza para o número de colunas do cabeçalho: uma linha curta
        // desalinhava o layout em flex do renderer.
        while (cells.length < headerCells.length) cells.push("");
        rows.push({
          type: "tableRow",
          content: cells.slice(0, headerCells.length).map((c) => cell(c, false)),
        });
        i++;
      }
      content.push({ type: "table", content: rows });
      continue;
    }

    // Citação
    if (/^>\s?/.test(trimmed)) {
      const body: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i]!.trim())) {
        body.push(lines[i]!.trim().replace(/^>\s?/, ""));
        i++;
      }
      content.push({
        type: "blockquote",
        content: body.filter((b) => b !== "").map(paragraph),
      });
      continue;
    }

    // Listas. As aninhadas são achatadas para irmãs: o renderer não desenha
    // listas dentro de listItem, e achatar preserva o texto em vez de o perder.
    const bullet = /^[-*+]\s+(.*)$/.exec(trimmed);
    const ordered = /^(\d+)[.)]\s+(.*)$/.exec(trimmed);
    if (bullet || ordered) {
      const isOrdered = Boolean(ordered);
      const items: TiptapNode[] = [];
      const start = isOrdered ? Number(ordered![1]) : 1;
      while (i < lines.length) {
        const raw = lines[i]!;
        const t = raw.trim();
        const indented = /^\s{2,}/.test(raw) && /^[-*+\d]/.test(t);
        if (indented) warnings.push("lista aninhada achatada");
        const b = /^[-*+]\s+(.*)$/.exec(t);
        const o = /^(\d+)[.)]\s+(.*)$/.exec(t);
        if (isOrdered && o) {
          items.push({ type: "listItem", content: [paragraph(o[2]!)] });
        } else if (!isOrdered && b) {
          items.push({ type: "listItem", content: [paragraph(b[1]!)] });
        } else if (o || b) {
          // Marcador do outro tipo dentro da mesma lista: mantém-se como item.
          items.push({ type: "listItem", content: [paragraph((o?.[2] ?? b![1])!)] });
        } else if (t === "" && items.length > 0) {
          // Uma linha em branco só termina a lista se a seguinte não for item.
          const next = lines[i + 1]?.trim() ?? "";
          if (!/^[-*+]\s+/.test(next) && !/^\d+[.)]\s+/.test(next)) break;
        } else {
          break;
        }
        i++;
      }
      content.push(
        isOrdered
          ? { type: "orderedList", attrs: { start }, content: items }
          : { type: "bulletList", content: items },
      );
      continue;
    }

    // Parágrafo: junta linhas seguidas até uma linha vazia ou o início de outro
    // bloco.
    const buf: string[] = [];
    while (i < lines.length) {
      const t = lines[i]!.trim();
      if (
        t === "" ||
        /^#{1,6}\s/.test(t) ||
        /^```/.test(t) ||
        /^>\s?/.test(t) ||
        /^[-*+]\s+/.test(t) ||
        /^\d+[.)]\s+/.test(t) ||
        /^(\*{3,}|-{3,}|_{3,})$/.test(t) ||
        isTableRow(t)
      ) {
        break;
      }
      buf.push(t);
      i++;
    }
    if (buf.length) content.push(paragraph(buf.join(" ")));
  }

  const doc: TiptapDoc = { type: "doc", content };
  return {
    doc,
    warnings,
    wordCount: countWords(doc),
    blockCount: content.length,
  };
}

function normaliseForCompare(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Assinatura estrutural do documento: sequência de tipos de bloco, com o nível
 * dos headings e a forma das tabelas e listas. Serve para comparar uma tradução
 * com o original e recusar a que tenha destruído a estrutura.
 */
export function structuralSignature(doc: TiptapDoc): string {
  return doc.content
    .map((node) => {
      if (node.type === "heading") return `h${node.attrs?.level ?? 2}`;
      if (node.type === "table") {
        const rows = node.content?.length ?? 0;
        const cols = node.content?.[0]?.content?.length ?? 0;
        return `table:${rows}x${cols}`;
      }
      if (node.type === "bulletList" || node.type === "orderedList") {
        return `${node.type}:${node.content?.length ?? 0}`;
      }
      return node.type;
    })
    .join("|");
}

/** Palavras de todo o texto do documento. Espelha o extractTextFromTipTap. */
export function countWords(doc: TiptapDoc): number {
  const parts: string[] = [];
  const walk = (node: TiptapNode) => {
    if (node.text) parts.push(node.text);
    node.content?.forEach(walk);
  };
  doc.content.forEach(walk);
  return parts
    .join(" ")
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
}

/** Tipos que o renderer do site sabe desenhar. Nada mais deve chegar lá. */
const RENDERABLE = new Set([
  "paragraph",
  "heading",
  "bulletList",
  "listItem",
  "orderedList",
  "blockquote",
  "codeBlock",
  "image",
  "horizontalRule",
  "table",
  "tableRow",
  "tableHeader",
  "tableCell",
  "text",
  "hardBreak",
]);

/**
 * Devolve os tipos de nó que o renderer iria ignorar. Usado como rede de
 * segurança antes de publicar: se não estiver vazio, alguma coisa correu mal no
 * conversor e o artigo sairia com buracos.
 */
export function findUnrenderableNodes(doc: TiptapDoc): string[] {
  const found = new Set<string>();
  const walk = (node: TiptapNode) => {
    if (!RENDERABLE.has(node.type)) found.add(node.type);
    node.content?.forEach(walk);
  };
  doc.content.forEach(walk);
  return [...found];
}
