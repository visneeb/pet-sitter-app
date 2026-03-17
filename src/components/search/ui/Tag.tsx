import petTypeColorTag from "@/constants/petTag";
import cn from "@/utils/cn";

interface TagProps {
  label: string;
  className?: string;
}

export const Tag = ({ label, className }: TagProps) => {
  return (
    <span
      className={cn(
        `flex flex-row justify-center items-center style-body-2 px-3 py-1 rounded-full box-border h-8 shrink-0 flex-none`,
        petTypeColorTag[label],
        className ?? "",
      )}
    >
      {label}
    </span>
  );
};
