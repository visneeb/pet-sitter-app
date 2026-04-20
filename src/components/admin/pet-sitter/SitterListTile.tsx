import Image from "next/image";
import type { SitterItem } from "@/types/admin";
import cn from "@/utils/cn";
import {
  SitterStatus,
  sitterStatusVariant,
  UserStatus,
} from "@/constants/status";

interface SitterListTileProps {
  sitter: SitterItem;
  isLast: boolean;
  onClick: () => void;
}

function SitterListTile(props: SitterListTileProps) {
  const { sitter: user, tradeName, hasPendingUpdate, status } = props.sitter;

  let sitterStatus: SitterStatus | Extract<UserStatus, "Banned">;
  if (user.status === "Banned") {
    sitterStatus = "Banned";
  } else {
    sitterStatus = status;
  }

  return (
    <li
      className={cn(
        "flex items-center w-full h-23 cursor-pointer",
        hasPendingUpdate ? "bg-orange-100 hover:bg-orange-200" : "bg-white hover:bg-gray-100",
        props.isLast ? "rounded-b-2xl" : "border-b border-gray-200",
      )}
      onClick={props.onClick}
    >
      <div className="flex flex-1 items-center gap-2.5 px-4 py-6 overflow-hidden">
        {user.profileImgUrl ? (
          <Image
            src={user.profileImgUrl}
            alt={user.name}
            width={44}
            height={44}
            className="hidden size-11 min-w-11 object-cover rounded-full md:block"
          />
        ) : (
          <div className="hidden md:flex size-11 min-w-11 rounded-full bg-gray-100 items-center justify-center style-body-4 text-gray-400">
            {user.name.slice(0, 1).toUpperCase()}
          </div>
        )}
        <p className="style-body-2 text-black truncate">{user.name}</p>
      </div>
      <div className="hidden flex-1 px-4 style-body-2 text-black xl:block">
        {tradeName || "-"}
      </div>
      <div className="hidden w-[calc(324/1120*100%)] min-w-80 px-4 style-body-2 text-black md:block">
        {user.email}
      </div>
      <div
        className={cn(
          "flex items-center gap-2 w-[calc(216/1120*100%)] min-w-50 px-4 style-body-2",
          sitterStatusVariant[sitterStatus],
        )}
      >
        <span>•</span>
        {sitterStatus}
      </div>
    </li>
  );
}

export default SitterListTile;
