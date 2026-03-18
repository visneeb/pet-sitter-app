import type { LabelValueProps } from "@/types/booking";

export default function DetailLabel({
  label,
  value,
  className = "",
}: LabelValueProps) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <h4 className="style-headline-4 text-gray-300">{label}</h4>
      <span className="style-body-2 text-black">{value}</span>
    </div>
  );
}
