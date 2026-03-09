import Image from "next/image";
import type { OwnerItem } from "@/types/admin";
import cn from "@/utils/cn";
import { userStatusVariant } from "@/constants/status";

interface OwnerListTileProps {
  owner: OwnerItem;
  isLast: boolean;
}

function OwnerListTile({ owner, isLast }: OwnerListTileProps) {
  const { name, phone, email, petCount, status, profileImgUrl } = owner;

  return (
    <li
      className={cn(
        "flex items-center w-full h-23 bg-white",
        isLast ? "rounded-b-2xl" : "border-b border-gray-200",
      )}
    >
      <div className="flex flex-1 items-center gap-2.5 px-4 py-6 overflow-hidden">
        {profileImgUrl ? (
          <Image
            src={profileImgUrl}
            alt={`${name} profile`}
            width={44}
            height={44}
            className="hidden size-11 object-cover rounded-full md:block"
          />
        ) : (
          <div className="hidden md:flex size-11 rounded-full bg-gray-100 items-center justify-center style-body-4 text-gray-400">
            {name.slice(0, 1).toUpperCase()}
          </div>
        )}
        <p className="style-body-2 text-black truncate">{name}</p>
      </div>
      <div className="flex-1 px-4 style-body-2 text-black md:w-[calc(207/1120*100%)]">
        {phone}
      </div>
      <div className="hidden w-[calc(324/1120*100%)] min-w-80 px-4 style-body-2 text-black overflow-clip md:block">
        {email}
      </div>
      <div className="hidden w-[calc(224/1120*100%)] px-4 style-body-2 text-black xl:block">
        {petCount}
      </div>
      <div
        className={cn(
          "flex items-center gap-2 w-[calc(120/1120*100%)] min-w-25 px-4 style-body-2",
          userStatusVariant[status],
        )}
      >
        <span>•</span>
        {status}
      </div>
    </li>
  );
}

export default OwnerListTile;
