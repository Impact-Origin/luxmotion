"use client";

import * as React from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@workspace/convex/api";
import { Id } from "@workspace/convex/dataModel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Checkbox } from "@workspace/ui/components/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { ImageUpload } from "./image-upload";
import { toast } from "sonner";
import { Loader2, Briefcase, Baby, Zap, Wifi, Info } from "lucide-react";
import { Separator } from "@workspace/ui/components/separator";

interface VehicleFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any;
}

export function VehicleForm({ isOpen, onClose, initialData }: VehicleFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const partnerships = useQuery(api.partnerships.list);
  
  const [name, setName] = React.useState(initialData?.name || "");
  const [imageId, setImageId] = React.useState<string | undefined>(initialData?.imageId);
  const [partnershipId, setPartnershipId] = React.useState<string | undefined>(initialData?.partnershipId || "global");
  const [passengers, setPassengers] = React.useState(initialData?.passengers || 4);
  const [luggage, setLuggage] = React.useState(initialData?.luggage || 4);
  
  const [maxBackpacks, setMaxBackpacks] = React.useState(initialData?.maxBackpacks || 4);
  const [maxHandLuggage, setMaxHandLuggage] = React.useState(initialData?.maxHandLuggage || 4);
  const [maxCheckedBaggage, setMaxCheckedBaggage] = React.useState(initialData?.maxCheckedBaggage || 4);
  const [maxChildSeats, setMaxChildSeats] = React.useState(initialData?.maxChildSeats || 2);
  const [maxBabySeats, setMaxBabySeats] = React.useState(initialData?.maxBabySeats || 2);
  const [maxBoosterSeats, setMaxBoosterSeats] = React.useState(initialData?.maxBoosterSeats || 2);

  const [pricePerKm, setPricePerKm] = React.useState(initialData?.pricePerKm || 0.85);
  const [pricePerKmNight, setPricePerKmNight] = React.useState(initialData?.pricePerKmNight || 1.05);
  const [minimumPrice, setMinimumPrice] = React.useState(initialData?.minimumPrice || 35);
  const [hasWifi, setHasWifi] = React.useState(initialData?.hasWifi ?? true);
  const [isElectric, setIsElectric] = React.useState(initialData?.isElectric ?? false);
  const [status, setStatus] = React.useState<"active" | "inactive" | "maintenance">(initialData?.status || "active");
  const [order, setOrder] = React.useState(initialData?.order || 0);

  const createVehicle = useMutation(api.vehicles.create);
  const updateVehicle = useMutation(api.vehicles.update);

  const [previewUrl, setPreviewUrl] = React.useState<string | null>(initialData?.imageUrl || null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      
      const data = {
        name,
        imageId: imageId as any,
        partnershipId: partnershipId === "global" ? undefined : partnershipId as any,
        passengers: Number(passengers),
        luggage: Number(luggage),
        maxBackpacks: Number(maxBackpacks),
        maxHandLuggage: Number(maxHandLuggage),
        maxCheckedBaggage: Number(maxCheckedBaggage),
        maxChildSeats: Number(maxChildSeats),
        maxBabySeats: Number(maxBabySeats),
        maxBoosterSeats: Number(maxBoosterSeats),
        pricePerKm: Number(pricePerKm),
        pricePerKmNight: Number(pricePerKmNight),
        minimumPrice: Number(minimumPrice),
        hasWifi,
        isElectric,
        status,
        order: Number(order),
      };

      if (initialData) {
        await updateVehicle({ id: initialData._id, ...data });
        toast.success("Vehicle updated successfully");
      } else {
        await createVehicle(data);
        toast.success("Vehicle created successfully");
      }
      
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0 flex flex-col overflow-hidden">
        <DialogHeader className="p-6 border-b shrink-0">
          <DialogTitle>{initialData ? "Edit Vehicle" : "Add New Vehicle"}</DialogTitle>
          <DialogDescription>
            Enter the details for the vehicle. These will be visible to customers during checkout.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="flex-1 overflow-y-auto min-h-0 flex flex-col">
          <div className="p-6 space-y-8 flex-1">
          <div className="space-y-4">
              <Label className="text-base font-bold flex items-center gap-2">
                <Info className="h-4 w-4" /> General Information
              </Label>
            <ImageUpload 
              value={previewUrl} 
              onChange={(id) => {
                setImageId(id);
                if (!id) setPreviewUrl(null);
              }}
              disabled={isSubmitting}
            />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Vehicle Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Mercedes V-Class"
                required
                disabled={isSubmitting}
                    className="h-11"
              />
            </div>
            <div className="space-y-2">
                  <Label htmlFor="ownership">Owner / Partnership</Label>
              <Select 
                    value={partnershipId} 
                    onValueChange={setPartnershipId}
                disabled={isSubmitting}
              >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select owner" />
                </SelectTrigger>
                <SelectContent>
                      <SelectItem value="global">Main Organization (EasyTransfer)</SelectItem>
                      {partnerships?.map((p) => (
                        <SelectItem key={p._id} value={p._id}>{p.name}</SelectItem>
                      ))}
                </SelectContent>
              </Select>
            </div>
          </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="passengers">Max Passengers</Label>
                  <Input
                    id="passengers"
                    type="number"
                    value={passengers}
                    onChange={(e) => setPassengers(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="luggage">Max Luggage</Label>
                  <Input
                    id="luggage"
                    type="number"
                    value={luggage}
                    onChange={(e) => setLuggage(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="order">Display Order</Label>
                  <Input
                    id="order"
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="h-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={(val) => setStatus(val as typeof status)} disabled={isSubmitting}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <Label className="text-base font-bold flex items-center gap-2">
                <Briefcase className="h-4 w-4" /> Luggage Limits
              </Label>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxBackpacks">Max Backpacks</Label>
                  <Input
                    id="maxBackpacks"
                    type="number"
                    value={maxBackpacks}
                    onChange={(e) => setMaxBackpacks(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxHandLuggage">Max Hand Luggage</Label>
                  <Input
                    id="maxHandLuggage"
                    type="number"
                    value={maxHandLuggage}
                    onChange={(e) => setMaxHandLuggage(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxCheckedBaggage">Max Checked Baggage</Label>
                  <Input
                    id="maxCheckedBaggage"
                    type="number"
                    value={maxCheckedBaggage}
                    onChange={(e) => setMaxCheckedBaggage(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="h-11"
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <Label className="text-base font-bold flex items-center gap-2">
                <Baby className="h-4 w-4" /> Child Seat Limits
              </Label>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxBabySeats">Max Baby Seats</Label>
                  <Input
                    id="maxBabySeats"
                    type="number"
                    value={maxBabySeats}
                    onChange={(e) => setMaxBabySeats(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxChildSeats">Max Child Seats</Label>
                  <Input
                    id="maxChildSeats"
                    type="number"
                    value={maxChildSeats}
                    onChange={(e) => setMaxChildSeats(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxBoosterSeats">Max Booster Seats</Label>
                  <Input
                    id="maxBoosterSeats"
                    type="number"
                    value={maxBoosterSeats}
                    onChange={(e) => setMaxBoosterSeats(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="h-11"
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <Label className="text-base font-bold">Pricing Configuration</Label>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pricePerKm">Price / km (Day)</Label>
              <div className="relative">
                    <span className="absolute left-3 top-3 text-zinc-500 text-sm">€</span>
                <Input
                  id="pricePerKm"
                  type="number"
                  step="0.01"
                      className="pl-7 h-11"
                  value={pricePerKm}
                  onChange={(e) => setPricePerKm(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pricePerKmNight">Price / km (Night)</Label>
              <div className="relative">
                    <span className="absolute left-3 top-3 text-zinc-500 text-sm">€</span>
                <Input
                  id="pricePerKmNight"
                  type="number"
                  step="0.01"
                      className="pl-7 h-11"
                  value={pricePerKmNight}
                  onChange={(e) => setPricePerKmNight(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="minimumPrice">Minimum Price</Label>
              <div className="relative">
                    <span className="absolute left-3 top-3 text-zinc-500 text-sm">€</span>
                <Input
                  id="minimumPrice"
                  type="number"
                  step="0.01"
                      className="pl-7 h-11"
                  value={minimumPrice}
                  onChange={(e) => setMinimumPrice(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-8 py-4 px-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <Checkbox
                id="wifi"
                checked={hasWifi}
                  onCheckedChange={(checked) => setHasWifi(checked as boolean)}
                disabled={isSubmitting}
                  className="size-5"
              />
                <div className="flex items-center gap-2 font-semibold text-sm text-zinc-700 group-hover:text-zinc-900 transition-colors">
                  <Wifi className="h-4 w-4 text-blue-500" /> Wi-Fi Available
            </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <Checkbox
                id="electric"
                checked={isElectric}
                  onCheckedChange={(checked) => setIsElectric(checked as boolean)}
                disabled={isSubmitting}
                  className="size-5"
              />
                <div className="flex items-center gap-2 font-semibold text-sm text-zinc-700 group-hover:text-zinc-900 transition-colors">
                  <Zap className="h-4 w-4 text-emerald-500" /> Electric Vehicle
                </div>
              </label>
            </div>
          </div>

          <div className="p-6 border-t bg-zinc-50 flex justify-end gap-3 shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-11 px-6"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-zinc-900 text-white hover:bg-zinc-800 h-11 px-8 font-bold">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {initialData ? "Save Changes" : "Create Vehicle"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
