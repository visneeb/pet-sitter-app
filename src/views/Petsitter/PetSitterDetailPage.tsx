"use client";

import { useState, useEffect } from "react";
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

const LeafletMap = dynamic(() => import("@/components/Map/LeafletMap"), {
  ssr: false,
});
const SitterMarker = dynamic(
  () => import("@/components/Map/ui/Marker/SitterMarker"),
  { ssr: false },
);

function getCarouselImages(sitter: Sitter): CarouselImage[] {
  const urls = sitter.imgUrls?.length
    ? sitter.imgUrls
    : sitter.imgUrl
    ? [sitter.imgUrl]
    : [];
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
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    setIsMapReady(true);
  }, []);

  const {
    reviews,
    totalPages,
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
        <p className="style-headline-1 text-center">No Pet Sitter found</p>
      </div>
    );
  }

  const carouselImages = getCarouselImages(sitter);

  return (
    <>
      <div className="bg-gray-50">
        <section className="w-full lg:py-10">
          <div className="relative">
            <ImageCarousel images={carouselImages} />
          </div>
        </section>

        <div className="w-full lg:px-20 pt-10 lg:pt-0 flex flex-col lg:flex-row lg:flex-nowrap lg:justify-center lg:items-start gap-8">
          <section className="flex flex-col gap-10">
            <div className="flex flex-col gap-6 lg:gap-12 px-4 lg:px-20 lg:py-6 w-full lg:max-w-[848px] lg:shrink-0">
              <h1 className="style-headline-2 lg:style-headline-1">
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

                <div className="relative h-[219px] w-full overflow-hidden rounded-2xl">
                  {isMapReady && (
                    <LeafletMap
                      key="sitter-detail-map"
                      center={[
                        sitter.latitude ?? 13.7563,
                        sitter.longitude ?? 100.5018,
                      ]}
                      zoom={20}
                      className="h-full w-full"
                    >
                      <SitterMarker
                        position={[
                          sitter.latitude ?? 13.7563,
                          sitter.longitude ?? 100.5018,
                        ]}
                      />
                    </LeafletMap>
                  )}
                </div>
              </ContentSection>
            </div>
            <div className="lg:hidden lg:shrink-0 lg:self-stretch w-full lg:w-auto">
              <PetSitterBookingCard
                sitter={sitter}
                sitterId={sitterId ?? ""}
                initialOpenBooking={initialOpenBooking}
              />
            </div>
            <ReviewsSection
              rating={sitter.rating ?? 4.5}
              reviewCount={sitter.reviewCount ?? 0}
              reviews={reviews}
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              ratingFilter={ratingFilter}
              onRatingFilterChange={handleRatingFilterChange}
              isLoading={isReviewsLoading}
            />
          </section>

          <aside className="hidden lg:block lg:shrink-0 lg:self-stretch w-full lg:w-auto">
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
