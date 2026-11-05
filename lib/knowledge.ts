export type KnowledgeEntry = {
  id: string;
  title: string;
  body: string;
};

/**
 * Toy knowledge base. Replace with your own retrieval layer — the point of the
 * starter is the trust boundary around the tool, not the retrieval itself.
 */
export const KNOWLEDGE: KnowledgeEntry[] = [
  {
    id: "agenko",
    title: "What Agenko is",
    body: "Agenko is the deterministic trust boundary for AI agents. It records receipts (tamper-evident audit), gates irreversible actions behind human approval, and emits OTEL traces — all from a thin SDK.",
  },
  {
    id: "receipts",
    title: "How receipts work",
    body: "Every checked action gets claimed vs. actual, a deterministic verdict (grounded, ungrounded, silent_failure, error) and a SHA-256 hash chained to the previous receipt. No LLM inference is involved.",
  },
  {
    id: "approvals",
    title: "How approval gates work",
    body: "Irreversible tools pause until a human approves or rejects. In this starter the gate is rendered inside the chat; the same gate can deliver to the Agenko console, Slack or Discord.",
  },
  {
    id: "pricing",
    title: "Pricing",
    body: "The free tier covers local development with unlimited receipts. The cloud plan is $49/mo and adds team dashboards, Slack/Discord approvals and long-term trace retention.",
  },
  {
    id: "refunds",
    title: "Refund policy",
    body: "Refunds are available within 30 days of purchase. Refunds over $500 require a second approver before they are issued.",
  },
  {
    id: "gateway",
    title: "Vercel AI Gateway",
    body: "The AI Gateway exposes hundreds of models behind one OpenAI-compatible endpoint. Set AI_GATEWAY_MODEL to any provider/model slug and keep your provider keys in Vercel.",
  },
];

export const SUGGESTIONS = [
  {
    label: "Find a fact",
    prompt: "What does Agenko record in a receipt?",
  },
  {
    label: "Empty result",
    prompt: "What is the SLA for the on-prem enterprise plan?",
  },
  {
    label: "Irreversible action",
    prompt: "Refund Ada Chen $40 for the duplicate charge on her account.",
  },
];


const STOP = new Set([
  "the", "and", "for", "you", "your", "what", "whats", "does", "did", "how",
  "why", "who", "are", "is", "was", "with", "from", "that", "this", "can",
  "could", "would", "should", "please", "tell", "about", "into", "our", "its",
]);

/** Naive token overlap over id/title/body. Swap for real retrieval later. */
export function searchKnowledge(query: string): KnowledgeEntry[] {
  const tokens = query
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 2 && !STOP.has(token));

  if (tokens.length === 0) return [];

  return KNOWLEDGE.map((entry) => {
    const haystack = `${entry.id} ${entry.title} ${entry.body}`.toLowerCase();
    const score = tokens.reduce(
      (total, token) => total + (haystack.includes(token) ? 1 : 0),
      0,
    );
    return { entry, score };
  })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ entry }) => entry);
}
