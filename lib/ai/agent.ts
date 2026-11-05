import {
  isStepCount,
  ToolLoopAgent,
  type UIMessage,
  type UIMessageStreamWriter,
} from "ai";
import { withReceipt } from "@/lib/agenko/trust";
import { agenkoTelemetry } from "@/lib/agenko/telemetry";
import { getGateway, getModelId } from "./model";
import { SYSTEM_PROMPT } from "./prompt";
import { createTools } from "./tools";
import type { ForcedTool } from "./policy";
import type { ReceiptPayload } from "@/lib/agenko/types";

type ReceiptMessage = UIMessage<never, { receipt: ReceiptPayload }>;

export const AGENT_ID = "agenko-support-agent";

/**
 * The agent loop.
 *
 * `ToolLoopAgent` runs the model → tool → model cycle until it stops or hits
 * the step budget. Every tool runs through `withReceipt`, so the loop produces
 * one receipt per side effect. Irreversible tools are gated with `toolApproval`
 * and never reach `execute` until a human answers.
 */
type AgentTelemetry = ReturnType<typeof agenkoTelemetry>;

type AgentOptions = {
  firstStepTool?: ForcedTool;
  telemetry?: AgentTelemetry;
};

export function createSupportAgent(
  writer: UIMessageStreamWriter<ReceiptMessage>,
  { firstStepTool, telemetry }: AgentOptions = {},
) {
  const integration = telemetry ?? agenkoTelemetry();
  return new ToolLoopAgent({
    id: AGENT_ID,
    model: getGateway()(getModelId()),
    instructions: SYSTEM_PROMPT,
    tools: createTools(writer),
    stopWhen: isStepCount(6),
    telemetry: {
      isEnabled: true,
      functionId: "agenko-starter-chat",
      integrations: [integration],
    },
    // Irreversible intent is routed deterministically for step one; later steps
    // are the model's own. The approval gate below still decides execution.
    prepareStep: ({ stepNumber }) =>
      stepNumber === 0 && firstStepTool
        ? { toolChoice: { type: "tool", toolName: firstStepTool } }
        : undefined,
    toolApproval: {
      issue_refund: {
        type: "user-approval",
        reason:
          "Money leaves the account. Agenko gates irreversible actions before they execute.",
      },
      delete_account: {
        type: "user-approval",
        reason:
          "This deletes customer data permanently. Approval is required.",
      },
    },
  });
}

/** Shared so the route and future scripts/evals use the same agent shape. */
export { withReceipt };
