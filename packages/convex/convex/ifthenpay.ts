import { v } from "convex/values";
import { action } from "./_generated/server";

// Tipos de resposta da API IfThenPay
interface MbResponse {
  Entity: string;
  Reference: string;
  OrderId: string;
  Amount: string;
  Message?: string;
}

interface MbwInitResponse {
  RequestId: string;
  Message: string;
  Status: string;
}

interface CcInitResponse {
  PaymentUrl: string;
  RequestId: string;
  Message?: string;
}

interface MbwStatusResponse {
  CreatedAt: string;
  Message: string;
  RequestId: string;
  Status: string; // "000" = paid, "020" = rejected, "101" = expired, "122" = declined
  UpdateAt: string;
}

/**
 * Formata valor para string com 2 decimais (formato IfThenPay)
 */
function formatAmount(amount: number): string {
  return amount.toFixed(2);
}

/** Para testes: enviar 1 cêntimo ao IfThenPay quando IFTHENPAY_USE_TEST_AMOUNT=1 */
function amountForApi(amount: number): number {
  if (process.env.IFTHENPAY_USE_TEST_AMOUNT === "1") {
    return 0.01;
  }
  return amount;
}

/**
 * Converte número de telefone para formato MBWay (351#XXXXXXXXX)
 */
function toMbwayPhone(phone: string | null | undefined): string | null {
  if (!phone) return null;
  // Remove todos os caracteres não numéricos
  const digits = phone.replace(/\D+/g, "");
  // Se já começa com 351, remove e adiciona o formato
  if (digits.startsWith("351")) {
    return `351#${digits.substring(3)}`;
  }
  return `351#${digits}`;
}

/**
 * Inicia pagamento Multibanco
 */
export const initMultibanco = action({
  args: {
    orderId: v.string(),
    amount: v.number(),
    email: v.optional(v.string()),
    expiryDays: v.optional(v.number()),
    description: v.optional(v.string()),
    useSandbox: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const mbKey = process.env.IFTHENPAY_MB_KEY;
    if (!mbKey) {
      throw new Error("IFTHENPAY_MB_KEY not configured");
    }

    const endpoint = args.useSandbox
      ? "https://api.ifthenpay.com/multibanco/reference/sandbox"
      : "https://api.ifthenpay.com/multibanco/reference/init";

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mbKey,
        orderId: args.orderId.substring(0, 25), // max 25 chars
        amount: formatAmount(amountForApi(args.amount)),
        clientEmail: args.email,
        expiryDays: args.expiryDays,
        description: args.description?.substring(0, 200), // max 200 chars
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Multibanco init failed: ${response.status} ${error}`);
    }

    const data: MbResponse = await response.json();
    return {
      entity: data.Entity,
      reference: data.Reference,
      orderId: data.OrderId,
      amount: data.Amount,
      message: data.Message,
    };
  },
});

/**
 * Inicia pagamento MBWay
 */
export const initMbway = action({
  args: {
    orderId: v.string(),
    amount: v.number(),
    phone: v.string(),
    email: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const mbwayKey = process.env.IFTHENPAY_MBWAY_KEY;
    if (!mbwayKey) {
      throw new Error("IFTHENPAY_MBWAY_KEY not configured");
    }

    const mobileNumber = toMbwayPhone(args.phone);
    if (!mobileNumber) {
      throw new Error("Invalid phone number");
    }

    const response = await fetch("https://api.ifthenpay.com/spg/payment/mbway", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mbWayKey: mbwayKey,
        orderId: args.orderId.substring(0, 15), // max 15 chars
        amount: formatAmount(amountForApi(args.amount)),
        mobileNumber,
        email: args.email?.substring(0, 100), // max 100 chars
        description: args.description?.substring(0, 100), // max 100 chars
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`MBWay init failed: ${response.status} ${error}`);
    }

    const data: MbwInitResponse = await response.json();
    return {
      requestId: data.RequestId,
      message: data.Message,
      status: data.Status,
    };
  },
});

/**
 * Verifica status de pagamento MBWay
 */
export const checkMbwayStatus = action({
  args: {
    requestId: v.string(),
  },
  handler: async (ctx, args) => {
    const mbwayKey = process.env.IFTHENPAY_MBWAY_KEY;
    if (!mbwayKey) {
      throw new Error("IFTHENPAY_MBWAY_KEY not configured");
    }

    const response = await fetch(
      `https://api.ifthenpay.com/spg/payment/mbway/status?mbWayKey=${mbwayKey}&requestId=${args.requestId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`MBWay status check failed: ${response.status} ${error}`);
    }

    const data: MbwStatusResponse = await response.json();
    return {
      status: data.Status,
      message: data.Message,
      requestId: data.RequestId,
      createdAt: data.CreatedAt,
      updateAt: data.UpdateAt,
    };
  },
});

/**
 * Inicia pagamento Cartão de Crédito
 */
export const initCreditCard = action({
  args: {
    orderId: v.string(),
    amount: v.number(),
    successUrl: v.string(),
    errorUrl: v.string(),
    cancelUrl: v.string(),
    language: v.optional(v.string()),
    useSandbox: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const ccardKey = process.env.IFTHENPAY_CCARD_KEY;
    if (!ccardKey) {
      throw new Error("IFTHENPAY_CCARD_KEY not configured");
    }

    const endpoint = args.useSandbox
      ? `https://api.ifthenpay.com/creditcard/sandbox/init/${ccardKey}`
      : `https://api.ifthenpay.com/creditcard/init/${ccardKey}`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId: args.orderId.substring(0, 15), // max 15 chars
        amount: formatAmount(amountForApi(args.amount)),
        successUrl: args.successUrl,
        errorUrl: args.errorUrl,
        cancelUrl: args.cancelUrl,
        language: args.language || "en",
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Credit card init failed: ${response.status} ${error}`);
    }

    const data: CcInitResponse = await response.json();
    return {
      paymentUrl: data.PaymentUrl,
      requestId: data.RequestId,
      message: data.Message,
    };
  },
});
