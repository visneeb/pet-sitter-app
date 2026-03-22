import { PayOutBadge } from "@/components/pet-sitter/payout-option/PayOutBadge";
import { BahtIcon, WalletIcon } from "@/assets/icons/components";
import { UserProfileHeader } from "@/components/profile/ProfileHeader";
import ProfileContainer from "@/components/profile/ProfileContainer";

export function PayoutOptionPage() {
  const COLS = "grid grid-cols-[0.8fr_0.8fr_2fr_minmax(1rem,auto)]";
  const columnName = ["Date", "From", "Transaction No.", "Amount"];
  return (
    <>
      <UserProfileHeader title="Payout Option" />
      <div className="flex flex-row justify-between gap-6 py-6">
        <PayOutBadge
          icon={<BahtIcon />}
          title="Total Earning"
          rightElement="4000"
        />
        <PayOutBadge
          icon={<WalletIcon />}
          title="Total Earning"
          rightElement="4000"
        />
      </div>

      <header className={`${COLS} py-3 bg-black rounded-t-2xl`}>
        {columnName.map((label) => (
          <p key={label} className="px-4 style-body-3 text-white">
            {label}
          </p>
        ))}
      </header>
      <ProfileContainer>
        <ul></ul>
      </ProfileContainer>
    </>
  );
}
