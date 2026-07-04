"use client";

import * as React from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@workspace/convex/api";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { marketingStatsDefaults } from "@/hooks/use-marketing-stats";
import { useMinAdvanceBookingHours } from "@/hooks/use-min-advance-hours";

type FormState = typeof marketingStatsDefaults;

function BookingSettingsCard() {
  const t = useTranslations("adminNumbers");
  const currentHours = useMinAdvanceBookingHours();
  const upsertBooking = useMutation(api.siteSettings.upsert);
  const [minAdvanceHours, setMinAdvanceHours] = React.useState("2");
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    setMinAdvanceHours(String(currentHours));
  }, [currentHours]);

  const save = async () => {
    const parsed = Number.parseFloat(minAdvanceHours);
    if (!Number.isFinite(parsed) || parsed < 0 || parsed > 720) {
      toast.error("Enter a value between 0 and 720 hours");
      return;
    }
    try {
      setIsSaving(true);
      await upsertBooking({ minAdvanceBookingHours: parsed });
      toast.success(t("saveSuccess"));
    } catch {
      toast.error(t("saveError"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-foreground">Booking</h2>
        <p className="text-sm text-muted-foreground">
          Minimum notice required to book a transfer — blocks last-minute
          bookings. Set to 0 to allow booking at any time.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="minAdvanceBookingHours">Minimum advance (hours)</Label>
        <div className="flex items-center gap-3">
          <Input
            id="minAdvanceBookingHours"
            type="number"
            min={0}
            step={0.5}
            className="max-w-[160px]"
            value={minAdvanceHours}
            onChange={(event) => setMinAdvanceHours(event.target.value)}
          />
          <Button
            onClick={save}
            disabled={isSaving}
            className="h-11 px-8 font-bold"
          >
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSaving ? t("saving") : t("save")}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function AdminNumbersPage() {
  const t = useTranslations("adminNumbers");
  const settings = useQuery(api.marketingStats.get);
  const tours = useQuery(api.tours.list);
  const events = useQuery(api.events.list);
  const upsertSettings = useMutation(api.marketingStats.upsert);
  const setTourManualReviewCount = useMutation(api.tours.setManualReviewCount);
  const clearTourManualReviewCount = useMutation(
    api.tours.clearManualReviewCount,
  );
  const setEventManualReviewCount = useMutation(
    api.events.setManualReviewCount,
  );
  const clearEventManualReviewCount = useMutation(
    api.events.clearManualReviewCount,
  );
  const [isSaving, setIsSaving] = React.useState(false);
  const [savingTourIds, setSavingTourIds] = React.useState<string[]>([]);
  const [clearingTourIds, setClearingTourIds] = React.useState<string[]>([]);
  const [savingEventIds, setSavingEventIds] = React.useState<string[]>([]);
  const [clearingEventIds, setClearingEventIds] = React.useState<string[]>([]);
  const [tourSearch, setTourSearch] = React.useState("");
  const [eventSearch, setEventSearch] = React.useState("");
  const [tourReviewDrafts, setTourReviewDrafts] = React.useState<
    Record<string, string>
  >({});
  const [eventReviewDrafts, setEventReviewDrafts] = React.useState<
    Record<string, string>
  >({});
  const [form, setForm] = React.useState<FormState>(marketingStatsDefaults);

  React.useEffect(() => {
    if (!settings) return;
    setForm(settings);
  }, [settings]);

  const updateField =
    (key: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number.parseInt(event.target.value, 10);
      setForm((prev) => ({
        ...prev,
        [key]: Number.isNaN(value) ? 0 : value,
      }));
    };

  const save = async () => {
    if (form.heroDailyTravelersMin > form.heroDailyTravelersMax) {
      toast.error(t("errors.heroRange"));
      return;
    }

    if (form.detailDailyTravelersMin > form.detailDailyTravelersMax) {
      toast.error(t("errors.detailRange"));
      return;
    }

    if (form.checkoutBookedTodayMin > form.checkoutBookedTodayMax) {
      toast.error(t("errors.checkoutRange"));
      return;
    }

    try {
      setIsSaving(true);
      await upsertSettings(form);
      toast.success(t("saveSuccess"));
    } catch {
      toast.error(t("saveError"));
    } finally {
      setIsSaving(false);
    }
  };

  const getDraftValue = (
    drafts: Record<string, string>,
    id: string,
    manualReviewCount: number | undefined,
  ) => {
    const draft = drafts[id];
    if (draft !== undefined) return draft;
    return String(manualReviewCount ?? 0);
  };

  const parseManualReviewCount = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return 0;
    const parsed = Number.parseInt(trimmed, 10);
    if (!Number.isFinite(parsed) || Number.isNaN(parsed)) return null;
    if (!Number.isInteger(parsed) || parsed < 0) return null;
    return parsed;
  };

  const saveTourReviewCount = async (tour: any) => {
    const id = String(tour._id);
    const parsed = parseManualReviewCount(
      getDraftValue(tourReviewDrafts, id, tour.manualReviewCount),
    );

    if (parsed === null) {
      toast.error(t("errors.manualReviewCountInvalid"));
      return;
    }

    try {
      setSavingTourIds((prev) => [...prev, id]);
      await setTourManualReviewCount({
        id: tour._id,
        manualReviewCount: parsed,
      });
      toast.success(t("toasts.tourSaved"));
    } catch {
      toast.error(t("toasts.tourSaveError"));
    } finally {
      setSavingTourIds((prev) => prev.filter((value) => value !== id));
    }
  };

  const clearTourReviewCount = async (tour: any) => {
    const id = String(tour._id);

    try {
      setClearingTourIds((prev) => [...prev, id]);
      await clearTourManualReviewCount({ id: tour._id });
      setTourReviewDrafts((prev) => ({
        ...prev,
        [id]: "0",
      }));
      toast.success(t("toasts.tourCleared"));
    } catch {
      toast.error(t("toasts.tourClearError"));
    } finally {
      setClearingTourIds((prev) => prev.filter((value) => value !== id));
    }
  };

  const saveEventReviewCount = async (event: any) => {
    const id = String(event._id);
    const parsed = parseManualReviewCount(
      getDraftValue(eventReviewDrafts, id, event.manualReviewCount),
    );

    if (parsed === null) {
      toast.error(t("errors.manualReviewCountInvalid"));
      return;
    }

    try {
      setSavingEventIds((prev) => [...prev, id]);
      await setEventManualReviewCount({
        id: event._id,
        manualReviewCount: parsed,
      });
      toast.success(t("toasts.eventSaved"));
    } catch {
      toast.error(t("toasts.eventSaveError"));
    } finally {
      setSavingEventIds((prev) => prev.filter((value) => value !== id));
    }
  };

  const clearEventReviewCount = async (event: any) => {
    const id = String(event._id);

    try {
      setClearingEventIds((prev) => [...prev, id]);
      await clearEventManualReviewCount({ id: event._id });
      setEventReviewDrafts((prev) => ({
        ...prev,
        [id]: "0",
      }));
      toast.success(t("toasts.eventCleared"));
    } catch {
      toast.error(t("toasts.eventClearError"));
    } finally {
      setClearingEventIds((prev) => prev.filter((value) => value !== id));
    }
  };

  const filteredTours = React.useMemo(() => {
    if (!tours) return [];
    const search = tourSearch.trim().toLowerCase();
    if (!search) return tours;
    return tours.filter(
      (tour) =>
        tour.title.toLowerCase().includes(search) ||
        tour.destination.toLowerCase().includes(search),
    );
  }, [tourSearch, tours]);

  const filteredEvents = React.useMemo(() => {
    if (!events) return [];
    const search = eventSearch.trim().toLowerCase();
    if (!search) return events;
    return events.filter(
      (event) =>
        event.title.toLowerCase().includes(search) ||
        event.location.toLowerCase().includes(search),
    );
  }, [eventSearch, events]);

  if (!settings || !tours || !events) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <BookingSettingsCard />
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-foreground">
          {t("sections.reviews")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="trustpilotReviewCount">
              {t("fields.trustpilotReviewCount")}
            </Label>
            <Input
              id="trustpilotReviewCount"
              type="number"
              min={0}
              value={form.trustpilotReviewCount ?? 0}
              onChange={updateField("trustpilotReviewCount")}
            />
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-foreground">
          {t("sections.perItemReviews")}
        </h2>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">
              {t("lists.tours")}
            </h3>
            <Input
              value={tourSearch}
              onChange={(event) => setTourSearch(event.target.value)}
              placeholder={t("filters.searchTours")}
            />
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="max-h-[420px] overflow-auto divide-y divide-border">
                {filteredTours.length === 0 ? (
                  <div className="p-4 text-sm text-muted-foreground">
                    {t("lists.noTours")}
                  </div>
                ) : (
                  filteredTours.map((tour) => {
                    const id = String(tour._id);
                    const isSavingTour = savingTourIds.includes(id);
                    const isClearingTour = clearingTourIds.includes(id);
                    const inputValue = getDraftValue(
                      tourReviewDrafts,
                      id,
                      tour.manualReviewCount,
                    );

                    return (
                      <div key={id} className="p-4 space-y-3">
                        <div>
                          <p className="font-medium text-foreground break-all">
                            {tour.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {t("lists.destination")}: {tour.destination}
                          </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <div className="text-xs text-muted-foreground">
                            <p>{t("lists.baseReviewCount")}</p>
                            <p className="font-semibold text-foreground">
                              {tour.baseReviewCount ??
                                Math.max(
                                  0,
                                  (tour.reviewCount ?? 0) -
                                    (tour.manualReviewCount ?? 0),
                                )}
                            </p>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            <p>{t("lists.displayedReviewCount")}</p>
                            <p className="font-semibold text-foreground">
                              {tour.reviewCount ?? 0}
                            </p>
                          </div>
                          <div>
                            <Label
                              className="text-xs"
                              htmlFor={`tour-review-${id}`}
                            >
                              {t("lists.overrideValue")}
                            </Label>
                            <Input
                              id={`tour-review-${id}`}
                              min={0}
                              type="number"
                              value={inputValue ?? ""}
                              onChange={(event) =>
                                setTourReviewDrafts((prev) => ({
                                  ...prev,
                                  [id]: event.target.value,
                                }))
                              }
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            onClick={() => clearTourReviewCount(tour)}
                            disabled={isSavingTour || isClearingTour}
                          >
                            {isClearingTour && (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {isClearingTour
                              ? t("lists.clearing")
                              : t("lists.clear")}
                          </Button>
                          <Button
                            onClick={() => saveTourReviewCount(tour)}
                            disabled={isSavingTour || isClearingTour}
                          >
                            {isSavingTour && (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {isSavingTour ? t("lists.saving") : t("lists.save")}
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">
              {t("lists.events")}
            </h3>
            <Input
              value={eventSearch}
              onChange={(event) => setEventSearch(event.target.value)}
              placeholder={t("filters.searchEvents")}
            />
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="max-h-[420px] overflow-auto divide-y divide-border">
                {filteredEvents.length === 0 ? (
                  <div className="p-4 text-sm text-muted-foreground">
                    {t("lists.noEvents")}
                  </div>
                ) : (
                  filteredEvents.map((event) => {
                    const id = String(event._id);
                    const isSavingEvent = savingEventIds.includes(id);
                    const isClearingEvent = clearingEventIds.includes(id);
                    const inputValue = getDraftValue(
                      eventReviewDrafts,
                      id,
                      event.manualReviewCount,
                    );

                    return (
                      <div key={id} className="p-4 space-y-3">
                        <div>
                          <p className="font-medium text-foreground break-all">
                            {event.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {t("lists.location")}: {event.location}
                          </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <div className="text-xs text-muted-foreground">
                            <p>{t("lists.baseReviewCount")}</p>
                            <p className="font-semibold text-foreground">
                              {event.baseReviewCount ??
                                Math.max(
                                  0,
                                  (event.reviewCount ?? 0) -
                                    (event.manualReviewCount ?? 0),
                                )}
                            </p>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            <p>{t("lists.displayedReviewCount")}</p>
                            <p className="font-semibold text-foreground">
                              {event.reviewCount ?? 0}
                            </p>
                          </div>
                          <div>
                            <Label
                              className="text-xs"
                              htmlFor={`event-review-${id}`}
                            >
                              {t("lists.overrideValue")}
                            </Label>
                            <Input
                              id={`event-review-${id}`}
                              min={0}
                              type="number"
                              value={inputValue ?? ""}
                              onChange={(eventInput) =>
                                setEventReviewDrafts((prev) => ({
                                  ...prev,
                                  [id]: eventInput.target.value,
                                }))
                              }
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            onClick={() => clearEventReviewCount(event)}
                            disabled={isSavingEvent || isClearingEvent}
                          >
                            {isClearingEvent && (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {isClearingEvent
                              ? t("lists.clearing")
                              : t("lists.clear")}
                          </Button>
                          <Button
                            onClick={() => saveEventReviewCount(event)}
                            disabled={isSavingEvent || isClearingEvent}
                          >
                            {isSavingEvent && (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {isSavingEvent
                              ? t("lists.saving")
                              : t("lists.save")}
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-foreground">
          {t("sections.dailyNumbers")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="heroDailyTravelersMin">
              {t("fields.heroDailyTravelersMin")}
            </Label>
            <Input
              id="heroDailyTravelersMin"
              type="number"
              min={0}
              value={form.heroDailyTravelersMin ?? 0}
              onChange={updateField("heroDailyTravelersMin")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="heroDailyTravelersMax">
              {t("fields.heroDailyTravelersMax")}
            </Label>
            <Input
              id="heroDailyTravelersMax"
              type="number"
              min={0}
              value={form.heroDailyTravelersMax ?? 0}
              onChange={updateField("heroDailyTravelersMax")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="detailDailyTravelersMin">
              {t("fields.detailDailyTravelersMin")}
            </Label>
            <Input
              id="detailDailyTravelersMin"
              type="number"
              min={0}
              value={form.detailDailyTravelersMin ?? 0}
              onChange={updateField("detailDailyTravelersMin")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="detailDailyTravelersMax">
              {t("fields.detailDailyTravelersMax")}
            </Label>
            <Input
              id="detailDailyTravelersMax"
              type="number"
              min={0}
              value={form.detailDailyTravelersMax ?? 0}
              onChange={updateField("detailDailyTravelersMax")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="checkoutBookedTodayMin">
              {t("fields.checkoutBookedTodayMin")}
            </Label>
            <Input
              id="checkoutBookedTodayMin"
              type="number"
              min={0}
              value={form.checkoutBookedTodayMin ?? 0}
              onChange={updateField("checkoutBookedTodayMin")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="checkoutBookedTodayMax">
              {t("fields.checkoutBookedTodayMax")}
            </Label>
            <Input
              id="checkoutBookedTodayMax"
              type="number"
              min={0}
              value={form.checkoutBookedTodayMax ?? 0}
              onChange={updateField("checkoutBookedTodayMax")}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={save}
          disabled={isSaving}
          className="h-11 px-8 font-bold"
        >
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSaving ? t("saving") : t("save")}
        </Button>
      </div>
    </div>
  );
}
