import type { Registry } from "./schema";

export const ui: Registry = [
  {
    name: "icon",
    type: "registry:ui",
    dependencies: ["lucide-react"],
    files: ["ui/icon.tsx"],
  },
];
