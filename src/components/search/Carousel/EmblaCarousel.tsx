import React from "react";

import useEmblaCarousel from "embla-carousel-react";

import Image from "next/image";

export function EmblaCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    loop: true,
  });

  const images = [
    "https://static.scientificamerican.com/sciam/cache/file/9CAE9C60-8BC5-4CA3-95C180EFACDD99FD_source.jpg?w=1200",
  ];

  const rep = [1, 2, 3, 4, 5];

  const handleCardClick = (index: number) => {
    if (!emblaApi) return; // ยังไม่ได้ init
    emblaApi.scrollTo(index); // ด้วย align: "center" จะมาอยู่ตรงกลาง
  };

  return (
    <div className="embla">
      {/* viewport */}
      <div ref={emblaRef} className="overflow-hidden">
        {/* container */}
        <div className="flex flex-row touch-pan-y touch-pinch-zoom ml-3">
          {/* slide */}
          {rep.map((item, index) => {
            return (
              <article
                key={index}
                onClick={() => handleCardClick(index)}
                className="flex-none flex flex-row gap-4 w-[423px] min-w-0 h-[124px] bg-white ml-3 rounded-2xl p-2 items-center"
              >
                <div id="img-place" className="w-[144px] h-[108px]">
                  <Image
                    src={images[0]}
                    alt=""
                    width={144}
                    height={108}
                    className="rounded-lg"
                  />
                </div>
                <div className="w-full">
                  <div className="flex flex-col">
                    <p>Happy House!</p> <p>By Jame Maison {item}</p>
                  </div>
                  <div>
                    <p>Price</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
