"use client";

import { useEffect, useState } from "react";
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
  onClose: () => void;
  onConfirm?: (data: BookingFormValues) => void | Promise<void>;
  actions?: ModalAction[];
}

export function BookingModal({ sitter, onClose, onConfirm, actions }: Props) {
  const [mounted, setMounted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

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
      startDate: null,
      endDate: null,
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

  /*
    4️⃣ sync endDate กับ startDate
    เพราะตอนนี้ระบบจองได้วันเดียว
  */
  useEffect(() => {
    methods.setValue("endDate", startDate ?? null);
  }, [startDate, methods]);

  useEffect(() => {
    if (isDateSelected) return;

    methods.setValue("startTime", "");
    methods.setValue("endTime", "");
  }, [isDateSelected, methods]);

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

    if (currentEnd && currentEnd < endTimeMin) {
      methods.setValue("endTime", "");
    }
  }, [startTime, endTimeMin, methods]);

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
                  minTime={startTimeMin}
                  stepMinutes={30}
                  disabled={!isDateSelected}
                />

                <span className="shrink-0 text-gray-500">-</span>

                <TimePicker
                  name="endTime"
                  required
                  placeholder="Pet departure time"
                  className="min-w-0 flex-1"
                  minTime={endTimeMin}
                  stepMinutes={30}
                  disabled={!isDateSelected}
                />
              </div>

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
