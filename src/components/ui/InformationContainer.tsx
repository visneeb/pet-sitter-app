function InformationContainer({
  title,
  detail,
}: {
  title: string;
  detail: React.ReactNode;
}) {
  return (
    <section className="flex w-full min-w-0 flex-col gap-1">
      <span className="style-headline-4 text-gray-300">{title}</span>
      <p className="style-input w-full min-w-0 text-black wrap-break-word whitespace-pre-wrap">
        {detail}
      </p>
    </section>
  );
}

export default InformationContainer;
