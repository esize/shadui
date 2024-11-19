import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GithubIcon } from "lucide-react";

const navItems = [
  { href: "/", label: "Introduction" },
  { href: "/docs/installation", label: "Installation" },
  { href: "/docs/components", label: "Components" },
  { href: "/docs/themes", label: "Themes" },
  { href: "/docs/figma", label: "Figma" },
  { href: "/docs/changelog", label: "Changelog" },
];

export function Sidebar() {
  return (
    <div className="fixed top-0 left-0 z-40 w-64 h-screen">
      <ScrollArea className="h-full py-6 pl-6 pr-4 border-r">
        <div className="flex items-center mb-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold">shadcn/ui</span>
          </Link>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button variant="ghost" className="w-full justify-start">
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>
        <div className="mt-6">
          <Button variant="outline" className="w-full" asChild>
            <Link
              href="https://github.com/shadcn/ui"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GithubIcon className="w-4 h-4 mr-2" />
              GitHub
            </Link>
          </Button>
        </div>
      </ScrollArea>
    </div>
  );
}
