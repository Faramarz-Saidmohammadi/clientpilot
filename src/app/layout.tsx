import "@/app/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ClientPilot",
  description: "Freelancer and agency client portal",
  icons: {
    icon: "/icon.svg"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
