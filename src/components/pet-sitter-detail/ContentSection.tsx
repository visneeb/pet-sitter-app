interface ContentSectionProps {
  title: string;
  children: React.ReactNode;
}

export default function ContentSection({ title, children }: ContentSectionProps) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="style-headline-4 md:style-headline-3">{title}</h3>
      <div className="flex flex-col gap-3 text-gray-500 style-body-3 md:style-body-2">{children}</div>
    </div>
  );
}
