"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { getNextTimeSlot } from "@/utils/timeFormat";
import { ActionButton } from "@/components/ui/Button";
import {
  FormProvider,
  DatePicker,
  TimePicker,
} from "@/components/form";
import type { Sitter } from "@/types/sitter";
import { CloseIcon, ClockIcon, CalendarIcon } from "@/assets/icons/components";
export interface BookingFormValues {
  startDate: Date | null;
  endDate: Date | null;
  startTime: string;
  endTime: string;
  note: string;
}

interface Props {
  sitter: Pick<Sitter, "tradeName">;
  onClose: () => void;
  onConfirm?: (data: BookingFormValues) => void | Promise<void>;
}

export function BookingModal({ sitter, onClose, onConfirm }: Props) {
  const methods = useForm<BookingFormValues>({
    defaultValues: {
      startDate: null,
      endDate: null,
      startTime: "",
      endTime: "",
      note: "",
    },
  });

  const handleSubmit = async (data: BookingFormValues) => {
    await onConfirm?.(data);
    onClose();
  };

  const startTime = useWatch({ control: methods.control, name: "startTime" });
  const endTimeMin = startTime ? getNextTimeSlot(startTime, 30) : undefined;

  useEffect(() => {
    if (!startTime || !endTimeMin) return;
    const currentEnd = methods.getValues("endTime");
    if (currentEnd && currentEnd < endTimeMin) {
      methods.setValue("endTime", "");
    }
  }, [startTime, endTimeMin, methods]);

  const oneYearFromNow = new Date(new Date().getFullYear() + 1, new Date().getMonth(), 1);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-[560px] mx-4  flex flex-col gap-5 max-h-[90vh] "
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-modal-title"
      >
        <div className="flex items-start justify-between px-10 py-6 border-b border-gray-200 ">
          <h3
            id="booking-modal-title"
            className="style-headline-3 text-gray-600"
          >
            Booking
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 hover:cursor-pointer text-xl leading-none p-1"
            aria-label="ปิด"
          >
            <CloseIcon />
          </button>
        </div>

        <FormProvider methods={methods} onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 px-10 py-6">
            <p className="style-body-1 text-gray-600">Select date and time you want to schedule the service.</p>
            <div className="flex items-center gap-2">
              <CalendarIcon size={20} className="shrink-0 text-gray-500" />

            <DatePicker
              name="startDate"
              placeholder="Pet arrival date"
              disabled={{ before: new Date()}}
              startMonth={new Date()}
              endMonth={oneYearFromNow}
              />
              </div>
            <div className="flex items-center gap-2">
              <ClockIcon size={20} className="shrink-0 text-gray-500" />
              <TimePicker
                name="startTime"
                placeholder="Pet arrival time"
                className="flex-1 min-w-0"
              />
              <span className="text-gray-500 shrink-0">-</span>
              <TimePicker
                name="endTime"
                placeholder="Pet departure time"
                className="flex-1 min-w-0"
                minTime={endTimeMin}
                stepMinutes={30}
              />
            </div>

            <div className="flex justify-around gap-4 pt-2">
             
              <ActionButton
                type="submit"
                variant="primary"
                className="flex-1"
              >
                Continue
              </ActionButton>
            </div>
          </div>
        </FormProvider>
      </div>
    </div>
  );
}
