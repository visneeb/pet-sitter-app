import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useMemo } from "react";

interface CardItem {
  id: number;
  name: string;
  owner: string;
  rating: number;
  types: string[];
  img: string;
}

interface BottomCardSlider {
  readonly className?: string;
  readonly items?: CardItem[];
}

const mockItems: CardItem[] = [
  {
    id: 1,
    name: "Happy House!",
    owner: "Jame Maison",
    rating: 5,
    types: ["Dog", "Cat", "Rabbit"],
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80",
  },
  {
    id: 2,
    name: "Pet Paradise",
    owner: "Sara Smith",
    rating: 4,
    types: ["Bird", "Rabbit"],
    img: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=300&q=80",
  },
  {
    id: 3,
    name: "Lovely Pets",
    owner: "Tom Lee",
    rating: 5,
    types: ["Dog", "Cat"],
    img: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=300&q=80",
  },
  {
    id: 4,
    name: "Furry Friends",
    owner: "Amy Tan",
    rating: 4,
    types: ["Cat", "Rabbit"],
    img: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300&q=80",
  },
  {
    id: 5,
    name: "Paw Haven",
    owner: "Mike Jordan",
    rating: 5,
    types: ["Dog"],
    img: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=300&q=80",
  },
];

function duplicateToMin<T>(items: readonly T[], min: number): T[] {
  if (items.length === 0) return [];
  if (items.length >= min) return [...items];

  const out: T[] = [];
  while (out.length < min) out.push(...items);
  return out.slice(0, min);
}

export default function BottomCardSlider({ className }: BottomCardSlider) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    dragFree: false,
    containScroll: false,
  });

  return (
    <section
      className={`${className ?? ""} pb-4 sm:pb-4 pointer-events-none`}
      aria-label="Recommended pet places"
    >
      {/* emblaRef อยู่ที่ overflow-hidden wrapper เพื่อให้ Embla คำนวณ viewport ได้ถูกต้อง */}
      <div
        className="overflow-hidden w-full touch-pan-y"
        ref={emblaRef}
        aria-roledescription="carousel"
      >
        <div className="flex -ml-3 px-4 py-3 pointer-events-auto cursor-grab active:cursor-grabbing">
          {mockItems.map((item, idx) => (
            <div key={`${item.id}-${idx}`} className="pl-3 shrink-0">
              <button
                type="button"
                onClick={() => emblaApi?.scrollTo(idx)}
                className="text-left w-[471px] h-[138px] shrink-0 flex flex-row items-center gap-3 rounded-2xl bg-white border border-zinc-100 shadow-md px-3 py-3 transition-all duration-200 hover:shadow-lg cursor-pointer"
              >
                {/* Thumbnail */}
                <Image
                  src={item.img}
                  alt={item.name}
                  width={80}
                  height={80}
                  className="h-20 w-20 rounded-xl object-cover shrink-0"
                />

                {/* Info */}
                <div className="flex flex-col gap-1 min-w-0">
                  {/* ชื่อ + rating */}
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-[14px] font-semibold text-zinc-800 truncate">
                      {item.name}
                    </h3>
                    <span className="text-yellow-400 text-xs shrink-0 tracking-tight">
                      {"★".repeat(item.rating)}
                    </span>
                  </div>

                  {/* ชื่อเจ้าของ */}
                  <p className="text-[12px] text-zinc-400">By {item.owner}</p>

                  {/* Pet type tags */}
                  <div className="flex flex-wrap gap-1 mt-1">
                    {item.types.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-zinc-200 px-2 py-0.5 text-[11px] text-zinc-500"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
