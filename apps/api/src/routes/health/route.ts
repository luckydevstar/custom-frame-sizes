import type { VercelRequest, VercelResponse } from "@vercel/node";
import { withRouteHandler, sendSuccess } from "@/lib/route-handler";

const handler = withRouteHandler({
  GET: async (_req: VercelRequest, res: VercelResponse) => {
    sendSuccess(res, { status: "ok" });
  },
});

export default handler;
