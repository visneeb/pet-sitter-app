"use client";

import Profile from "@/components/admin/pet-sitter/Profile";
import Loading from "@/components/common/loading/loading";
import { useSitterProfile } from "@/hooks/admin/useSitterProfile";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function PetSitterLayout() {
  const params = useParams<{ sitterId: string }>();
  const sitterId = params.sitterId;
  const { sitterProfile, isLoading, error } = useSitterProfile(sitterId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-200">
        <Loading />
      </div>
    );
  }

  if (error || !sitterProfile) {
    return (
      <section className="flex flex-col gap-6 px-4 pt-10 pb-20 md:px-10 lg:p-0">
        <header className="flex items-center gap-2.5">
          <Link href="/admin/pet-owner" aria-label="Back to pet owner list">
            <ChevronLeft className="text-gray-400" />
          </Link>
          <p className="style-headline-3 text-black">Pet Sitter</p>
        </header>
        <article className="rounded-xl bg-white p-6">
          <p className="style-body-2 text-red">
            Failed to load sitter profile: {error ?? "Not found"}
          </p>
        </article>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-6 px-4 pt-10 pb-20 md:px-10 lg:p-0">
      <header className="flex items-center gap-2.5">
        <Link href="/admin/pet-sitter" aria-label="Back to pet owner list">
          <ChevronLeft className="text-gray-400" />
        </Link>
        <p className="style-headline-3 text-black">
          {sitterProfile.sitter.name}
        </p>
      </header>
      <div className="w-full min-w-0">
        <section className="tabs tabs-lift tabs-xl w-full min-w-0 gap-x-2 md:gap-x-4">
          <input
            type="radio"
            name="sitter"
            className="tab px-4 md:px-8 style-headline-4 bg-gray-200 text-gray-400 rounded-t-xl whitespace-nowrap checked:bg-white checked:text-orange-500"
            aria-label="Profile"
            defaultChecked
          />
          <article className="tab-content w-full min-w-0 rounded-b-xl bg-white p-4 md:p-6 lg:p-10">
            <Profile sitter={sitterProfile} />
          </article>
          <input
            type="radio"
            name="sitter"
            className="tab px-4 md:px-8 style-headline-4 bg-gray-200 text-gray-400 rounded-t-xl border-t-0 whitespace-nowrap checked:bg-white checked:text-orange-500"
            aria-label="Booking"
          />
          <article className="tab-content w-full min-w-0 rounded-b-xl bg-white p-4 md:p-6 lg:p-10">
            Booking
          </article>
          <input
            type="radio"
            name="sitter"
            className="tab px-4 md:px-8 style-headline-4 bg-gray-200 text-gray-400 rounded-t-xl whitespace-nowrap checked:bg-white checked:text-orange-500"
            aria-label="Reviews"
          />
          <article className="tab-content w-full min-w-0 rounded-b-xl bg-white p-4 md:p-6 lg:p-10">
            Reviews
          </article>
        </section>
      </div>
    </section>
  );
}
