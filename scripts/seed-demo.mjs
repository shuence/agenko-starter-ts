/**
 * Seed the Agenko control plane with real receipts/traces for the starter's
 * tools. Run from agenko-starter-ts after setting:
 *
 *   AGENKO_API_KEY=agk_... AGENKO_HOST=https://api-prod.agenko.app \
 *   AGENKO_SERVICE_NAME=agenko-starter node scripts/seed-demo.mjs
 *
 * The starter app itself uses the same env vars, so running `pnpm dev` keeps
 * appending real traces to the same project.
 */
import agenko from "@agenko/sdk";

const apiKey = process.env.AGENKO_API_KEY;
const host = process.env.AGENKO_HOST ?? "https://api-prod.agenko.app";
const serviceName = process.env.AGENKO_SERVICE_NAME ?? "agenko-starter";

if (!apiKey) throw new Error("AGENKO_API_KEY is required");

agenko.init({ apiKey, httpEndpoint: host, serviceName, debug: false });

const tally = new Map();

async function withReceipt(name, body) {
  const runner = async () => body();
  Object.defineProperty(runner, "name", { value: name });
  const run = agenko.check({ claims: [name] })(runner);
  try {
    const result = await run();
    const receipt = result?._agenko_receipt;
    const key = `${name}:${receipt?.verdict ?? "none"}`;
    tally.set(key, (tally.get(key) ?? 0) + 1);
    return receipt;
  } catch (error) {
    const key = `${name}:error`;
    tally.set(key, (tally.get(key) ?? 0) + 1);
    throw error;
  }
}

const rounds = 10;
let errors = 0;

for (let round = 0; round < rounds; round += 1) {
  const amount = 40 + round;
  const order = `#88${200 + round}`;
  const scenarios = [
    [
      "search_knowledge",
      async () =>
        round % 3 === 0
          ? {}
          : {
              answer: `Enterprise SLA for plan ${round} is 99.9${round % 10}%.`,
              sources: [`kb/enterprise-sla-${round}`],
            },
    ],
    ["calculator", async () => ({ expression: `${amount} + 1`, result: amount + 1 })],
    [
      "send_email",
      async () => ({
        status: "sent",
        to: `ada+${round}@example.com`,
        subject: `Refund confirmation ${order}`,
      }),
    ],
    ["issue_refund", async () => ({ status: "refunded", amount, order })],
    ["delete_account", async () => ({ deleted: true, user: `u_10${200 + round}` })],
  ];

  for (const [name, body] of scenarios) {
    try {
      await withReceipt(name, body);
    } catch {
      errors += 1;
    }
    await new Promise((resolve) => setTimeout(resolve, 30));
  }

  if (round % 5 === 4) {
    try {
      await withReceipt("send_email", async () => {
        throw new Error("smtp throttled");
      });
    } catch {
      errors += 1;
    }
  }
}

await agenko.shutdown();
console.log("done", { rounds, errors, tally: Object.fromEntries(tally) });
