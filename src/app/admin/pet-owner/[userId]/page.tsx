"use client";

import Pets from "@/components/admin/pet-owner/Pets";
import Profile from "@/components/admin/pet-owner/Profile";
import Loading from "@/components/common/loading/loading";
import { useOwnerProfile } from "@/hooks/admin/useOwnerProfile";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function PetOwnerLayout() {
  const params = useParams<{ userId: string }>();
  const userId = params?.userId;
  const { ownerProfile, isLoading, error } = useOwnerProfile(userId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-200">
        <Loading />
      </div>
    );
  }

  if (error || !ownerProfile) {
    return (
      <section className="flex flex-col gap-6 px-4 pt-10 pb-20 md:px-10 lg:p-0">
        <header className="flex items-center gap-2.5">
          <Link href="/admin/pet-owner" aria-label="Back to pet owner list">
            <ChevronLeft className="text-gray-400" />
          </Link>
          <p className="style-headline-3 text-black">Pet Owner</p>
        </header>
        <article className="rounded-xl bg-white p-6">
          <p className="style-body-2 text-red">
            Failed to load owner profile: {error ?? "Not found"}
          </p>
        </article>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-6 px-4 pt-10 pb-20 md:px-10 lg:p-0">
      <header className="flex items-center gap-2.5">
        <Link href="/admin/pet-owner" aria-label="Back to pet owner list">
          <ChevronLeft className="text-gray-400" />
        </Link>
        <p className="style-headline-3 text-black">{ownerProfile.name}</p>
      </header>
      <section className="tabs tabs-lift tabs-xl w-full min-w-0 gap-x-2 md:gap-x-4">
        <input
          type="radio"
          name="owner"
          className="tab px-4 md:px-8 style-headline-4 bg-gray-200 text-gray-400 rounded-t-xl checked:bg-white checked:text-orange-500"
          aria-label="Profile"
          defaultChecked
        />
        <article className="tab-content bg-white border-base-300 p-6 lg:p-10">
          <Profile owner={ownerProfile} />
        </article>
        <input
          type="radio"
          name="owner"
          className="tab px-4 md:px-8 style-headline-4 bg-gray-200 text-gray-400 rounded-t-xl checked:bg-white checked:text-orange-500"
          aria-label="Pets"
        />
        <article className="tab-content bg-white border-base-300 p-6">
          <Pets />
        </article>
      </section>
    </section>
  );
}
