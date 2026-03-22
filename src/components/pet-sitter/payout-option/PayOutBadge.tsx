import { ReactNode } from "react";

interface PayOutProps {
  icon: ReactNode;
  title: string;
  className?: string;
  rightElement: string;
}

export function PayOutBadge({ icon, title, rightElement }: PayOutProps) {
  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl flex flex-row p-6 justify-between">
        <div className="flex flex-row gap-2 items-center">
          <p className="text-gray-600">{icon}</p>
          <p>{title}</p>
        </div>
        <div>{rightElement}</div>
      </div>
    </div>
  );
}
