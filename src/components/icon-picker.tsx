
"use client";

import * as React from "react";
import * as LucideIcons from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export type LucideIcon = keyof typeof LucideIcons;

const iconList = Object.keys(LucideIcons).filter(
  (key) =>
    key !== "createLucideIcon" && key !== "icons" && key !== "LucideIcon"
) as LucideIcon[];

interface IconPickerProps {
  value?: string;
  onChange: (icon?: string) => void;
  className?: string;
}

export function IconPicker({ value, onChange, className }: IconPickerProps) {
  const [search, setSearch] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);

  const filteredIcons = React.useMemo(() => {
    if (!iconList) return [];
    if (!search) return iconList;
    return iconList.filter((icon) =>
      icon.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const SelectedIcon = value ? LucideIcons[value as LucideIcon] : null;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-full justify-start gap-2", className)}
        >
          {SelectedIcon ? (
            <>
              <SelectedIcon className="h-4 w-4" />
              <span>{value}</span>
            </>
          ) : (
            <span>Seleccionar un icono</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2">
        <div className="space-y-2">
          <Input
            placeholder="Buscar icono..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9"
          />
          <ScrollArea className="h-48">
            <div className="grid grid-cols-5 gap-1">
              {filteredIcons.map((iconName) => {
                const Icon = LucideIcons[iconName];
                return (
                  <Button
                    key={iconName}
                    variant={value === iconName ? "default" : "ghost"}
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => {
                      onChange(iconName);
                      setIsOpen(false);
                    }}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="sr-only">{iconName}</span>
                  </Button>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
}
