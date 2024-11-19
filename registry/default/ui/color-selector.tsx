"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const colors = {
  red: "bg-red-500 hover:bg-red-600 data-[selected=true]:ring-red-500",
  blue: "bg-blue-500 hover:bg-blue-600 data-[selected=true]:ring-blue-500",
  green: "bg-green-500 hover:bg-green-600 data-[selected=true]:ring-green-500",
  yellow:
    "bg-yellow-500 hover:bg-yellow-600 data-[selected=true]:ring-yellow-500",
  purple:
    "bg-purple-500 hover:bg-purple-600 data-[selected=true]:ring-purple-500",
  orange:
    "bg-orange-500 hover:bg-orange-600 data-[selected=true]:ring-orange-500",
  pink: "bg-pink-500 hover:bg-pink-600 data-[selected=true]:ring-pink-500",
  indigo:
    "bg-indigo-500 hover:bg-indigo-600 data-[selected=true]:ring-indigo-500",
  teal: "bg-teal-500 hover:bg-teal-600 data-[selected=true]:ring-teal-500",
  brown: "bg-stone-500 hover:bg-stone-600 data-[selected=true]:ring-stone-500",
} as const;

const gradients = {
  sunset:
    "bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 data-[selected=true]:ring-orange-500",
  ocean:
    "bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 data-[selected=true]:ring-blue-500",
  forest:
    "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 data-[selected=true]:ring-green-500",
  aurora:
    "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 data-[selected=true]:ring-purple-500",
  sunshine:
    "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 data-[selected=true]:ring-yellow-500",
  twilight:
    "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 data-[selected=true]:ring-indigo-500",
  cherry:
    "bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 data-[selected=true]:ring-pink-500",
  mint: "bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600 data-[selected=true]:ring-teal-500",
  dusk: "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 data-[selected=true]:ring-blue-500",
  autumn:
    "bg-gradient-to-r from-orange-500 to-brown-500 hover:from-orange-600 hover:to-stone-600 data-[selected=true]:ring-orange-500",
} as const;

type ColorOption = keyof typeof colors;
type GradientOption = keyof typeof gradients;
export type ColorValue = ColorOption | GradientOption;
export const allValues = [
  ...Object.keys(colors),
  ...Object.keys(gradients),
] as const;
interface ColorSelectorProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "value" | "onChange"
  > {
  value?: ColorValue;
  defaultValue?: ColorValue;
  onChange?: (value: ColorValue) => void;
}

