import type { LabelValueProps } from "@/types/booking";

export default function DetailLabel({
  label,
  value,
  className = "",
  labelClassName = "",
  valueClassName = "",
}: LabelValueProps) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <h4 className={`style-body-3 md:style-headline-4 text-gray-300 ${labelClassName}`}>{label}</h4>
      <span className={`style-body-2 text-black ${valueClassName}`}>{value}</span>
    </div>
  );
}
