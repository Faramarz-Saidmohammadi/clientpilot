"use server";

import mongoose from "mongoose";
import { connectDb } from "@/lib/db";
import { getWorkspaceContext } from "@/lib/workspace";
import { Invoice, Project, TimeEntry, Workspace } from "@/models";

export type RevenuePoint = {
  month: string;
  revenue: number;
};

export type DashboardMetrics = {
  monthlyRevenue: number;
  trackedHours: number;
  openInvoices: number;
  activeProjects: number;
  currency: string;
  revenueTrend: RevenuePoint[];
};

function monthKey(date: Date) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const ctx = await getWorkspaceContext();
  await connectDb();

  const workspaceId = new mongoose.Types.ObjectId(ctx.workspaceId);
  const now = new Date();
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const trendStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 5, 1));

  const [monthlyRevenueResult, trackedTimeResult, openInvoices, activeProjects, trendResult, workspace] =
    await Promise.all([
      Invoice.aggregate<{ total: number }>([
        {
          $match: {
            workspaceId,
            status: "paid",
            paidAt: { $gte: monthStart }
          }
        },
        { $group: { _id: null, total: { $sum: "$total" } } }
      ]),
      TimeEntry.aggregate<{ minutes: number }>([
        { $match: { workspaceId, start: { $gte: monthStart } } },
        { $group: { _id: null, minutes: { $sum: "$duration" } } }
      ]),
      Invoice.countDocuments({ workspaceId, status: { $in: ["sent", "overdue"] } }),
      Project.countDocuments({ workspaceId, status: "active" }),
      Invoice.aggregate<{ _id: { year: number; month: number }; revenue: number }>([
        {
          $match: {
            workspaceId,
            status: "paid",
            paidAt: { $gte: trendStart }
          }
        },
        {
          $group: {
            _id: { year: { $year: "$paidAt" }, month: { $month: "$paidAt" } },
            revenue: { $sum: "$total" }
          }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
      ]),
      Workspace.findById(workspaceId).select({ currency: 1 }).lean()
    ]);

  const trendMap = new Map(
    trendResult.map((item) => [
      `${item._id.year}-${String(item._id.month).padStart(2, "0")}`,
      Number(item.revenue || 0)
    ])
  );

  const revenueTrend = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 5 + index, 1));
    const key = monthKey(date);
    return { month: key, revenue: trendMap.get(key) || 0 };
  });

  return {
    monthlyRevenue: Number(monthlyRevenueResult[0]?.total || 0),
    trackedHours: Number(((trackedTimeResult[0]?.minutes || 0) / 60).toFixed(1)),
    openInvoices,
    activeProjects,
    currency: typeof workspace?.currency === "string" ? workspace.currency : "USD",
    revenueTrend
  };
}
