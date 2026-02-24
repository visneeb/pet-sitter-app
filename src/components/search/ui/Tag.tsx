import { COLOR_TAG } from "@/constants/colorTag";

export const Tag = ({ label, index }: { label: string; index: number }) => {
  const colors = COLOR_TAG({ index });

  return (
    <span
      className={`style-body-2 px-3 py-1 rounded-full font-medium ${colors}`}
    >
      {label}
    </span>
  );
};
