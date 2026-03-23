"use client";

import { PayOutBadge } from "@/components/pet-sitter/payout-option/PayOutBadge";
import { BahtIcon, WalletIcon } from "@/assets/icons/components";
import { UserProfileHeader } from "@/components/profile/ProfileHeader";
import ProfileContainer from "@/components/profile/ProfileContainer";
import { PayoutList } from "@/components/pet-sitter/payout-option/PayoutList";
import { usePayoutList } from "@/hooks/profile/pet-sitter-profile/payout/usePayoutList";

const COLS = "grid grid-cols-[0.8fr_0.8fr_2fr_minmax(1rem,auto)]";
const COLUMN_NAMES = ["Date", "From", "Transaction No.", "Amount"];

export function PayoutOptionPage() {
  const { data, isLoading } = usePayoutList();

  return (
    <>
      <UserProfileHeader title="Payout Option" />
      <div className="flex flex-row justify-between gap-6 py-6">
        <PayOutBadge
          icon={<BahtIcon />}
          title="Total Earning"
          rightElement={data?.totalEarning?.toString() ?? "0"}
        />
        <PayOutBadge
          icon={<WalletIcon />}
          title="Pending Payout"
          rightElement="4000"
        />
      </div>

      <div className="bg-white rounded-2xl">
        {/* Desktop header */}
        <header
          className={`hidden sm:grid ${COLS} py-3 bg-black rounded-t-2xl`}
        >
          {COLUMN_NAMES.map((label) => (
            <p key={label} className="px-4 style-body-3 text-white">
              {label}
            </p>
          ))}
        </header>
        {/* Mobile header */}
        <header className="sm:hidden grid grid-cols-[1fr_auto] py-3 px-4 bg-black rounded-t-2xl">
          <p className="style-body-3 text-white">Transaction</p>
          <p className="style-body-3 text-white">Amount</p>
        </header>
        <PayoutList data={data} isLoading={isLoading} cols={COLS} />
      </div>
    </>
  );
}
