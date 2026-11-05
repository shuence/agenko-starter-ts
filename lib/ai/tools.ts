import { tool, type UIMessage, type UIMessageStreamWriter } from "ai";
import { z } from "zod";
import { withReceipt } from "@/lib/agenko/trust";
import type { ReceiptPayload } from "@/lib/agenko/types";
import { searchKnowledge } from "@/lib/knowledge";

type ReceiptMessage = UIMessage<never, { receipt: ReceiptPayload }>;

function emit(
  writer: UIMessageStreamWriter<ReceiptMessage>,
  receipt?: ReceiptPayload,
) {
  if (!receipt) return;
  writer.write({ type: "data-receipt", id: receipt.id, data: receipt });
}

const SAFE_MATH = /^[\d+\-*/().\s]+$/;

/**
 * Tools are plain AI SDK tools. The only extra seam is `withReceipt(...)`:
 * it runs the body through Agenko and streams the resulting receipt to the UI.
 */
export function createTools(writer: UIMessageStreamWriter<ReceiptMessage>) {
  return {
    search_knowledge: tool({
      description:
        "Search the internal knowledge base. Use it for any factual question about Agenko, pricing, receipts, approvals or refunds.",
      inputSchema: z.object({
        query: z.string().describe("What to look for"),
      }),
      execute: async ({ query }) => {
        const { output, receipt } = await withReceipt(
          "search_knowledge",
          async () => {
            const matches = searchKnowledge(query).map(
              (entry) => `${entry.title}: ${entry.body}`,
            );

            // A miss returns `{}` — an empty object is exactly the kind of
            // silent failure the receipt verdict is designed to catch.
            return matches.length > 0 ? { matches } : {};
          },
        );

        emit(writer, receipt);
        return output;
      },
    }),

    calculator: tool({
      description: "Evaluate a basic arithmetic expression.",
      inputSchema: z.object({
        expression: z.string().describe("e.g. (49 * 12) / 3"),
      }),
      execute: async ({ expression }) => {
        const { output, receipt } = await withReceipt(
          "calculator",
          async () => {
            if (!SAFE_MATH.test(expression)) {
              return { error: "Only numbers, spaces and + - * / ( ) are allowed." };
            }
            // Demo only: evals a guarded arithmetic expression.
            const value = Number(
              new Function(`return (${expression})`)() as number,
            );
            if (!Number.isFinite(value)) return { error: "Not a finite number." };
            return { expression, value };
          },
        );

        emit(writer, receipt);
        return output;
      },
    }),

    send_email: tool({
      description:
        "Send a transactional email to a customer. Reversible: nothing is deleted.",
      inputSchema: z.object({
        to: z.string().describe("Recipient email address"),
        subject: z.string(),
        body: z.string(),
      }),
      execute: async ({ to, subject, body }) => {
        const { output, receipt } = await withReceipt(
          "send_email",
          async () => ({
            status: "sent",
            to,
            subject,
            preview: body.slice(0, 120),
            sent_at: new Date().toISOString(),
          }),
        );

        emit(writer, receipt);
        return output;
      },
    }),

    // ── Irreversible ────────────────────────────────────────────────────────
    // Gated in `app/api/chat/route.ts` with `toolApproval`. Nothing runs until
    // a human clicks Approve in the chat.

    issue_refund: tool({
      description:
        "Issue a monetary refund. IRREVERSIBLE — requires human approval.",
      inputSchema: z.object({
        customer_email: z.string().describe("Who receives the refund"),
        amount: z.number().positive().describe("Amount in USD"),
        reason: z.string().describe("Why the refund is being issued"),
      }),
      execute: async ({ customer_email, amount, reason }) => {
        const { output, receipt } = await withReceipt(
          "issue_refund",
          async () => ({
            status: "refunded",
            customer_email,
            amount_usd: amount,
            reason,
            reference: `re_${Math.random().toString(36).slice(2, 10)}`,
            refunded_at: new Date().toISOString(),
          }),
        );

        emit(writer, receipt);
        return output;
      },
    }),

    delete_account: tool({
      description:
        "Permanently delete a customer account and all of its data. IRREVERSIBLE — requires human approval.",
      inputSchema: z.object({
        customer_email: z.string(),
        confirmation: z
          .string()
          .describe("Must repeat the customer email to confirm"),
      }),
      execute: async ({ customer_email, confirmation }) => {
        const { output, receipt } = await withReceipt(
          "delete_account",
          async () => {
            if (confirmation !== customer_email) {
              return { error: "Confirmation does not match the customer email." };
            }
            return {
              status: "deleted",
              customer_email,
              deleted_at: new Date().toISOString(),
            };
          },
        );

        emit(writer, receipt);
        return output;
      },
    }),
  };
}

export type ChatTools = ReturnType<typeof createTools>;
