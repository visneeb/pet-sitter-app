import Image, { StaticImageData } from "next/image";

interface FeatureCardProps {
  image: StaticImageData;
  alt: string;
  highlightedWord: string;
  restOfTitle: string;
  highlightColor: string;
  description: string;
}

export default function FeatureCard({
  image,
  alt,
  highlightedWord,
  restOfTitle,
  highlightColor,
  description,
}: FeatureCardProps) {
  return (
    <div className="flex flex-col gap-10 items-center px-6 ">
      <Image
        src={image}
        alt={alt}
        className="w-50 h-50 md:w-72 md:h-72 object-contain rounded-full shrink-0"
      />
      <div className="flex flex-col gap-3 items-center">
        <h3 className="style-headline-3 text-balance text-center">
          <span className={highlightColor}>{highlightedWord}</span>
          {" " + restOfTitle}
        </h3>
        <p className="style-body-1 text-center text-gray-500 text-balance">
          {description}
        </p>
      </div>
    </div>
  );
}
