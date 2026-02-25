import { COLOR_TAG } from "@/constants/colorTag";
import cn from "@/utils/cn";

export const Tag = ({ label, index }: { label: string; index: number }) => {
  const colors = COLOR_TAG({ index });

  return (
    <span
      className={cn(
        `flex flex-row justify-center items-center style-body-2 px-3 py-1 rounded-full ${colors} w-[63px] h-[32px]`,
      )}
    >
      {label}
    </span> 
  );
};
