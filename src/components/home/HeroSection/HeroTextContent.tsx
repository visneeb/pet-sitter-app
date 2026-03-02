const STYLES = {
  container: "flex flex-col justify-center items-center",
  heading: "text-black style-headline-1 sm:style-display font-black",
  subheading:
    "text-gray-400 style-headline-4 mt-[24px] sm:style-headline-3 md:mt-[32px]",
} as const;

type HeadlinePart = {
  text: string;
  accentColor: string;
  accentChar: string;
};

const HEADLINE_PARTS: HeadlinePart[] = [
  { text: "Pet Sitter", accentColor: "text-orange-500", accentChar: "," },
  { text: "Perfect", accentColor: "text-blue-500", accentChar: "," },
  { text: "For Your Pet", accentColor: "text-yellow-200", accentChar: "." },
];

const SUBHEADING_TEXT = "Find your perfect pet sitter with us.";

export function HeroTextContent() {
  return (
    <div className={STYLES.container}>
      {HEADLINE_PARTS.map(({ text, accentColor, accentChar }) => (
        <h1 key={text} className={STYLES.heading}>
          {text}
          <span className={accentColor}>{accentChar}</span>
        </h1>
      ))}
      <p className={STYLES.subheading}>{SUBHEADING_TEXT}</p>
    </div>
  );
}
