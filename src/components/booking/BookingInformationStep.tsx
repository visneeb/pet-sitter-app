"use client";

import React from "react";

import { ActionButton } from "@/components/ui/Button";
import { Input } from "@/components/ui/input/Input";
import { BookingStepFooterMobile } from "./BookingStepFooterMobile";

type Props = {
  name: string;
  email: string;
  phone: string;
  message: string;
  canNext: boolean;
  onChangeName: (value: string) => void;
  onChangeEmail: (value: string) => void;
  onChangePhone: (value: string) => void;
  onChangeMessage: (value: string) => void;
  onBack: () => void;
  onNext: () => void;
};

export function BookingInformationStep({
  name,
  email,
  phone,
  message,
  canNext,
  onChangeName,
  onChangeEmail,
  onChangePhone,
  onChangeMessage,
  onBack,
  onNext,
}: Props) {
    const [showFooter, setShowFooter] = React.useState(false);

    React.useEffect(() => {
      const handleScroll = () => {
        const scrollTop = window.scrollY;
        const windowHeight = window.innerHeight;
        const fullHeight = document.body.scrollHeight;

        const isBottom = scrollTop + windowHeight >= fullHeight - 10;

        setShowFooter(isBottom);
      };

      window.addEventListener("scroll", handleScroll);
      handleScroll();
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);
  return (
    <>
      <h1 className="text-lg font-semibold text-gray-900">Your Information</h1>

      <div className="mt-6 flex-1 overflow-y-auto h-auto md:h-[536px]">
        <div className= "space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-800">
              Your Name<span className="text-orange-500">*</span>
            </label>
            <Input
              value={name}
              onChange={(e) => onChangeName(e.target.value)}
              placeholder="Full name"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-800">
                Email<span className="text-orange-500">*</span>
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => onChangeEmail(e.target.value)}
                placeholder="youremail@company.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-800">
                Phone<span className="text-orange-500">*</span>
              </label>
              <Input
                type="tel"
                value={phone}
                onChange={(e) => onChangePhone(e.target.value)}
                placeholder="xxx-xxx-xxxx"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-800">
              Additional Message (To pet sitter)
            </label>
            <textarea
              value={message}
              onChange={(e) => onChangeMessage(e.target.value)}
              rows={7}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-200"
            />
          </div>
        </div>
      </div>

      <div className="md:flex items-center justify-between gap-4 hidden">
        <div className="w-[120px]">
          <ActionButton variant="secondary" onClick={onBack}>
            Back
          </ActionButton>
        </div>

        <div className="flex-1" />

        <div className="w-[120px] flex justify-end">
          <ActionButton variant="primary" disabled={!canNext} onClick={onNext}>
            Next
          </ActionButton>
        </div>
      </div>
      <div className="show">
      {showFooter&&(
        <BookingStepFooterMobile
          canNext={canNext}
          onBack={onBack}
          onNext={onNext}
        />

      )}

      </div>
      
    </>
  );
}