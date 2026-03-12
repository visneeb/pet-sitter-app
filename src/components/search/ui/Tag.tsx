import { COLOR_TAG } from "@/constants/colorTag";
import cn from "@/utils/cn";

interface TagProps {
  label: string;
  index: number;
  className?: string;
}

export const Tag = ({ label, index ,className}: TagProps) => {
  const colors = COLOR_TAG({ index });

  return (
    <span
      className={cn(
        `flex flex-row justify-center items-center style-body-2 px-3 py-1 rounded-full box-border h-8 shrink-0 flex-none ${colors}`,
        className??'',
      )}
    >
      {label}
    </span> 
  );
};
