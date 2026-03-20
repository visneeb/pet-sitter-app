export default function ProfileContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-lg flex flex-col px-4 py-6 gap-6 lg:gap-12 lg:p-10">
      {children}
    </div>
  );
}
