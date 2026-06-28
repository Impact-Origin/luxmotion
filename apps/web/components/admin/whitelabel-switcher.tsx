"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@workspace/ui/components/command";

interface SwitcherPartnership {
  _id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
}

export function WhitelabelSwitcher({
  partnerships,
  variant = "full",
  currentId,
  align = "start",
}: {
  partnerships: SwitcherPartnership[] | undefined;
  variant?: "full" | "compact";
  currentId?: string;
  align?: "start" | "center" | "end";
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const current = partnerships?.find((p) => p._id === currentId);

  const onSelect = (id: string) => {
    setOpen(false);
    router.push(`/admin/partnerships/${id}`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {variant === "compact" ? (
          <Button variant="outline" size="sm" role="combobox" aria-expanded={open} className="h-9 gap-2">
            <span className="max-w-[180px] truncate">{current?.name ?? "Select whitelabel"}</span>
            <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
          </Button>
        ) : (
          <Button variant="outline" role="combobox" aria-expanded={open} className="gap-2">
            <Search className="size-4 opacity-60" />
            Jump to whitelabel…
            <ChevronsUpDown className="ml-1 size-4 shrink-0 opacity-50" />
          </Button>
        )}
      </PopoverTrigger>
      {/* admin-theme on the content itself: Radix portals this to <body>, outside
          the .admin-theme scope, so without it --popover doesn't resolve and the
          panel paints see-through over the editor. */}
      <PopoverContent align={align} className="admin-theme w-[280px] p-0">
        <Command>
          <CommandInput placeholder="Search whitelabels…" />
          <CommandList>
            <CommandEmpty>No whitelabel found.</CommandEmpty>
            <CommandGroup>
              {partnerships?.map((p) => (
                <CommandItem
                  key={p._id}
                  value={`${p.name} ${p.slug}`}
                  onSelect={() => onSelect(p._id)}
                  className="gap-2"
                >
                  <span className="relative flex size-6 shrink-0 items-center justify-center overflow-hidden rounded bg-muted">
                    {p.logoUrl ? (
                      <Image src={p.logoUrl} alt="" fill className="object-contain" />
                    ) : (
                      <span className="text-[10px] font-medium text-muted-foreground">
                        {p.name.charAt(0)}
                      </span>
                    )}
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate text-sm">{p.name}</span>
                    <span className="truncate text-xs text-muted-foreground">/{p.slug}</span>
                  </span>
                  {currentId === p._id && <Check className="ml-auto size-4" />}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
