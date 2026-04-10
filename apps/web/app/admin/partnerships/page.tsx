"use client";

import * as React from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@workspace/convex/api";
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  ExternalLink,
  Settings,
  AlertCircle
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Badge } from "@workspace/ui/components/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { toast } from "sonner";
import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function PartnershipsPage() {
  const partnerships = useQuery(api.partnerships.list);
  const removePartnership = useMutation(api.partnerships.remove);
  const router = useRouter();
  const t = useTranslations("admin");
  
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredPartnerships = partnerships?.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: any) => {
    if (confirm("Are you sure you want to delete this partnership?")) {
      try {
        await removePartnership({ id });
        toast.success("Partnership removed successfully");
      } catch (error) {
        toast.error("Failed to remove partnership");
      }
    }
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">{t("partnerships")}</h2>
          <p className="text-sm text-zinc-500">Manage your referrals and partner-specific landing pages.</p>
        </div>
        <Link href="/admin/partnerships/new">
          <Button className="bg-zinc-900 text-white hover:bg-zinc-800 font-bold px-6">
            <Plus className="mr-2 h-4 w-4" />
            {t("newPartnership")}
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-zinc-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search partnerships..."
            className="pl-9 bg-zinc-50/50 border-zinc-200 focus:bg-white transition-colors"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {!partnerships ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full rounded-xl" />
          ))}
        </div>
      ) : filteredPartnerships?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-zinc-300">
          <AlertCircle className="h-10 w-10 text-zinc-400 mb-4" />
          <p className="text-zinc-500 font-medium">No partnerships found</p>
          <Button 
            variant="link" 
            onClick={() => setSearchQuery("")}
            className="text-zinc-900"
          >
            Clear search
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPartnerships?.map((p) => (
            <Card key={p._id} className="overflow-hidden bg-white border-zinc-200 shadow-sm hover:shadow-md transition-all duration-200 group py-6">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <Link href={`/admin/partnerships/${p._id}`} className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg text-zinc-900 hover:text-blue-600 transition-colors cursor-pointer">{p.name}</h3>
                    </div>
                    <p className="text-sm text-zinc-500 font-mono">/{p.slug}</p>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-zinc-900 focus:ring-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href={`/admin/partnerships/${p._id}`} className="flex items-center">
                          <Settings className="mr-2 h-4 w-4 text-zinc-500" />
                          <span>{t("settings")}</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href={`/${p.slug}`} target="_blank" className="flex items-center justify-between w-full">
                          <div className="flex items-center">
                            <ExternalLink className="mr-2 h-4 w-4 text-zinc-500" />
                            <span>{t("viewLiveSite")}</span>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleDelete(p._id)}
                        className="text-rose-600 cursor-pointer focus:text-rose-600 focus:bg-rose-50"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>{t("remove")}</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-center gap-4 mt-6">
                  <div className="flex -space-x-2">
                    {p.theme?.colors && Object.entries(p.theme.colors).slice(0, 4).map(([key, color]) => (
                      <div 
                        key={key}
                        className="h-6 w-6 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: color as string }}
                        title={key}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

