/**
 * Cliente mínimo da OpenAI por `fetch`.
 *
 * Sem o SDK `openai`, pela mesma razão que o `stripe.ts` chama a REST API à mão:
 * o repositório não usa `"use node"` em lado nenhum e todas as actions correm no
 * isolate V8 do Convex, onde `fetch`, `atob`, `Uint8Array` e `Blob` existem mas
 * os builtins do Node não.
 */

const API = "https://api.openai.com/v1";

/** Uma chamada longa não pode pendurar a action até ao limite de execução. */
const TIMEOUT_MS = 240_000;

function apiKey(): string {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    throw new Error(
      "OPENAI_API_KEY not configured. Set it in the Convex Dashboard or with `npx convex env set OPENAI_API_KEY ...`",
    );
  }
  return key;
}

/**
 * Modelos sobreponíveis por env var, para trocar sem deploy quando a OpenAI
 * publicar uma versão nova. Confirmar os identificadores contra o catálogo da
 * conta antes de ligar a automação: um id errado devolve 404 com a mensagem da
 * própria OpenAI, que é propagada.
 */
export function textModel(): string {
  return process.env.OPENAI_TEXT_MODEL ?? "gpt-5";
}
export function imageModel(): string {
  return process.env.OPENAI_IMAGE_MODEL ?? "gpt-image-1";
}

async function post(path: string, body: unknown): Promise<any> {
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    // A chave nunca entra no erro; o corpo da OpenAI não a inclui.
    throw new Error(`OpenAI ${path} failed: ${res.status} ${detail.slice(0, 500)}`);
  }
  return res.json();
}

export type TextResult = {
  text: string;
  /** "length" significa resposta truncada: o conteúdo não é de confiança. */
  finishReason: string | null;
  usage?: { input?: number; output?: number };
};

export async function generateText(params: {
  system: string;
  user: string;
  maxOutputTokens?: number;
}): Promise<TextResult> {
  const json = await post("/chat/completions", {
    model: textModel(),
    messages: [
      { role: "system", content: params.system },
      { role: "user", content: params.user },
    ],
    max_completion_tokens: params.maxOutputTokens ?? 16000,
  });

  const choice = json?.choices?.[0];
  return {
    text: choice?.message?.content ?? "",
    finishReason: choice?.finish_reason ?? null,
    usage: {
      input: json?.usage?.prompt_tokens,
      output: json?.usage?.completion_tokens,
    },
  };
}

/**
 * Gera uma imagem e devolve-a como Blob pronto para o storage.
 *
 * Os modelos GPT Image devolvem sempre base64 (`b64_json`); o `response_format:
 * "url"` é do DALL·E 3 e não se aplica aqui. Pedimos webp em vez de png porque
 * um png destas dimensões em base64 anda pelos vários MB de texto.
 *
 * Nota de enquadramento: estes modelos não têm um tamanho 16:9. O mais próximo
 * é a paisagem 1536x1024 (3:2). O site desenha a hero com `object-cover` em
 * todos os sítios, portanto o corte é feito pelo CSS, e o prompt de arte pede
 * folga em cima e em baixo para o corte não decapitar o motivo.
 */
export async function generateImage(prompt: string): Promise<Blob> {
  const json = await post("/images/generations", {
    model: imageModel(),
    prompt,
    n: 1,
    size: "1536x1024",
    quality: "high",
    output_format: "webp",
  });

  const b64 = json?.data?.[0]?.b64_json;
  if (typeof b64 !== "string" || b64.length === 0) {
    throw new Error("OpenAI image response had no b64_json payload");
  }

  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: "image/webp" });
}