export default function ColorSelector({
  id,
  value,
  defaultValue = "red",
  onChange,
  disabled,
  ...props
}: ColorSelectorProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const [open, setOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<"solid" | "gradient">(
    "solid"
  );
  const [focusedIndex, setFocusedIndex] = React.useState(0);
  const gridRef = React.useRef<HTMLDivElement>(null);
  const firstColorRef = React.useRef<HTMLButtonElement>(null);

  // Determine if the component is controlled
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  // Get the current active options based on the tab
  const activeOptions = activeTab === "solid" ? colors : gradients;
  const optionsArray = Object.keys(activeOptions) as ColorValue[];

  // Handle the color selection
  const handleColorSelect = (colorOrGradient: ColorValue) => {
    if (!isControlled) {
      setInternalValue(colorOrGradient);
    }
    onChange?.(colorOrGradient);
    setOpen(false);
  };

  const focusFirstColorInTab = React.useCallback(() => {
    // Use multiple frames to ensure the DOM is ready
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const firstButton = gridRef.current?.querySelector(
          'button[tabindex="0"]'
        ) as HTMLButtonElement;
        if (firstButton) {
          firstButton.focus();
        }
      });
    });
  }, []);

  // Handle popover open
  React.useEffect(() => {
    if (open) {
      // Set initial tab based on current value
      const newTab = Object.keys(gradients).includes(currentValue)
        ? "gradient"
        : "solid";
      setActiveTab(newTab);

      // Find and focus the current value
      const options = newTab === "solid" ? colors : gradients;
      const currentIndex = Object.keys(options).findIndex(
        (key) => key === currentValue
      );
      setFocusedIndex(currentIndex >= 0 ? currentIndex : 0);

      // Focus the first color
      focusFirstColorInTab();
    }
  }, [open, currentValue, focusFirstColorInTab]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const numColumns = 5;
    const numRows = Math.ceil(optionsArray.length / numColumns);
    const currentRow = Math.floor(focusedIndex / numColumns);
    const currentCol = focusedIndex % numColumns;

    switch (e.key) {
      case "ArrowRight": {
        e.preventDefault();
        if (currentCol === numColumns - 1) {
          // At the end of a row
          if (currentRow < numRows - 1) {
            // Move to first color of next row
            setFocusedIndex(focusedIndex + 1);
          } else {
            // At the last row, switch tabs if possible
            if (activeTab === "solid") {
              // Update both tab and focus in a single render
              setActiveTab("gradient");
              setFocusedIndex(0);
              // Ensure focus is set after the tab content is rendered
              setTimeout(focusFirstColorInTab, 0);
            }
          }
        } else {
          // Move to next color in row
          setFocusedIndex((prev) =>
            prev < optionsArray.length - 1 ? prev + 1 : prev
          );
        }
        break;
      }
      case "ArrowLeft": {
        e.preventDefault();
        if (currentCol === 0 && currentRow > 0) {
          // Move to last color of previous row
          setFocusedIndex(focusedIndex - 1);
        } else {
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        }
        break;
      }
      case "ArrowDown": {
        e.preventDefault();
        if (currentRow < numRows - 1) {
          const newIndex = focusedIndex + numColumns;
          if (newIndex < optionsArray.length) {
            setFocusedIndex(newIndex);
          }
        }
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        if (currentRow > 0) {
          setFocusedIndex(focusedIndex - numColumns);
        }
        break;
      }
      case "Enter":
      case " ": {
        e.preventDefault();
        handleColorSelect(optionsArray[focusedIndex]);
        break;
      }
      case "Tab": {
        // Prevent default tab behavior if we're on a color
        if (!e.shiftKey && focusedIndex === optionsArray.length - 1) {
          e.preventDefault();
          if (activeTab === "solid") {
            setActiveTab("gradient");
            setFocusedIndex(0);
            focusFirstColorInTab();
          }
        }
        break;
      }
    }
  };

  // Determine if current value is a gradient
  const isGradient = Object.keys(gradients).includes(currentValue);
  const currentStyle = isGradient
    ? gradients[currentValue as GradientOption]
    : colors[currentValue as ColorOption];

  return (
    <TooltipProvider>
      <div className="grid gap-2">
        {props.name && (
          <Label
            htmlFor={id}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {props.name}
          </Label>
        )}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id={id}
              variant="outline"
              size="default"
              className={cn(
                "w-[150px] justify-start text-left font-normal",
                !currentValue && "text-muted-foreground",
                disabled && "cursor-not-allowed opacity-50"
              )}
              disabled={disabled}
            >
              {currentValue ? (
                <>
                  <div
                    className={cn("mr-2 h-5 w-5 rounded-full", currentStyle)}
                  />
                  {currentValue.charAt(0).toUpperCase() + currentValue.slice(1)}
                </>
              ) : (
                <span>Select color</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[280px] p-4">
            <Tabs
              value={activeTab}
              onValueChange={(value) => {
                setActiveTab(value as "solid" | "gradient");
                setFocusedIndex(0);
                focusFirstColorInTab();
              }}
            >
              <TabsList
                className="w-full mb-4"
                onMouseDown={(e) => e.preventDefault()}
              >
                <TabsTrigger
                  value="solid"
                  className="flex-1"
                  tabIndex={-1}
                  onFocus={(e) => {
                    // If focused via keyboard, move focus to first color
                    if (!e.currentTarget.contains(e.relatedTarget)) {
                      focusFirstColorInTab();
                    }
                  }}
                >
                  Solid
                </TabsTrigger>
                <TabsTrigger
                  value="gradient"
                  className="flex-1"
                  tabIndex={-1}
                  onFocus={(e) => {
                    // If focused via keyboard, move focus to first color
                    if (!e.currentTarget.contains(e.relatedTarget)) {
                      focusFirstColorInTab();
                    }
                  }}
                >
                  Gradient
                </TabsTrigger>
              </TabsList>
              <TabsContent value="solid">
                <div
                  ref={gridRef}
                  className="grid grid-cols-5 gap-3"
                  onKeyDown={handleKeyDown}
                  role="grid"
                >
                  {(Object.entries(colors) as [ColorOption, string][]).map(
                    ([color, className], index) => (
                      <Tooltip key={color}>
                        <TooltipTrigger asChild>
                          <button
                            ref={index === 0 ? firstColorRef : undefined}
                            className={cn(
                              "h-9 w-9 rounded-md ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                              className,
                              currentValue === color && "ring-2 ring-offset-2",
                              focusedIndex === index &&
                                activeTab === "solid" &&
                                "ring-2 ring-ring ring-offset-2"
                            )}
                            data-selected={currentValue === color}
                            onClick={() => handleColorSelect(color)}
                            disabled={disabled}
                            aria-label={`Select ${color} color`}
                            tabIndex={
                              focusedIndex === index && activeTab === "solid"
                                ? 0
                                : -1
                            }
                            role="gridcell"
                          >
                            {currentValue === color && (
                              <Check className="h-5 w-5 text-white mx-auto" />
                            )}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {color.charAt(0).toUpperCase() + color.slice(1)}
                        </TooltipContent>
                      </Tooltip>
                    )
                  )}
                </div>
              </TabsContent>
              <TabsContent value="gradient">
                <div
                  className="grid grid-cols-5 gap-3"
                  onKeyDown={handleKeyDown}
                  role="grid"
                >
                  {(
                    Object.entries(gradients) as [GradientOption, string][]
                  ).map(([gradient, className], index) => (
                    <Tooltip key={gradient}>
                      <TooltipTrigger asChild>
                        <button
                          className={cn(
                            "h-9 w-9 rounded-md ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                            className,
                            currentValue === gradient && "ring-2 ring-offset-2",
                            focusedIndex === index &&
                              activeTab === "gradient" &&
                              "ring-2 ring-ring ring-offset-2"
                          )}
                          data-selected={currentValue === gradient}
                          onClick={() => handleColorSelect(gradient)}
                          disabled={disabled}
                          aria-label={`Select ${gradient} gradient`}
                          tabIndex={
                            focusedIndex === index && activeTab === "gradient"
                              ? 0
                              : -1
                          }
                          role="gridcell"
                        >
                          {currentValue === gradient && (
                            <Check className="h-5 w-5 text-white mx-auto" />
                          )}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {gradient.charAt(0).toUpperCase() + gradient.slice(1)}
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </PopoverContent>
        </Popover>
        <input
          type="hidden"
          name={props.name}
          value={currentValue}
          {...props}
        />
      </div>
    </TooltipProvider>
  );
}
