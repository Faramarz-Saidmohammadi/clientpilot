"use server";

import mongoose from "mongoose";
import { connectDb } from "@/lib/db";
import { getWorkspaceContext } from "@/lib/workspace";
import { Invoice, TimeEntry, Workspace } from "@/models";

export type ReportsMetrics = {
  earnings: number;
  utilization: number;
  currency: string;
};

export async function getReportsMetrics(): Promise<ReportsMetrics> {
  const ctx = await getWorkspaceContext();
  await connectDb();

  const workspaceId = new mongoose.Types.ObjectId(ctx.workspaceId);
  const now = new Date();
  const sixMonthsAgo = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 5, 1));

  const [earningsResult, timeResult, workspace] = await Promise.all([
    Invoice.aggregate<{ total: number }>([
      {
        $match: {
          workspaceId,
          status: "paid",
          paidAt: { $gte: sixMonthsAgo }
        }
      },
      { $group: { _id: null, total: { $sum: "$total" } } }
    ]),
    TimeEntry.aggregate<{ totalMinutes: number; billedMinutes: number }>([
      { $match: { workspaceId, start: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: null,
          totalMinutes: { $sum: "$duration" },
          billedMinutes: { $sum: { $cond: ["$billed", "$duration", 0] } }
        }
      }
    ]),
    Workspace.findById(workspaceId).select({ currency: 1 }).lean()
  ]);

  const totalMinutes = Number(timeResult[0]?.totalMinutes || 0);
  const billedMinutes = Number(timeResult[0]?.billedMinutes || 0);

  return {
    earnings: Number(earningsResult[0]?.total || 0),
    utilization: totalMinutes > 0 ? Math.round((billedMinutes / totalMinutes) * 100) : 0,
    currency: typeof workspace?.currency === "string" ? workspace.currency : "USD"
  };
}
