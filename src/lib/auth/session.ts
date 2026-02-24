import { authOptions } from "@/lib/auth/options";
import { getServerSession } from "next-auth";

export async function getSession() {
  return getServerSession(authOptions);
}
