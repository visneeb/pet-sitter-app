"use client";

import Pets from "@/components/admin/pet-owner/Pets";
import Profile from "@/components/admin/pet-owner/Profile";
import Loading from "@/components/common/loading/loading";
import Modal from "@/components/ui/Modal";
import { userStatusVariant } from "@/constants/status";
import { useOwnerProfile } from "@/hooks/admin/useOwnerProfile";
import cn from "@/utils/cn";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useCallback } from "react";

export default function PetOwnerLayout() {
  const params = useParams<{ userId: string }>();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") === "pets" ? "pets" : "profile";
  const userId = params?.userId;

  const setTab = useCallback(
    (next: "profile" | "pets") => {
      const qs = new URLSearchParams(searchParams.toString());
      if (next === "pets") {
        qs.set("tab", "pets");
      } else {
        qs.delete("tab");
      }
      const url = qs.toString() ? `${pathname}?${qs.toString()}` : pathname;
      router.replace(url, { scroll: false });
    },
    [pathname, router, searchParams],
  );
  const {
    ownerProfile,
    isLoading,
    isModalLoading,
    error,
    handleBan,
    handleUnban,
  } = useOwnerProfile(userId);

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
    <>
      <section className="flex flex-col gap-6 px-4 pt-10 pb-20 md:px-10 lg:px-0 lg:pt-0">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
          <div className="flex items-center gap-2.5">
            <Link href="/admin/pet-owner" aria-label="Back to pet owner list">
              <ChevronLeft className="text-gray-400" />
            </Link>
            <p className="style-headline-3 text-black">{ownerProfile.name}</p>
          </div>
          <div
            className={cn(
              "flex gap-2 style-label",
              userStatusVariant[ownerProfile.status],
            )}
          >
            <span>•</span>
            {ownerProfile.status}
          </div>
        </header>
        <section className="tabs tabs-lift tabs-xl w-full min-w-0 gap-x-2 md:gap-x-4">
          <input
            type="radio"
            name="owner"
            className="tab px-4 md:px-8 style-headline-4 bg-gray-200 text-gray-400 rounded-t-xl checked:bg-white checked:text-orange-500"
            aria-label="Profile"
            checked={activeTab === "profile"}
            onChange={() => setTab("profile")}
          />
          <article className="tab-content bg-white border-base-300 p-6 lg:p-10">
            <Profile owner={ownerProfile} />
          </article>
          <input
            type="radio"
            name="owner"
            className="tab px-4 md:px-8 style-headline-4 bg-gray-200 text-gray-400 rounded-t-xl checked:bg-white checked:text-orange-500"
            aria-label="Pets"
            checked={activeTab === "pets"}
            onChange={() => setTab("pets")}
          />
          <article className="tab-content bg-white border-base-300 p-6">
            <Pets owner={ownerProfile} />
          </article>
        </section>
      </section>
      {ownerProfile.status === "Normal" ? (
        <Modal
          id="ban-user"
          title="Ban Confirmation"
          massage="Are you sure to ban this owner?"
          cancelText="Cancel"
          confirmText="Ban"
          onConfirm={handleBan}
          disabled={isModalLoading}
        />
      ) : (
        <Modal
          id="unban-user"
          title="Unban Confirmation"
          massage="Are you sure to unban this owner?"
          cancelText="Cancel"
          confirmText="Unban"
          onConfirm={handleUnban}
          disabled={isModalLoading}
        />
      )}
    </>
  );
}
