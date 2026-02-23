function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6">
      <h4 className="style-headline-4 text-gray-400">{title}</h4>
      {children}
    </div>
  );
}

export default Section;
