interface ContentSectionProps {
  title: string;
  children: React.ReactNode;
}

export default function ContentSection({ title, children }: ContentSectionProps) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="style-headline-3">{title}</h3>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}
