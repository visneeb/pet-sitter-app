import ReviewCard from "./ReviewCard";
import { Pagination } from "@/components/ui/Pagination";

export interface Review {
  reviewerName: string;
  date: string;
  comment: string;
  avatarUrl?: string;
}

interface ReviewsSectionProps {
  rating: number;
  reviewCount: number;
  reviews: Review[];
  totalPages?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

export default function ReviewsSection({
  rating,
  reviewCount,
  reviews,
  totalPages = 1,
  currentPage = 1,
  onPageChange,
}: ReviewsSectionProps) {
  return (
    <section className="flex flex-col gap-4 bg-gray-100 w-full px-6 py-6 rounded-tl-[120px] rounded-2xl">
      <div className="px-6 py-6 bg-white rounded-l-full flex w-full gap-10">
        <div className="flex flex-col bg-black rounded-t-full rounded-l-full w-[146px] h-[146px] items-center justify-center shrink-0">
          <h2 className="style-headline-2 text-white text-center">{rating}</h2>
          <p className="style-body-3 text-white">{reviewCount} Reviews</p>
        </div>
        <div className="style-headline-3">Rating & Reviews</div>
      </div>

      {reviews.map((review, index) => (
        <ReviewCard
          key={`${review.reviewerName}-${index}`}
          reviewerName={review.reviewerName}
          date={review.date}
          comment={review.comment}
          avatarUrl={review.avatarUrl}
          isLast={index === reviews.length - 1}
        />
      ))}

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={onPageChange ?? (() => {})}
      />
    </section>
  );
}
