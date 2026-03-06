"use client";

import {
  ImageCarousel,
  ContentSection,
  ReviewsSection,
  PetSitterBookingCard,
  type CarouselImage,
  type Review,
} from "@/components/pet-sitter-detail";
import Loading from "@/components/common/loading/loading";
import { useParams, useSearchParams } from "next/navigation";
import { usePetSitterDetail } from "@/hooks/pet-sitter-detail/usePetSitterDetail";
import type { Sitter } from "@/types/sitter";
import { ExclamationCircleIcon } from "@/assets/icons/components";

const CAROUSEL_FALLBACK: CarouselImage[] = [
  {
    src: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?q=80&w=1600&auto=format&fit=crop",
    alt: "Woman sitting with husky",
  },
  {
    src: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?q=80&w=1600&auto=format&fit=crop",
    alt: "Golden retriever on a bed",
  },
  {
    src: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=1600&auto=format&fit=crop",
    alt: "Cat relaxing on a sofa",
  },
  {
    src: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=1600&auto=format&fit=crop",
    alt: "Dog outside",
  },
];

function getCarouselImages(sitter: Sitter | null): CarouselImage[] {
  if (!sitter) return CAROUSEL_FALLBACK;
  const urls = sitter.imgUrls?.length
    ? sitter.imgUrls
    : sitter.imgUrl
      ? [sitter.imgUrl]
      : [];
  if (urls.length === 0) return CAROUSEL_FALLBACK;
  return urls.map((src, i) => ({ src, alt: `Pet sitter image ${i + 1}` }));
}

const REVIEWS: Review[] = [
  {
    reviewerName: "David M.",
    date: "Aug 16,2023",
    comment:
      "I recently had the pleasure of entrusting Jane Maison with the care of my two energetic Labrador Retrievers, Max and Bella, while I was away on a business trip. I can confidently say that Jane exceeded all my expectations as a pet sitter.",
  },
  {
    reviewerName: "David M.",
    date: "Aug 16,2023",
    comment:
      "Jane Maison did a great job looking after my energetic dog, Buddy. While I was away, she made sure Buddy got his exercise and kept up with his feeding schedule. I appreciated the updates she sent, although I would have liked a bit more frequent communication. Overall, I'm satisfied with her service and would consider using her again in the future.",
  },
  {
    reviewerName: "David M.",
    date: "Aug 16,2023",
    comment:
      "Jane Maison is a lifesaver! She took care of my rambunctious rabbit, Flopsy, while I was away on vacation. Flopsy can be quite picky, but Jane knew just how to keep her happy and entertained. I received adorable photos of Flopsy munching on her favorite greens and exploring new play areas. I'm so grateful to have found Jane, and I highly recommend her pet sitting services!",
  },
  {
    reviewerName: "David M.",
    date: "Aug 16,2023",
    comment:
      "Jane Maison is a lifesaver! She took care of my rambunctious rabbit, Flopsy, while I was away on vacation. Flopsy can be quite picky, but Jane knew just how to keep her happy and entertained. I received adorable photos of Flopsy munching on her favorite greens and exploring new play areas. I'm so grateful to have found Jane, and I highly recommend her pet sitting services!",
  },
  {
    reviewerName: "David M.",
    date: "Aug 16,2023",
    comment:
      "Jane Maison is a lifesaver! She took care of my rambunctious rabbit, Flopsy, while I was away on vacation. Flopsy can be quite picky, but Jane knew just how to keep her happy and entertained. I received adorable photos of Flopsy munching on her favorite greens and exploring new play areas. I'm so grateful to have found Jane, and I highly recommend her pet sitting services!",
  },
];

const MAP_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30992.755984367002!2d100.62135467250974!3d13.83336385331918!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29d0c38ddcab5%3A0x277ed5d259125dca!2z4LiL4LmJ4LiH4LmA4Lib4LmH4LiU4Lie4Liw4LmC4Lil4LmJIOC4p-C4seC4h-C4q-C4tOC4mQ!5e0!3m2!1sth!2sth!4v1772592116159!5m2!1sth!2sth";

export default function PetSitterDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const sitterid = params.sitterid;
  const sitterId = Array.isArray(sitterid) ? sitterid[0] : sitterid;
  const { sitter, isLoading, error } = usePetSitterDetail(sitterId);
  const initialOpenBooking = searchParams.get("openBooking") === "1";

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
        <section className="w-full py-10 md:py-10">
          <div className="relative">
            <ImageCarousel images={carouselImages} />
          </div>
        </section>

        <div className="w-full md:px-20 md:pt-0 flex flex-col md:flex-row md:flex-nowrap md:justify-center md:items-start gap-8">
          <section className="flex flex-col gap-10">
            <div className="flex flex-col gap-12 md:px-20 md:py-6 w-full md:max-w-[848px] md:shrink-0">
              <h1 className="style-headline-1">{sitter.tradeName}</h1>

              <ContentSection title="Introduction">
                <p className="style-body-2 text-gray-500">
                  {sitter.introduction}
                </p>
              </ContentSection>

              <ContentSection title="Services">
                <p className="style-body-2 text-gray-500">{sitter.services}</p>
              </ContentSection>

              <ContentSection title="My places">
                <p className="style-body-2 text-gray-500">
                  {sitter.description}
                </p>
                <iframe
                  src={MAP_EMBED_URL}
                  width="688"
                  height="219"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Pet sitter location map"
                />
              </ContentSection>
            </div>

            <ReviewsSection
              rating={sitter.rating ?? 4.5}
              reviewCount={27}
              reviews={REVIEWS}
              totalPages={3}
              currentPage={1}
              onPageChange={() => {}}
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
