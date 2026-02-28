export default function ProfileContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-lg flex flex-col p-10 gap-12">
      {children}
    </div>
  );
}
