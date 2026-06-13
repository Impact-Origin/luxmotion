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
  Wifi,
  Zap,
  Users,
  Briefcase,
  AlertCircle,
  Backpack,
  Luggage,
  Baby,
  Building2
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { VehicleForm } from "@/components/admin/vehicle-form";
import { toast } from "sonner";
import { cn } from "@workspace/ui/lib/utils";
import Image from "next/image";

export default function VehiclesPage() {
  const vehicles = useQuery(api.vehicles.list);
  const partnerships = useQuery(api.partnerships.list);
  const removeVehicle = useMutation(api.vehicles.remove);

  const [searchQuery, setSearchQuery] = React.useState("");
  const [partnershipFilter, setPartnershipFilter] = React.useState<string>("all");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingVehicle, setEditingVehicle] = React.useState<any>(null);

  const filteredVehicles = React.useMemo(() => {
    if (!vehicles) return [];

    return vehicles
      .filter((v) => {
        const matchesSearch =
          v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.partnershipName?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesPartnership =
          partnershipFilter === "all" ||
          (partnershipFilter === "global" && !v.partnershipId) ||
          v.partnershipId === partnershipFilter;

        const matchesStatus =
          statusFilter === "all" || v.status === statusFilter;

        return matchesSearch && matchesPartnership && matchesStatus;
      })
      .sort((a, b) => a.order - b.order);
  }, [vehicles, searchQuery, partnershipFilter, statusFilter]);

  const handleEdit = (vehicle: any) => {
    setEditingVehicle(vehicle);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: any) => {
    if (confirm("Are you sure you want to delete this vehicle?")) {
      try {
        await removeVehicle({ id });
        toast.success("Vehicle deleted successfully");
      } catch (error) {
        toast.error("Failed to delete vehicle");
      }
    }
  };

  const statusConfig = {
    active: { label: "Active", className: "bg-emerald-50 text-emerald-700 border-emerald-100" },
    inactive: { label: "Inactive", className: "bg-rose-50 text-rose-700 border-rose-100" },
    maintenance: { label: "Maintenance", className: "bg-amber-50 text-amber-700 border-amber-100" },
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-[#211c16]">Vehicles</h2>
          <p className="text-[#8a8074] text-sm">Manage your fleet and partnership-specific vehicles.</p>
        </div>
        <Button onClick={() => { setEditingVehicle(null); setIsFormOpen(true); }} className="bg-[#221c15] text-white hover:bg-[#3a3026]">
          <Plus className="mr-2 h-4 w-4" />
          Add Vehicle
        </Button>
      </div>

      <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-[#e7ddca] shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#a99e8c]" />
          <Input
            placeholder="Search vehicles..."
            className="pl-9 border-[#e7ddca]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={partnershipFilter} onValueChange={setPartnershipFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Owners" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Owners</SelectItem>
            <SelectItem value="global">EasyTransfer (Global)</SelectItem>
            {partnerships?.map((p) => (
              <SelectItem key={p._id} value={p._id}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {!vehicles ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[450px] w-full rounded-xl" />
          ))}
        </div>
      ) : filteredVehicles?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-[#ddd0b8]">
          <AlertCircle className="h-10 w-10 text-[#a99e8c] mb-4" />
          <p className="text-[#8a8074] font-medium">No vehicles found</p>
          <Button 
            variant="link" 
            onClick={() => setSearchQuery("")}
            className="text-[#211c16]"
          >
            Clear search
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredVehicles?.map((vehicle) => (
            <Card key={vehicle._id} className="overflow-hidden bg-white border-[#e7ddca] shadow-sm hover:shadow-md transition-all duration-200 group flex flex-col !p-0 !gap-0">
              <div className="relative aspect-[3.5/1] bg-white flex items-center justify-center shrink-0 overflow-hidden pt-1">
                {vehicle.imageUrl ? (
                  <Image
                    src={vehicle.imageUrl}
                    alt={vehicle.name}
                    fill
                    className="object-contain object-bottom p-0 transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-[#a99e8c]">
                    <AlertCircle className="h-8 w-8" />
                    <span className="text-xs">No image</span>
                  </div>
                )}
                <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                  <Badge className={cn("h-6 px-2.5 text-[10px] font-bold shadow-sm uppercase tracking-tight border-none", statusConfig[vehicle.status as keyof typeof statusConfig]?.className)}>
                    {statusConfig[vehicle.status as keyof typeof statusConfig]?.label}
                  </Badge>
                  {vehicle.partnershipId && (
                    <Badge variant="outline" className="bg-blue-50/80 backdrop-blur-sm text-blue-700 border-blue-100 flex items-center gap-1.5 text-[11px] h-6 px-2.5 font-bold shadow-sm">
                      <Building2 className="h-3.5 w-3.5" />
                      {vehicle.partnershipName}
                    </Badge>
                  )}
                </div>
                <div className="absolute top-2 left-2 flex gap-1.5">
                {vehicle.isElectric && (
                    <Badge className="bg-emerald-500 text-white border-none h-6 px-2.5 text-[10px] font-bold shadow-sm uppercase tracking-tight">
                      <Zap className="h-3 w-3 mr-1 fill-current" />
                      Electric
                    </Badge>
                  )}
                  {vehicle.hasWifi && (
                    <Badge className="bg-blue-500 text-white border-none h-6 px-2.5 text-[10px] font-bold shadow-sm uppercase tracking-tight">
                      <Wifi className="h-3 w-3 mr-1" />
                      Wi-Fi
                    </Badge>
                  )}
                  </div>
              </div>
              <CardContent className="px-5 pt-0 pb-5 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-lg text-[#211c16] mb-1">{vehicle.name}</h3>
                    <div className="flex items-center gap-2 text-[#8a8074] text-sm">
                        <Users className="h-3.5 w-3.5" />
                      <span className="font-medium text-[#4a443c]">{vehicle.passengers}</span>
                      <span className="text-[#a99e8c] mx-1">|</span>
                        <Briefcase className="h-3.5 w-3.5" />
                      <span className="font-medium text-[#4a443c]">{vehicle.luggage}</span>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-[#8a8074] hover:text-[#211c16] focus:ring-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => handleEdit(vehicle)}>
                        <Edit2 className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleDelete(vehicle._id)}
                        className="text-rose-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-4 flex-1">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex flex-col items-center p-2 rounded-lg bg-[#faf6ee] border border-[#efe7d8]">
                      <Backpack className="h-3.5 w-3.5 text-[#a99e8c] mb-1" />
                      <span className="text-xs font-bold text-[#4a443c]">{vehicle.maxBackpacks ?? 0}</span>
                      <span className="text-[8px] text-[#a99e8c] uppercase font-bold">Backpacks</span>
                    </div>
                    <div className="flex flex-col items-center p-2 rounded-lg bg-[#faf6ee] border border-[#efe7d8]">
                      <Luggage className="h-3.5 w-3.5 text-[#a99e8c] mb-1" />
                      <span className="text-xs font-bold text-[#4a443c]">{vehicle.maxHandLuggage ?? 0}</span>
                      <span className="text-[8px] text-[#a99e8c] uppercase font-bold">Hand</span>
                    </div>
                    <div className="flex flex-col items-center p-2 rounded-lg bg-[#faf6ee] border border-[#efe7d8]">
                      <Briefcase className="h-3.5 w-3.5 text-[#a99e8c] mb-1" />
                      <span className="text-xs font-bold text-[#4a443c]">{vehicle.maxCheckedBaggage ?? 0}</span>
                      <span className="text-[8px] text-[#a99e8c] uppercase font-bold">Checked</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex flex-col items-center p-2 rounded-lg bg-[#faf6ee] border border-[#efe7d8]">
                      <Baby className="h-3.5 w-3.5 text-[#a99e8c] mb-1" />
                      <span className="text-xs font-bold text-[#4a443c]">{vehicle.maxBabySeats ?? 0}</span>
                      <span className="text-[8px] text-[#a99e8c] uppercase font-bold">Baby</span>
                    </div>
                    <div className="flex flex-col items-center p-2 rounded-lg bg-[#faf6ee] border border-[#efe7d8]">
                      <Baby className="h-3.5 w-3.5 text-[#a99e8c] mb-1" />
                      <span className="text-xs font-bold text-[#4a443c]">{vehicle.maxChildSeats ?? 0}</span>
                      <span className="text-[8px] text-[#a99e8c] uppercase font-bold">Child</span>
                    </div>
                    <div className="flex flex-col items-center p-2 rounded-lg bg-[#faf6ee] border border-[#efe7d8]">
                      <Baby className="h-3.5 w-3.5 text-[#a99e8c] mb-1" />
                      <span className="text-xs font-bold text-[#4a443c]">{vehicle.maxBoosterSeats ?? 0}</span>
                      <span className="text-[8px] text-[#a99e8c] uppercase font-bold">Booster</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 mt-4 border-t border-[#efe7d8]">
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-[#a99e8c] uppercase font-bold tracking-wider">Day Rate</p>
                    <p className="text-sm font-bold text-[#211c16]">€{vehicle.pricePerKm.toFixed(2)}/km</p>
                  </div>
                  <div className="space-y-0.5 text-right">
                    <p className="text-[10px] text-[#a99e8c] uppercase font-bold tracking-wider">Night Rate</p>
                    <p className="text-sm font-bold text-[#211c16]">€{vehicle.pricePerKmNight.toFixed(2)}/km</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-[#a99e8c] uppercase font-bold tracking-wider">Minimum</p>
                    <p className="text-sm font-bold text-[#211c16]">€{vehicle.minimumPrice.toFixed(2)}</p>
                  </div>
                  <div className="space-y-0.5 text-right">
                    <p className="text-[10px] text-[#a99e8c] uppercase font-bold tracking-wider">Order</p>
                    <p className="text-sm font-bold text-[#211c16]">#{vehicle.order}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <VehicleForm
        key={editingVehicle?._id || "new"}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingVehicle(null);
        }}
        initialData={editingVehicle}
      />
    </div>
  );
}
