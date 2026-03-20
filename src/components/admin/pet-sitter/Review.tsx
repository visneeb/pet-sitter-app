"use client";

import { ReviewCard } from "@/components/pet-sitter-detail";
import ReviewCardSkeleton from "@/components/pet-sitter-detail/ReviewCardSkeleton";
import { Pagination } from "@/components/ui/Pagination";
import { Paw } from "@/decorations/Paw";
import { useReviewList } from "@/hooks/admin/useReviewList";
import { formatReviewDate } from "@/utils/dateFormat";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

function Review() {
  const params = useParams<{ sitterId: string }>();
  const sitterId = params.sitterId;

  const { reviews, totalPages, currentPage, isLoading, error, setPage } =
    useReviewList(sitterId);

  return (
    <section>
      {error ? (
        <article className="rounded-xl bg-white p-6">
          <p className="style-body-2 text-red-600">
            Failed to load reviews: {error}
          </p>
        </article>
      ) : isLoading ? (
        <article className="flex flex-col gap-2">
          <ReviewCardSkeleton />
          <ReviewCardSkeleton />
          <ReviewCardSkeleton isLast />
        </article>
      ) : reviews.length === 0 ? (
        <article className="flex flex-col gap-4 items-center justify-center py-12 px-6 rounded-xl">
          <Paw className="size-16 text-pink-500" />
          <h4 className="style-headline-4 text-gray-500">
            No Reviews for this pet sitter
          </h4>
        </article>
      ) : (
        <article>
          {reviews.map((review, index) => (
            <ReviewCard
              key={`${review.reviewer.name}-${review.createdAt}-${index}`}
              reviewerName={review.reviewer.name}
              date={formatReviewDate(review.createdAt)}
              comment={review.comment}
              avatarUrl={review.reviewer.profileImgUrl}
              rating={review.rating}
              isLast={index === reviews.length - 1}
            />
          ))}

          {totalPages > 1 && (
            <div className="pt-10 pb-16 flex justify-center">
              <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={setPage}
              />
            </div>
          )}
        </article>
      )}
    </section>
  );
}

export default Review;
