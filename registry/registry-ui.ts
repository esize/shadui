import type { Registry } from "./schema";

export const ui: Registry = [
  {
    name: "icon",
    description: "Dynamic icon component",
    type: "registry:ui",
    dependencies: ["lucide-react"],
    files: ["ui/icon.tsx"],
  },
  {
    name: "color-selector",
    description: "Color selector component",
    type: "registry:ui",
    dependencies: ["lucide-react"],
    registryDependencies: [
      "utils",
      "button",
      "popover",
      "label",
      "tabs",
      "tooltip",
    ],
    files: ["ui/color-selector.tsx"],
  },
  {
    name: "icon-selector",
    description: "Icon selector component",
    type: "registry:ui",
    dependencies: ["lucide-react", "@tanstack/react-virtual"],
    registryDependencies: ["button", "input", "popover"],
    files: ["ui/icon-selector.tsx", "ui/icon.tsx"],
  },
];
