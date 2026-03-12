"use client";

import Profile from "@/components/admin/pet-sitter/Profile";
import Loading from "@/components/common/loading/loading";
import { ActionButton } from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { sitterStatusVariant, userStatusVariant } from "@/constants/status";
import { useSitterProfile } from "@/hooks/admin/useSitterProfile";
import cn from "@/utils/cn";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

const showApproveModal = () => {
  const dialog = document.getElementById(
    "approve-sitter",
  ) as HTMLDialogElement | null;

  if (!dialog) return;

  dialog.showModal();
};

const showRejectModal = () => {
  const dialog = document.getElementById(
    "reject-sitter",
  ) as HTMLDialogElement | null;

  if (!dialog) return;

  dialog.showModal();
};

export default function PetSitterLayout() {
  const params = useParams<{ sitterId: string }>();
  const sitterId = params.sitterId;
  const {
    sitterProfile,
    sitterPendingProfile,
    isLoading,
    isModalLoading,
    error,
    handleApprove,
    handleReject,
    handleBan,
    handleUnban,
  } = useSitterProfile(sitterId);

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
    <>
      <section className="flex flex-col gap-6 px-4 pt-10 pb-20 md:px-10 lg:px-0 lg:pt-0">
        <header className="flex flex-col gap-4 md:flex-row md:justify-between">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
            <div className="flex items-center gap-2.5">
              <Link
                href="/admin/pet-sitter"
                aria-label="Back to pet owner list"
              >
                <ChevronLeft className="text-gray-400" />
              </Link>
              <p className="style-headline-3 text-black line-clamp-1">
                {sitterProfile.sitter.name}
              </p>
            </div>
            <div
              className={cn(
                "flex gap-2 style-label",
                sitterProfile.sitter.status === "Banned"
                  ? userStatusVariant["Banned"]
                  : sitterStatusVariant[sitterProfile.status],
              )}
            >
              <span>•</span>
              {sitterProfile.sitter.status === "Banned"
                ? "Banned"
                : sitterProfile.status}
            </div>
          </div>
          {sitterProfile.hasPendingUpdate && (
            <div className="flex gap-2">
              <ActionButton variant="secondary" onClick={showRejectModal}>
                Reject
              </ActionButton>
              <ActionButton
                variant="primary"
                onClick={showApproveModal}
                disabled={sitterProfile.sitter.status === "Banned"}
              >
                Approve
              </ActionButton>
            </div>
          )}
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
              <Profile
                sitter={sitterProfile}
                sitterPending={sitterPendingProfile}
              />
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
      {sitterProfile.sitter.status === "Normal" ? (
        <Modal
          id="ban-user"
          title="Ban Confirmation"
          massage="Are you sure to ban this sitter?"
          cancelText="Cancel"
          confirmText="Ban"
          onConfirm={handleBan}
          disabled={isModalLoading}
        />
      ) : (
        <Modal
          id="unban-user"
          title="Unban Confirmation"
          massage="Are you sure to unban this sitter?"
          cancelText="Cancel"
          confirmText="Unban"
          onConfirm={handleUnban}
          disabled={isModalLoading}
        />
      )}
      {sitterProfile.hasPendingUpdate && (
        <>
          <Modal
            id="approve-sitter"
            title="Approve Confirmation"
            massage="Are you sure to approve this sitter?"
            cancelText="Cancel"
            confirmText="Approve"
            onConfirm={handleApprove}
            disabled={isModalLoading}
          />
          <Modal
            id="reject-sitter"
            title="Reject Confirmation"
            massage="Are you sure to reject this sitter?"
            cancelText="Cancel"
            confirmText="Reject"
            onConfirm={handleReject}
            disabled={isModalLoading}
          />
        </>
      )}
    </>
  );
}
