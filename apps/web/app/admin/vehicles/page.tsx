"use client";

import * as React from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@workspace/convex/api";
import { Plus, MoreVertical, Edit2, Trash2, Wifi, Zap, Building2, Car } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import Image from "next/image";
import { toast } from "sonner";
import { VehicleForm } from "@/components/admin/vehicle-form";
import { StatusBadge } from "@/components/admin/status-badge";
import { DataTable, type DataTableColumn, type DataTableFilter } from "@/components/admin/data-table";

export default function VehiclesPage() {
  const vehicles = useQuery(api.vehicles.list);
  const partnerships = useQuery(api.partnerships.list);
  const removeVehicle = useMutation(api.vehicles.remove);

  type Vehicle = NonNullable<typeof vehicles>[number];

  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingVehicle, setEditingVehicle] = React.useState<any>(null);

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: Vehicle["_id"]) => {
    if (confirm("Are you sure you want to delete this vehicle?")) {
      try {
        await removeVehicle({ id });
        toast.success("Vehicle deleted");
      } catch {
        toast.error("Failed to delete vehicle");
      }
    }
  };

  const rowActions = (v: Vehicle) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8 text-muted-foreground">
          <MoreVertical className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={() => handleEdit(v)}>
          <Edit2 className="mr-2 size-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => handleDelete(v._id)}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 size-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const columns: DataTableColumn<Vehicle>[] = [
    {
      id: "name",
      header: "Vehicle",
      sortAccessor: (v) => v.name.toLowerCase(),
      cell: (v) => (
        <div className="flex items-center gap-3">
          <div className="relative flex h-9 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-muted">
            {v.imageUrl ? (
              <Image src={v.imageUrl} alt={v.name} fill className="object-contain" />
            ) : (
              <Car className="size-4 text-muted-foreground" />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-foreground">{v.name}</span>
              {v.isElectric && <Zap className="size-3.5 text-emerald-600" />}
              {v.hasWifi && <Wifi className="size-3.5 text-blue-600" />}
            </div>
            <p className="text-xs text-muted-foreground">
              {v.passengers} pax · {v.luggage} bags
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: (v) => <StatusBadge status={v.status} />,
    },
    {
      id: "day",
      header: "Day rate",
      align: "right",
      sortAccessor: (v) => v.pricePerKm,
      cell: (v) => <span className="tabular-nums">€{v.pricePerKm.toFixed(2)}/km</span>,
    },
    {
      id: "night",
      header: "Night rate",
      align: "right",
      sortAccessor: (v) => v.pricePerKmNight,
      cell: (v) => (
        <span className="tabular-nums text-muted-foreground">€{v.pricePerKmNight.toFixed(2)}/km</span>
      ),
    },
    {
      id: "min",
      header: "Min",
      align: "right",
      sortAccessor: (v) => v.minimumPrice,
      cell: (v) => <span className="tabular-nums">€{v.minimumPrice.toFixed(2)}</span>,
    },
    {
      id: "owner",
      header: "Owner",
      cell: (v) =>
        v.partnershipId ? (
          <span className="inline-flex items-center gap-1.5 text-sm">
            <Building2 className="size-3.5 text-muted-foreground" />
            {v.partnershipName}
          </span>
        ) : (
          <span className="text-sm text-muted-foreground">EasyTransfer</span>
        ),
    },
  ];

  const filters: DataTableFilter<Vehicle>[] = [
    {
      id: "owner",
      label: "All owners",
      width: "w-[170px]",
      options: [
        { value: "global", label: "EasyTransfer" },
        ...(partnerships ?? []).map((p) => ({ value: p._id, label: p.name })),
      ],
      predicate: (v, val) => (val === "global" ? !v.partnershipId : v.partnershipId === val),
    },
    {
      id: "status",
      label: "All status",
      width: "w-[140px]",
      options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
        { value: "maintenance", label: "Maintenance" },
      ],
      predicate: (v, val) => v.status === val,
    },
  ];

  const renderCard = (v: Vehicle) => (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card">
      <div className="relative flex aspect-[16/7] items-center justify-center border-b border-border bg-muted/40">
        {v.imageUrl ? (
          <Image src={v.imageUrl} alt={v.name} fill className="object-contain p-2" />
        ) : (
          <Car className="size-8 text-muted-foreground" />
        )}
        <div className="absolute right-2 top-2">
          <StatusBadge status={v.status} />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="truncate font-medium text-foreground">{v.name}</h3>
              {v.isElectric && <Zap className="size-3.5 shrink-0 text-emerald-600" />}
              {v.hasWifi && <Wifi className="size-3.5 shrink-0 text-blue-600" />}
            </div>
            <p className="text-xs text-muted-foreground">
              {v.passengers} pax · {v.luggage} bags · {v.partnershipId ? v.partnershipName : "EasyTransfer"}
            </p>
          </div>
          {rowActions(v)}
        </div>
        <div className="mt-auto grid grid-cols-3 gap-2 border-t border-border pt-3">
          <div>
            <p className="text-[11px] text-muted-foreground">Day</p>
            <p className="text-sm font-medium tabular-nums">€{v.pricePerKm.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground">Night</p>
            <p className="text-sm font-medium tabular-nums">€{v.pricePerKmNight.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground">Min</p>
            <p className="text-sm font-medium tabular-nums">€{v.minimumPrice.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <DataTable<Vehicle>
        data={vehicles}
        columns={columns}
        searchKeys={["name", (v) => v.partnershipName]}
        searchPlaceholder="Search vehicles"
        filters={filters}
        renderCard={renderCard}
        rowActions={rowActions}
        toolbarActions={
          <Button
            onClick={() => {
              setEditingVehicle(null);
              setIsFormOpen(true);
            }}
          >
            <Plus className="mr-2 size-4" />
            Add vehicle
          </Button>
        }
        emptyTitle="No vehicles found"
        emptyDescription="Add a vehicle or adjust your search and filters."
        emptyIcon={Car}
      />

      <VehicleForm
        key={editingVehicle?._id || "new"}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingVehicle(null);
        }}
        initialData={editingVehicle}
      />
    </>
  );
}
