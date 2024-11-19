"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import DynamicIcon from "@/components/ui/icon";
import { icons } from "lucide-react";
import { useVirtualizer } from "@tanstack/react-virtual";

export interface IconSelectorProps {
  value?: string;
  onSelect: (value: string | null) => void;
}

function toTitleCase(str: string) {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function IconSelector({
  value: controlledValue,
  onSelect,
}: IconSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState<string | null>(
    controlledValue || null
  );
  const [search, setSearch] = React.useState("");
  const [highlightedIndex, setHighlightedIndex] = React.useState(0);
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const iconList = React.useMemo(
    () =>
      Object.keys(icons)
        .map((name) =>
          name
            .replace(/([A-Z])/g, "-$1")
            .toLowerCase()
            .replace(/^-/, "")
        )
        .filter((name) => name !== "create-lucide-icon")
        .sort(),
    []
  );

  const filteredIcons = React.useMemo(
    () =>
      iconList.filter((icon) =>
        icon.toLowerCase().includes(search.toLowerCase())
      ),
    [iconList, search]
  );

  const parentRef = React.useRef<HTMLDivElement>(null);
  const [parentWidth, setParentWidth] = React.useState(0);

  React.useEffect(() => {
    if (open && parentRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setParentWidth(entry.contentRect.width);
        }
      });

      resizeObserver.observe(parentRef.current);
      return () => resizeObserver.disconnect();
    }
  }, [open]);

  const rowVirtualizer = useVirtualizer({
    count: filteredIcons.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 36,
    overscan: 5,
    initialOffset: 0,
    measureElement: undefined,
    paddingStart: 0,
    paddingEnd: 0,
  });

  React.useEffect(() => {
    if (open) {
      setTimeout(() => {
        rowVirtualizer.measure();
        rowVirtualizer.scrollToOffset(0);
      }, 0);
    }
  }, [open, rowVirtualizer]);

  React.useEffect(() => {
    setHighlightedIndex(0);
  }, [filteredIcons]);

  React.useEffect(() => {
    if (open && highlightedIndex !== -1) {
      rowVirtualizer.scrollToIndex(highlightedIndex, {
        align: "auto",
      });
    }
  }, [open, highlightedIndex, rowVirtualizer]);

  const handleSelect = React.useCallback(
    (newValue: string) => {
      const finalValue = newValue === value ? null : newValue;
      setInternalValue(finalValue);
      onSelect(finalValue);
      setOpen(false);
      setSearch("");
      if (triggerRef.current) {
        triggerRef.current.focus();
      }
    },
    [value, onSelect]
  );

  const handleTriggerKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (
        !open &&
        event.key.length === 1 &&
        event.key.match(/^[a-zA-Z0-9]$/) &&
        !event.ctrlKey &&
        !event.altKey &&
        !event.metaKey
      ) {
        event.preventDefault();
        setOpen(true);
        // Delay setting the search value until after the input is mounted
        setTimeout(() => {
          setSearch(event.key);
          if (searchInputRef.current) {
            searchInputRef.current.value = event.key;
          }
        }, 0);
      }
    },
    [open]
  );

  const handleSearchKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setHighlightedIndex((prev) =>
            Math.min(prev + 1, filteredIcons.length - 1)
          );
          break;

        case "ArrowUp":
          event.preventDefault();
          setHighlightedIndex((prev) => Math.max(prev - 1, 0));
          break;

        case "Enter":
          event.preventDefault();
          if (
            highlightedIndex >= 0 &&
            highlightedIndex < filteredIcons.length
          ) {
            handleSelect(filteredIcons[highlightedIndex]);
          }
          break;

        case "Escape":
          event.preventDefault();
          setOpen(false);
          setSearch("");
          if (triggerRef.current) {
            triggerRef.current.focus();
          }
          break;
      }
    },
    [filteredIcons, highlightedIndex, handleSelect]
  );

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={triggerRef}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
            onKeyDown={handleTriggerKeyDown}
          >
            <div className="flex items-center gap-2 min-w-0 flex-1">
              {value ? (
                <div className="flex items-center gap-2 min-w-0">
                  <DynamicIcon name={value} className="h-4 w-4 shrink-0" />
                  <span className="truncate">{toTitleCase(value)}</span>
                </div>
              ) : (
                <span>Select icon</span>
              )}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-2">
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Input
              ref={searchInputRef}
              placeholder="Search icons..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="h-8 w-full border-0 bg-transparent p-0 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0"
            />
          </div>
          <div
            ref={parentRef}
            className="relative h-[200px] overflow-y-auto mt-2 -mx-2 scrollbar-custom"
            style={{
              contain: "strict",
            }}
          >
            <div
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                width: "100%",
                position: "relative",
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualItem) => {
                const icon = filteredIcons[virtualItem.index];
                const isHighlighted = virtualItem.index === highlightedIndex;
                return (
                  <Button
                    key={virtualItem.key}
                    variant="ghost"
                    role="option"
                    aria-selected={value === icon}
                    data-highlighted={isHighlighted}
                    className={cn(
                      "absolute left-0 w-full justify-start gap-2 rounded-none px-2",
                      value === icon && "bg-accent",
                      isHighlighted && "bg-accent-foreground text-accent"
                    )}
                    style={{
                      height: `${virtualItem.size}px`,
                      transform: `translateY(${virtualItem.start}px)`,
                      width: parentWidth || "100%",
                    }}
                    onClick={() => handleSelect(icon)}
                  >
                    <DynamicIcon name={icon} className="h-4 w-4 shrink-0" />
                    <span className="truncate flex-1 text-left">
                      {toTitleCase(icon)}
                    </span>
                    {value === icon && (
                      <Check className="h-4 w-4 shrink-0 opacity-100" />
                    )}
                  </Button>
                );
              })}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
