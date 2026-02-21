export const Tag = ({ label }: { label: string }) => {
  let colors = "bg-gray-100 text-gray-600";
  if (label === "Dog")
    colors = "bg-green-100 text-green-600 border border-green-200";
  if (label === "Cat")
    colors = "bg-pink-100 text-pink-600 border border-pink-200";
  if (label === "Bird")
    colors = "bg-blue-100 text-blue-600 border border-blue-200";
  if (label === "Rabbit")
    colors = "bg-orange-100 text-orange-600 border border-orange-200";

  return (
    <span className={`style-body-2 px-3 py-1 rounded-full font-medium ${colors}`}>
      {label}
    </span>
  );
};
