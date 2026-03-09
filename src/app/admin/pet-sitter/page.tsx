"use client";

import SitterListTile from "@/components/admin/pet-sitter/SitterListTile";
import { Input } from "@/components/ui/input/Input";
import { Pagination } from "@/components/ui/Pagination";
import { sitterStatusVariant, userStatusVariant } from "@/constants/status";
import { useSitterList } from "@/hooks/admin/useSitterList";
import cn from "@/utils/cn";
import { Filter, Search } from "lucide-react";

export default function PetOwnerPage() {
  const {
    sitters,
    totalSitters,
    totalPages,
    currentPage,
    isLoading,
    error,
    searchKeyword,
    statusFilter,
    handleKeywordChange,
    handleStatusChange,
    setPage,
  } = useSitterList();

  return (
    <section className="flex flex-col gap-6 min-h-[calc(100vh-40px)] px-4 pt-10 pb-20 md:px-10 lg:p-0">
      <header className="flex flex-col items-start justify-between w-full gap-4 sm:flex-row sm:items-center">
        <p className="style-headline-3 text-gray-600">Pet Sitter</p>
        <div className="flex gap-4">
          <button
            className="btn p-0 size-12 bg-white rounded-lg"
            popoverTarget="popover-1"
            style={{ anchorName: "--anchor-1" }}
          >
            <Filter className="text-gray-400" />
          </button>
          <ul
            className="dropdown menu w-47 rounded-box bg-base-100 shadow-sm mt-2"
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
                  sitterStatusVariant["Waiting for approval"],
                  statusFilter === "Waiting for approval" && "bg-gray-200",
                )}
                onClick={() => handleStatusChange("Waiting for approval")}
              >
                Waiting for approval
              </button>
            </li>
            <li>
              <button
                type="button"
                className={cn(
                  "style-body-2",
                  sitterStatusVariant["Approved"],
                  statusFilter === "Approved" && "bg-gray-200",
                )}
                onClick={() => handleStatusChange("Approved")}
              >
                Approved
              </button>
            </li>
            <li>
              <button
                type="button"
                className={cn(
                  "style-body-2",
                  sitterStatusVariant["Rejected"],
                  statusFilter === "Rejected" && "bg-gray-200",
                )}
                onClick={() => handleStatusChange("Rejected")}
              >
                Rejected
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
            className="w-60 "
          />
        </div>
      </header>
      <article className="min-w-full">
        <header className="flex py-3 bg-black rounded-t-2xl">
          <p className="flex-1 px-4 style-body-3 text-white">Full Name</p>
          <p className="hidden flex-1 px-4 style-body-3 text-white xl:block">
            Trade Name
          </p>
          <p className="hidden w-[calc(324/1120*100%)] min-w-80 px-4 style-body-3 text-white md:block">
            Email
          </p>
          <p className="w-[calc(216/1120*100%)] min-w-50 px-4 style-body-3 text-white">
            Status
          </p>
        </header>
        <ul>
          {sitters.map((sitter, index, array) => (
            <SitterListTile
              key={sitter.id}
              sitter={sitter}
              isLast={index + 1 === array.length}
            />
          ))}
        </ul>

        {!isLoading && sitters.length === 0 && (
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
        {!isLoading && totalSitters > 0 && (
          <p className="style-body-2 text-gray-400 text-center">
            Total owners: {totalSitters}
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
