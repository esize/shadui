"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CopyIcon } from "lucide-react";

interface ComponentExampleProps {
  name: string;
  children: React.ReactNode;
  code: string;
}

export function ComponentExample({
  name,
  children,
  code,
}: ComponentExampleProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="p-4 bg-muted">
        <h3 className="font-semibold mb-2">{name}</h3>
        {children}
      </div>
      <Tabs defaultValue="preview">
        <div className="flex items-center justify-between px-4 py-2 bg-muted border-t">
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>
          <Button variant="ghost" size="sm" onClick={copyToClipboard}>
            <CopyIcon className="h-4 w-4 mr-2" />
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>
        <TabsContent value="preview" className="p-4">
          {children}
        </TabsContent>
        <TabsContent value="code">
          <pre className="p-4 overflow-x-auto">
            <code>{code}</code>
          </pre>
        </TabsContent>
      </Tabs>
    </div>
  );
}
