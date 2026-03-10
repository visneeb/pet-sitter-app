import { ActionButton } from "@/components/ui/Button";
import InformationContainer from "@/components/ui/InformationContainer";
import { OwnerProfileResponse } from "@/types/admin";
import { idNumberWithHyphen, phoneWithSpace } from "@/utils/user";
import { format } from "date-fns";
import { User } from "lucide-react";

function Profile({ owner }: { owner: OwnerProfileResponse }) {
  return (
    <div className="flex flex-col gap-4 lg:gap-10">
      <div className="flex flex-col gap-4 md:gap-10 xl:flex-row">
        {owner.profileImgUrl ? (
          <div className="avatar">
            <div className="size-30 rounded-full md:size-60">
              <img src={owner.profileImgUrl} alt={owner.name} />
            </div>
          </div>
        ) : (
          <div className="avatar avatar-placeholder">
            <div className="size-30 bg-gray-200 rounded-full md:size-60">
              <User className="size-10 text-white md:size-26" />
            </div>
          </div>
        )}
        <div className="flex min-w-0 flex-col gap-8 lg:gap-10 xl:flex-1 xl:p-6">
          <InformationContainer title="Pet Owner Name" detail={owner.name} />
          <InformationContainer title="Email" detail={owner.email} />
          <InformationContainer
            title="Phone"
            detail={phoneWithSpace(owner.phone)}
          />
          <InformationContainer
            title="ID Number"
            detail={
              owner.idNumber ? idNumberWithHyphen(owner.idNumber) : "Unknown"
            }
          />
          <InformationContainer
            title="Date of Birth"
            detail={
              owner.dateOfBirth
                ? format(owner.dateOfBirth, "d MMM yyyy")
                : "Unknown"
            }
          />
        </div>
      </div>
      <ActionButton variant="ghost" className="self-end">
        Ban This User
      </ActionButton>
    </div>
  );
}

export default Profile;
