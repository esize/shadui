import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "shadcn UI Clone",
  description: "A clone of the shadcn UI documentation site",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.className
        )}
      >
        <div className="flex">
          <Sidebar />
          <main className="flex-1 md:pl-[250px] pt-16 px-4 md:px-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
