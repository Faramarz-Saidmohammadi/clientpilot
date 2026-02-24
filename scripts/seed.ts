import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDb } from "@/lib/db";
import { User, Workspace, Membership, Client, Project, Task, TimeEntry, Subscription } from "@/models";

async function run() {
  await connectDb();

  await Promise.all([
    User.deleteMany({}),
    Workspace.deleteMany({}),
    Membership.deleteMany({}),
    Client.deleteMany({}),
    Project.deleteMany({}),
    Task.deleteMany({}),
    TimeEntry.deleteMany({}),
    Subscription.deleteMany({})
  ]);

  const user = await User.create({
    name: "Demo Owner",
    email: "owner@clientpilot.local",
    passwordHash: await bcrypt.hash("Passw0rd!", 12)
  });

  const workspace = await Workspace.create({ name: "Demo Studio", slug: "demo-studio" });
  await Membership.create({ userId: user._id, workspaceId: workspace._id, role: "owner" });
  await Subscription.create({ workspaceId: workspace._id, plan: "free", status: "active" });

  const client = await Client.create({ workspaceId: workspace._id, name: "Acme Inc", email: "ops@acme.test" });
  const project = await Project.create({ workspaceId: workspace._id, clientId: client._id, name: "Website redesign", status: "active", budget: 6000 });
  await Task.insertMany([
    { workspaceId: workspace._id, projectId: project._id, title: "Wireframes", status: "todo", order: 1 },
    { workspaceId: workspace._id, projectId: project._id, title: "UI build", status: "in_progress", order: 2 }
  ]);
  await TimeEntry.create({
    workspaceId: workspace._id,
    projectId: project._id,
    userId: user._id,
    start: new Date(Date.now() - 2 * 60 * 60 * 1000),
    end: new Date(Date.now() - 60 * 60 * 1000),
    duration: 60,
    note: "Demo tracked hour"
  });

  console.log("Seed complete");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
