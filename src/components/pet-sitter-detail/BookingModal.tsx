"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { createPortal } from "react-dom";
import { getNextTimeSlot } from "@/utils/timeFormat";
import {
  getCurrentOrNextBangkokTimeSlot,
  isPickerLocalYmdBeforeBangkokToday,
  isPickerLocalYmdSameBangkokToday,
} from "@/utils/bangkokWallTime";
import { ActionButton } from "@/components/ui/Button";
import { FormProvider, DatePicker, TimePicker } from "@/components/form";
import { getAvailableHoursBySitterId } from "@/services/api/sitter";
import type { Sitter } from "@/types/sitter";
import { CloseIcon, ClockIcon, CalendarIcon } from "@/assets/icons/components";

export interface BookingFormValues {
  startDate: Date | null;
  endDate: Date | null;
  startTime: string;
  endTime: string;
  note: string;
}

export interface ModalAction {
  label: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "ghost";
}

interface Props {
  sitter: Pick<Sitter, "tradeName">;
  sitterId: string;
  exceptedBookingId?: number;
  fixedDurationMinutes?: number;
  initialStartDate?: Date | null;
  onClose: () => void;
  onConfirm?: (data: BookingFormValues) => void | Promise<void>;
  actions?: ModalAction[];
}

function formatDateToYmd(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getContiguousEndTimes(
  start: string,
  availableSlots: string[],
  stepMinutes = 30,
): string[] {
  const startMinutes =
    Number(start.slice(0, 2)) * 60 + Number(start.slice(3, 5));
  const available = new Set(availableSlots);
  const contiguous: string[] = [];

  for (
    let next = startMinutes + stepMinutes;
    next < 24 * 60;
    next += stepMinutes
  ) {
    const hh = String(Math.floor(next / 60)).padStart(2, "0");
    const mm = String(next % 60).padStart(2, "0");
    const slot = `${hh}:${mm}`;

    if (!available.has(slot)) break;
    contiguous.push(slot);
  }

  return contiguous;
}

function addMinutesToTime(
  time: string,
  minutesToAdd: number,
): string | undefined {
  const [hourText, minuteText] = time.split(":");
  const hour = Number(hourText);
  const minute = Number(minuteText);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return undefined;

  const totalMinutes = hour * 60 + minute + minutesToAdd;
  if (totalMinutes < 0 || totalMinutes >= 24 * 60) return undefined;

  const hh = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
  const mm = String(totalMinutes % 60).padStart(2, "0");
  return `${hh}:${mm}`;
}

export function BookingModal({
  sitter,
  sitterId,
  exceptedBookingId,
  fixedDurationMinutes,
  initialStartDate,
  onClose,
  onConfirm,
  actions,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleClose = () => {
    if (isClosing) return;

    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

    if (isMobile) {
      setIsClosing(true);
    } else {
      onClose();
    }
  };

  const handleAnimationEnd = () => {
    if (isClosing) onClose();
  };

  const methods = useForm<BookingFormValues>({
    defaultValues: {
      startDate: initialStartDate ?? null,
      endDate: initialStartDate ?? null,
      startTime: "",
      endTime: "",
    },
  });

  /*
    2️⃣ watch startDate
    เพื่อให้ endDate = startDate เสมอ
  */
  const startDate = useWatch({
    control: methods.control,
    name: "startDate",
  });

  /*
    3️⃣ watch startTime
    เพื่อใช้กำหนดเวลาขั้นต่ำของ endTime
  */
  const startTime = useWatch({
    control: methods.control,
    name: "startTime",
  });
  const endTime = useWatch({
    control: methods.control,
    name: "endTime",
  });

  const isDateSelected = Boolean(startDate);

  const startTimeMin =
    startDate && isPickerLocalYmdSameBangkokToday(startDate, new Date())
      ? getCurrentOrNextBangkokTimeSlot(new Date(), 30)
      : undefined;

  const endTimeMin = startTime ? getNextTimeSlot(startTime, 30) : undefined;
  const isContinueDisabled = !startDate || !startTime || !endTime;
  const isFixedDurationMode =
    typeof fixedDurationMinutes === "number" && fixedDurationMinutes > 0;
  const startTimeOptions = availableSlots;
  const showNoAvailableSlotsMessage =
    isDateSelected && !isLoadingSlots && availableSlots.length === 0;
  const contiguousEndTimeOptions = useMemo(
    () => (startTime ? getContiguousEndTimes(startTime, availableSlots) : []),
    [startTime, availableSlots],
  );
  const fixedEndTime = useMemo(() => {
    if (!startTime || !isFixedDurationMode) return undefined;
    return addMinutesToTime(startTime, fixedDurationMinutes);
  }, [startTime, isFixedDurationMode, fixedDurationMinutes]);
  const isFixedEndTimeAvailable =
    Boolean(fixedEndTime) && contiguousEndTimeOptions.includes(fixedEndTime!);
  const endTimeOptions = isFixedDurationMode
    ? fixedEndTime && isFixedEndTimeAvailable
      ? [fixedEndTime]
      : []
    : contiguousEndTimeOptions;
  const showNoDepartureTimeMessage =
    isDateSelected &&
    !isLoadingSlots &&
    Boolean(startTime) &&
    endTimeOptions.length === 0 &&
    !isFixedDurationMode;
  const showFixedDurationUnavailableMessage =
    isDateSelected &&
    !isLoadingSlots &&
    Boolean(startTime) &&
    isFixedDurationMode &&
    !isFixedEndTimeAvailable;

  /*
    4️⃣ sync endDate กับ startDate
    เพราะตอนนี้ระบบจองได้วันเดียว
  */
  useEffect(() => {
    methods.setValue("endDate", startDate ?? null);
  }, [startDate, methods]);

  useEffect(() => {
    if (isDateSelected) return;

    setAvailableSlots([]);
    methods.setValue("startTime", "");
    methods.setValue("endTime", "");
  }, [isDateSelected, methods]);

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!startDate || !sitterId) return;

      setIsLoadingSlots(true);

      const result = await getAvailableHoursBySitterId(sitterId, {
        date: formatDateToYmd(startDate),
        exceptedBookingId,
      });

      setAvailableSlots(result.data?.availableSlots ?? []);
      methods.setValue("startTime", "");
      methods.setValue("endTime", "");
      setIsLoadingSlots(false);
    };

    fetchAvailableSlots();
  }, [startDate, sitterId, exceptedBookingId, methods]);

  /*
    5️⃣ ถ้า user เปลี่ยน startTime
    แล้ว endTime น้อยกว่า minTime
    ให้ reset endTime
  */
  useEffect(() => {
    if (!startTimeMin) return;

    const currentStart = methods.getValues("startTime");
    if (currentStart && currentStart < startTimeMin) {
      methods.setValue("startTime", "");
    }
  }, [startTimeMin, methods]);

  useEffect(() => {
    if (!startTime || !endTimeMin) return;

    const currentEnd = methods.getValues("endTime");

    if (
      currentEnd &&
      (currentEnd < endTimeMin || !endTimeOptions.includes(currentEnd))
    ) {
      methods.setValue("endTime", "");
    }
  }, [startTime, endTimeMin, endTimeOptions, methods]);

  useEffect(() => {
    if (!isFixedDurationMode) return;
    if (!startTime) {
      methods.setValue("endTime", "");
      return;
    }

    if (fixedEndTime && isFixedEndTimeAvailable) {
      methods.setValue("endTime", fixedEndTime);
      return;
    }

    methods.setValue("endTime", "");
  }, [
    isFixedDurationMode,
    startTime,
    fixedEndTime,
    isFixedEndTimeAvailable,
    methods,
  ]);

  useEffect(() => {
    if (!startTime) return;

    if (!startTimeOptions.includes(startTime)) {
      methods.setValue("startTime", "");
      methods.setValue("endTime", "");
    }
  }, [startTime, startTimeOptions, methods]);

  /*
    6️⃣ submit form
    และส่ง endDate = startDate ออกไป
  */
  const handleSubmit = async (data: BookingFormValues) => {
    if (!data.startDate || !data.startTime || !data.endTime) {
      return;
    }

    const normalizedData: BookingFormValues = {
      ...data,
      endDate: data.startDate,
    };

    await onConfirm?.(normalizedData);
    handleClose();
  };

  const oneYearFromNow = new Date(
    new Date().getFullYear() + 1,
    new Date().getMonth(),
    1,
  );

  if (!mounted) return null;

  const modalContent = (
    <>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes slideDown {
          from { transform: translateY(0); opacity: 1; }
          to { transform: translateY(100%); opacity: 0; }
        }

        @media (max-width: 767px) {
          .mobile-bottom-sheet {
            animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }

          .mobile-bottom-sheet-closing {
            animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        }
      `}</style>

      <div
        className="fixed inset-0 z-9999 flex items-end md:items-center justify-center bg-black/50 transition-opacity"
        onClick={handleClose}
        role="presentation"
      >
        <div
          className={`bg-white rounded-t-3xl md:rounded-2xl shadow-xl w-full md:max-w-[560px] md:mx-4 flex flex-col gap-5 h-[95vh] md:h-auto md:max-h-[90vh] mobile-bottom-sheet ${
            isClosing ? "mobile-bottom-sheet-closing" : ""
          }`}
          onClick={(e) => e.stopPropagation()}
          onAnimationEnd={handleAnimationEnd}
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-modal-title"
        >
          {/* Header */}
          <div className="flex items-start justify-between px-6 py-6 border-b border-gray-200 md:px-10">
            <h3
              id="booking-modal-title"
              className="style-headline-3 text-gray-600"
            >
              Booking with {sitter.tradeName}
            </h3>

            <button
              type="button"
              onClick={handleClose}
              className="text-gray-600 hover:text-gray-900 hover:cursor-pointer text-xl leading-none p-1"
              aria-label="Close"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Form */}
          <FormProvider
            methods={methods}
            onSubmit={handleSubmit}
            className="flex flex-col flex-1"
          >
            <div className="flex flex-col gap-4 px-6 py-6 flex-1 md:px-10">
              <p className="style-body-1 text-gray-600">
                Select date and time you want to schedule the service.
              </p>

              <div className="flex items-center gap-2">
                <CalendarIcon size={20} className="shrink-0 text-gray-500" />
                <DatePicker
                  name="startDate"
                  required
                  placeholder="Pet arrival date"
                  disabled={(date) =>
                    isPickerLocalYmdBeforeBangkokToday(date, new Date())
                  }
                  startMonth={new Date()}
                  endMonth={oneYearFromNow}
                />
              </div>

              <div className="flex items-center gap-2">
                <ClockIcon size={20} className="shrink-0 text-gray-500" />

                <TimePicker
                  name="startTime"
                  required
                  placeholder="Pet arrival time"
                  className="min-w-0 flex-1"
                  options={startTimeOptions}
                  minTime={startTimeMin}
                  stepMinutes={30}
                  disabled={
                    !isDateSelected ||
                    isLoadingSlots ||
                    showNoAvailableSlotsMessage
                  }
                />

                <span className="shrink-0 text-gray-500">-</span>

                <TimePicker
                  name="endTime"
                  required
                  placeholder="Pet departure time"
                  className="min-w-0 flex-1"
                  options={endTimeOptions}
                  minTime={endTimeMin}
                  stepMinutes={30}
                  disabled={
                    !isDateSelected ||
                    isLoadingSlots ||
                    !startTime ||
                    showNoDepartureTimeMessage ||
                    isFixedDurationMode
                  }
                />
              </div>

              {showFixedDurationUnavailableMessage && (
                <p className="style-body-3 text-red-500">
                  Selected arrival time does not match the fixed duration.
                </p>
              )}

              {showNoDepartureTimeMessage && (
                <p className="style-body-3 text-red-500">
                  No departure time available for the selected arrival time.
                </p>
              )}

              {showNoAvailableSlotsMessage && (
                <p className="style-body-3 text-red-500">
                  No available slots on this date.
                </p>
              )}

              {/* Actions */}
              <div className="flex justify-around gap-4 pt-2 mt-auto">
                {actions ? (
                  actions.map((action, i) => (
                    <ActionButton
                      key={i}
                      type={action.type ?? "button"}
                      variant={action.variant ?? "primary"}
                      className="flex-1"
                      onClick={action.onClick}
                      disabled={
                        action.type === "submit" ? isContinueDisabled : false
                      }
                    >
                      {action.label}
                    </ActionButton>
                  ))
                ) : (
                  <ActionButton
                    type="submit"
                    variant="primary"
                    className="flex-1"
                    disabled={isContinueDisabled}
                  >
                    Continue
                  </ActionButton>
                )}
              </div>
            </div>
          </FormProvider>
        </div>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
}
