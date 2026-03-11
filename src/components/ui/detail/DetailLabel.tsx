type LabelValueProps = {
  label: string;
  value: string | number;
  className?: string;
};

export default function DetailLabel({
  label,
  value,
  className = "",
}: LabelValueProps) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <h4 className="text-xl text-gray-300 font-bold">{label}</h4>
      <span className="text-base text-black font-regular">{value}</span>
    </div>
  );
}
