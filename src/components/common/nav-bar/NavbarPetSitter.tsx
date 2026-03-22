"use client";
import Link from "next/link";
import { CommentsAltIcon } from "@/assets/icons/components/icons";
import { useProfileImg } from "@/hooks/image/useProfileImg";
import { useChatUnread } from "@/contexts/ChatUnreadContext";

import Image from "next/image";
import { UserRound } from "lucide-react";

export default function NavbarPetSitter() {
  const { profile, loading } = useProfileImg();
  const { unreadTotal } = useChatUnread();
  return (
    <div
      className={`relative flex items-center justify-between bg-white w-full style-body-2 h-20 lg:px-15 lg:py-4 px-4 py-3`}
    >
      <div className="flex items-center justify-center text-center gap-2">
        <div tabIndex={0} role="button" className="avatar cursor-pointer">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full text-gray-300 hover:bg-gray-200 transition overflow-hidden">
            {loading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500" />
            ) : profile?.profileImgUrl ? (
              <Image
                src={profile.profileImgUrl}
                alt="Profile"
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            ) : (
              <UserRound className="w-6 h-6" />
            )}
          </div>
        </div>
        <h1 className="style-body-2 text-gray-600 text-center hidden sm:block">
          {profile?.name}
        </h1>
      </div>
      <Link
        href="/chat"
        className="relative flex items-center justify-center rounded-full bg-gray-100 w-10 h-10 hover:bg-gray-200"
      >
        <CommentsAltIcon className="w-6 h-6 text-gray-400" />
        {unreadTotal > 0 ? (
          <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-semibold text-white">
            {unreadTotal > 99 ? "99+" : unreadTotal}
          </span>
        ) : null}
      </Link>
    </div>
  );
}
