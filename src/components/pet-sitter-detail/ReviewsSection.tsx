"use client";

import { useState } from "react";
import ReviewCard from "./ReviewCard";
import ReviewCardSkeleton from "./ReviewCardSkeleton";
import { Pagination } from "@/components/ui/Pagination";
import { formatReviewDate } from "@/utils/dateFormat";
import FilterRatingList from "@/components/search/FilterSideBar/FilterRatingList";
import { ReviewApi } from "@/services/api/sitterApi"; 


interface ReviewsSectionProps {
  rating: number;
  reviewCount: number;
  reviews: ReviewApi[];
  totalPages?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  ratingFilter?: number[];
  onRatingFilterChange?: (rating: number[]) => void;
  isLoading?: boolean;
}

export default function ReviewsSection({
  rating,
  reviewCount,
  reviews,
  totalPages = 1,
  currentPage = 1,
  onPageChange,
  ratingFilter: ratingFilterProp,
  onRatingFilterChange,
  isLoading = false,
}: ReviewsSectionProps) {
  const [internalRatingFilter, setInternalRatingFilter] = useState<number[]>([]);

  const isControlled = onRatingFilterChange != null;
  const ratingFilter = isControlled ? ratingFilterProp ?? [] : internalRatingFilter;
  const handleRatingChange = isControlled
    ? onRatingFilterChange!
    : setInternalRatingFilter;

  const displayReviews =
    !isControlled && ratingFilter.length > 0
      ? reviews.filter((review) => review.rating === ratingFilter[0])
      : reviews;

  return (
    <section className="flex flex-col gap-4 bg-gray-100 w-full px-6 py-6 rounded-tl-[120px] rounded-2xl">
      <div className="px-6 py-6 bg-white rounded-xl rounded-tl-[99px] md:rounded-l-full flex flex-col md:flex-row w-full max-w-[800px] gap-10 md:items-center ">
        <div className="flex flex-col bg-black rounded-t-full rounded-l-full w-[146px] h-[146px] items-center justify-center shrink-0">
          <h2 className="style-headline-2 text-white text-center">
            {reviewCount === 0 ? "N/A" : rating}
          </h2>
          <p className="style-body-3 text-white">{reviewCount} Reviews</p>
        </div>
        <div className="flex flex-col gap-2">
          <div className="style-headline-3">Rating & Reviews</div>
          <FilterRatingList
            rating={ratingFilter}
            onRatingChange={handleRatingChange}
            allOptionLabel="All Reviews"
            label=""
            contentStyle="flex-row flex-wrap items-center gap-2"
            listStyle="gap-x-2 gap-y-2"
          />
        </div>
      </div>

      {isLoading ? (
        <>
          <ReviewCardSkeleton />
          <ReviewCardSkeleton />
          <ReviewCardSkeleton isLast />
        </>
      ) : displayReviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-6 bg-gray-100 rounded-xl">
          <p className="style-body-2 text-gray-500 text-center">
            No Reviews for this pet sitter
          </p>
        </div>
      ) : (
        displayReviews.map((review: ReviewApi, index: number) => (
          <ReviewCard
            key={`${review.reviewer.name}-${index}`}
            reviewerName={review.reviewer.name}
            date={formatReviewDate(review.createdAt)}
            comment={review.comment}
            avatarUrl={review.reviewer.profileImgUrl}
            rating={review.rating}
            isLast={index === displayReviews.length - 1}
          />
        ))
      )}

      {displayReviews.length > 0 && totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={onPageChange ?? (() => {})}
        />
      )}
    </section>
  );
}
