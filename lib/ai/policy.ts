/**
 * Deterministic intent routing for irreversible actions.
 *
 * Models — especially small free ones — sometimes answer a refund request with
 * a knowledge-base search instead of calling the tool. For actions that spend
 * money or delete data, we route on the request itself and force the first tool
 * call. The human gate still decides whether it executes.
 */

export type ForcedTool = "issue_refund" | "delete_account";

const REFUND = /\b(refund|chargeback|reimburse)\b/i;
const AMOUNT = /(?:\$\s?\d|\b\d+(?:\.\d{1,2})?\s?(?:usd|dollars?|bucks)\b)/i;
const DELETE = /\b(delete|erase|remove|close|terminate|wipe)\b/i;
const ACCOUNT = /\b(account|profile|user|customer|data)\b/i;
const QUESTION = /^(what|how|why|when|where|who|which|does|do|is|are|can|could)\b/i;

export function actionFor(text: string): ForcedTool | undefined {
  const value = text.trim();
  if (!value || QUESTION.test(value)) return undefined;

  if (REFUND.test(value) && AMOUNT.test(value)) return "issue_refund";
  if (DELETE.test(value) && ACCOUNT.test(value)) return "delete_account";

  return undefined;
}
