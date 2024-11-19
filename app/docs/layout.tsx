import { Sidebar } from "@/components/sidebar";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <div className="flex-1 max-w-3xl mx-auto py-10 px-4 md:px-8">
        {children}
      </div>
    </div>
  );
}
