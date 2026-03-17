export const COLOR_TAG = ({
  label,
  index,
}: {
  label?: string;
  index?: number;
}) => {
  const colors = [
    "bg-green-100 text-green-500 border border-green-500",
    "bg-pink-100 text-pink-500 border border-pink-500",
    "bg-blue-100 text-blue-500 border border-blue-500",
    "bg-orange-100 text-orange-400 border border-orange-400",
    "bg-purple-100 text-purple-600 border border-purple-200",
    "bg-yellow-100 text-yellow-600 border border-yellow-200",
    "bg-teal-100 text-teal-600 border border-teal-200",
    "bg-red-100 text-red-600 border border-red-200",
  ];

  // If a label is provided, generate a stable color based on the label
  if (label) {
    let hash = 0;
    for (let i = 0; i < label.length; i += 1) {
      hash = (hash * 31 + label.charCodeAt(i)) >>> 0;
    }
    const labelIndex = hash % colors.length;
    return colors[labelIndex];
  }

  // Fallback to index-based coloring if needed
  const safeIndex = typeof index === "number" ? index : 0;
  return colors[safeIndex % colors.length];
};
