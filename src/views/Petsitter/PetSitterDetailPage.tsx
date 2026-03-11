"use client";

import { useState } from "react";
import {
  ImageCarousel,
  ContentSection,
  ReviewsSection,
  PetSitterBookingCard,
  type CarouselImage,
} from "@/components/pet-sitter-detail";
import Loading from "@/components/common/loading/loading";
import { useParams, useSearchParams } from "next/navigation";
import { usePetSitterDetail } from "@/hooks/pet-sitter-detail/usePetSitterDetail";
import { useReviews } from "@/hooks/pet-sitter-detail/useReviews";
import type { Sitter } from "@/types/sitter";
import { ExclamationCircleIcon } from "@/assets/icons/components";
import dynamic from "next/dynamic";

const LeafletMap = dynamic(() => import("@/components/Map/LeafletMap"), { ssr: false });
const SitterMarker = dynamic(() => import("@/components/Map/ui/Marker/SitterMarker"), { ssr: false });

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23e5e7eb' width='400' height='300'/%3E%3C/svg%3E";

function getCarouselImages(sitter: Sitter): CarouselImage[] {
  const urls = sitter.imgUrls?.length
    ? sitter.imgUrls
    : sitter.imgUrl
      ? [sitter.imgUrl]
      : [];
  if (urls.length === 0) {
    return [{ src: PLACEHOLDER_IMAGE, alt: "No image available" }];
  }
  return urls.map((src, i) => ({ src, alt: `Pet sitter image ${i + 1}` }));
}

export default function PetSitterDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const sitterid = params.sitterid;
  const sitterId = Array.isArray(sitterid) ? sitterid[0] : sitterid;
  const { sitter, isLoading, error } = usePetSitterDetail(sitterId);
  const initialOpenBooking = searchParams.get("openBooking") === "1";

  const [currentPage, setCurrentPage] = useState(1);
  const [ratingFilter, setRatingFilter] = useState<number[]>([]);

  const {
    reviews,
    totalPages,
    totalReviews,
    isLoading: isReviewsLoading,
  } = useReviews(sitterId ?? null, {
    page: currentPage,
    limit: 5,
    rating: ratingFilter[0],
  });

  const handleRatingFilterChange = (newRating: number[]) => {
    setRatingFilter(newRating);
    setCurrentPage(1);
  };

  if (isLoading) return <Loading />;
  if (error || !sitter) {
    return (
      <div className="min-h-[550px] flex flex-col justify-center items-center style-headline-1 gap-4">
        <ExclamationCircleIcon className="text-black" size={150} />
        <p className="style-headline-1">No Pet Sitter found</p>
      </div>
    );
  }

  const carouselImages = getCarouselImages(sitter);

  return (
    <>
      <div className="bg-gray-50">
        <section className="w-full md:py-10">
          <div className="relative">
            <ImageCarousel images={carouselImages} />
          </div>
        </section>

        <div className="w-full md:px-20 pt-10 md:pt-0 flex flex-col md:flex-row md:flex-nowrap md:justify-center md:items-start gap-8">
          <section className="flex flex-col gap-10">
            <div className="flex flex-col gap-6 md:gap-12 px-4 md:px-20 md:py-6 w-full md:max-w-[848px] md:shrink-0">
              <h1 className="style-headline-2 md:style-headline-1">
                {sitter.tradeName}
              </h1>

              <ContentSection title="Introduction">
                <p>{sitter.introduction}</p>
              </ContentSection>

              <ContentSection title="Services">
                <p>{sitter.services}</p>
              </ContentSection>

              <ContentSection title="My places">
                <p>{sitter.description}</p>

                <LeafletMap
                  center={[
                    sitter.latitude ?? 13.7563,
                    sitter.longitude ?? 100.5018,
                  ]}
                  zoom={20}
                  className="w-full max-h-[219px] rounded-2xl"
                >
                  <SitterMarker
                    position={[
                      sitter.latitude ?? 13.7563,
                      sitter.longitude ?? 100.5018,
                    ]}
                  />
                </LeafletMap>
              </ContentSection>
            </div>
            <div className=" md:hidden md:shrink-0 md:self-stretch w-full md:w-auto">
              <PetSitterBookingCard
                sitter={sitter}
                sitterId={sitterId ?? ""}
                initialOpenBooking={initialOpenBooking}
              />
            </div>
            <ReviewsSection
              rating={sitter.rating ?? 4.5}
              reviewCount={totalReviews || 0}
              reviews={reviews}
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              ratingFilter={ratingFilter}
              onRatingFilterChange={handleRatingFilterChange}
              isLoading={isReviewsLoading}
            />
          </section>

          <aside className="hidden md:block md:shrink-0 md:self-stretch w-full md:w-auto">
            <PetSitterBookingCard
              sitter={sitter}
              sitterId={sitterId ?? ""}
              initialOpenBooking={initialOpenBooking}
            />
          </aside>
        </div>
      </div>
    </>
  );
}
