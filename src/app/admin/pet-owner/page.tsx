"use client";

import { useOwnerList } from "@/hooks/admin/useOwnerList";
import OwnerListTile from "@/components/admin/pet-owner/OwnerListTile";
import { Input } from "@/components/ui/input/Input";
import { Pagination } from "@/components/ui/Pagination";
import cn from "@/utils/cn";
import { Filter, Search } from "lucide-react";
import { userStatusVariant } from "@/constants/status";
import { useRouter } from "next/navigation";
import { Suspense } from "react";

function PetOwnerPageContent() {
  const {
    owners,
    totalOwners,
    totalPages,
    currentPage,
    isLoading,
    error,
    searchKeyword,
    statusFilter,
    handleKeywordChange,
    handleStatusChange,
    setPage,
  } = useOwnerList();
  const router = useRouter();

  return (
    <section className="flex flex-col gap-6 min-h-[calc(100vh-40px)] px-4 pt-10 pb-20 md:px-10 lg:p-0">
      <header className="flex flex-col items-start justify-between w-full gap-4 sm:flex-row sm:items-center">
        <p className="style-headline-3 text-gray-600">Pet Owner</p>
        <div className="flex gap-4">
          <button
            className="btn p-0 size-12 bg-white rounded-lg"
            popoverTarget="popover-1"
            style={{ anchorName: "--anchor-1" }}
          >
            <Filter className="text-gray-400" />
          </button>
          <ul
            className="dropdown menu w-30 rounded-box bg-base-100 shadow-sm mt-2"
            popover="auto"
            id="popover-1"
            style={
              { positionAnchor: "--anchor-1" } /* as React.CSSProperties */
            }
          >
            <li>
              <button
                type="button"
                className={cn(
                  "style-body-2 text-black",
                  statusFilter === null && "bg-gray-200",
                )}
                onClick={() => handleStatusChange(null)}
              >
                All
              </button>
            </li>
            <li>
              <button
                type="button"
                className={cn(
                  "style-body-2",
                  userStatusVariant["Normal"],
                  statusFilter === "Normal" && "bg-gray-200",
                )}
                onClick={() => handleStatusChange("Normal")}
              >
                Normal
              </button>
            </li>
            <li>
              <button
                type="button"
                className={cn(
                  "style-body-2",
                  userStatusVariant["Banned"],
                  statusFilter === "Banned" && "bg-gray-200",
                )}
                onClick={() => handleStatusChange("Banned")}
              >
                Banned
              </button>
            </li>
          </ul>
          <Input
            value={searchKeyword}
            onChange={(event) => handleKeywordChange(event.target.value)}
            rightAction={<Search className="text-gray-300" />}
            placeholder="Search..."
            className="w-60"
          />
        </div>
      </header>
      <article className="min-w-full">
        <header className="flex py-3 bg-black rounded-t-2xl">
          <p className="flex-1 px-4 style-body-3 text-white">Full Name</p>
          <p className="flex-1 px-4 style-body-3 text-white md:w-[calc(207/1120*100%)]">
            Phone
          </p>
          <p className="hidden w-[calc(324/1120*100%)] min-w-80 px-4 style-body-3 text-white md:block">
            Email
          </p>
          <p className="hidden w-[calc(224/1120*100%)] px-4 style-body-3 text-white xl:block">
            Pet(s)
          </p>
          <p className="w-[calc(120/1120*100%)] min-w-25 px-4 style-body-3 text-white">
            Status
          </p>
        </header>
        <ul>
          {owners.map((owner, index, array) => (
            <OwnerListTile
              key={owner.id}
              owner={owner}
              isLast={index + 1 === array.length}
              onClick={() => router.push(`/admin/pet-owner/${owner.id}`)}
            />
          ))}
        </ul>

        {!isLoading && owners.length === 0 && (
          <p className="py-8 text-center style-body-2 text-gray-400">
            No pet owners found.
          </p>
        )}
      </article>
      <footer className="flex flex-col gap-2">
        {error && (
          <p className="style-body-2 text-red text-center">
            Failed to load owner list: {error}
          </p>
        )}
        {isLoading && (
          <p className="style-body-2 text-gray-400 text-center">Loading...</p>
        )}
        {!isLoading && totalOwners > 0 && (
          <p className="style-body-2 text-gray-400 text-center">
            Total owners: {totalOwners}
          </p>
        )}
        <Pagination
          className="pt-0 pb-16"
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setPage}
        />
      </footer>
    </section>
  );
}

export default function PetOwnerPage() {
  return (
    <Suspense
      fallback={
        <section className="flex min-h-[calc(100vh-40px)] items-center justify-center px-4 pt-10 pb-20 md:px-10 lg:p-0">
          <p className="style-body-2 text-gray-400">Loading...</p>
        </section>
      }
    >
      <PetOwnerPageContent />
    </Suspense>
  );
}
