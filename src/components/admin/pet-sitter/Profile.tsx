import { ActionButton } from "@/components/ui/Button";
import InformationContainer from "@/components/ui/InformationContainer";
import { SitterProfileResponse } from "@/types/admin";
import { idNumberWithHyphen, phoneWithSpace } from "@/utils/user";
import { format } from "date-fns";
import { User } from "lucide-react";

function Profile({ sitter }: { sitter: SitterProfileResponse }) {
  return (
    <div className="flex flex-col gap-4 lg:gap-10">
      <div className="flex flex-col gap-4 lg:gap-10">
        <div className="flex flex-col gap-4 md:gap-10 xl:flex-row">
          {sitter.sitter.profileImgUrl ? (
            <div className="avatar">
              <div className="size-30 rounded-full md:size-60">
                <img
                  src={sitter.sitter.profileImgUrl}
                  alt={sitter.sitter.name}
                />
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
            <InformationContainer
              title="Pet Owner Name"
              detail={sitter.sitter.name}
            />
            <InformationContainer title="Email" detail={sitter.sitter.email} />
            <InformationContainer
              title="Phone"
              detail={phoneWithSpace(sitter.sitter.phone)}
            />
            <InformationContainer
              title="ID Number"
              detail={
                sitter.sitter.idNumber
                  ? idNumberWithHyphen(sitter.sitter.idNumber)
                  : "Unknown"
              }
            />
            <InformationContainer
              title="Date of Birth"
              detail={
                sitter.sitter.dateOfBirth
                  ? format(sitter.sitter.dateOfBirth, "d MMM yyyy")
                  : "Unknown"
              }
            />
            <InformationContainer
              title="Introduction"
              detail={sitter.introduction ?? "Unknown"}
            />
          </div>
        </div>
        <ActionButton variant="ghost" className="self-end">
          Ban This User
        </ActionButton>
      </div>
      <div className="border-t border-gray-300"></div>
      <div className="flex flex-col gap-8 lg:gap-10">
        <InformationContainer
          title="Pet sitter name (Trade Name)"
          detail={sitter.tradeName ?? "Unknown"}
        />
        <InformationContainer
          title="Pet type"
          detail={sitter.tradeName ?? "Unknown"}
        />
        <InformationContainer
          title="Services"
          detail={sitter.services ?? "Unknown"}
        />
        <InformationContainer
          title="My Place"
          detail={sitter.description ?? "Unknown"}
        />
        <InformationContainer
          title="My Place"
          detail={sitter.description ?? "Unknown"}
        />
        <InformationContainer
          title="Image Gallery"
          detail={sitter.description ?? "Unknown"}
        />
      </div>
      <div className="flex flex-col gap-8 lg:gap-10">
        <InformationContainer
          title="Address"
          detail={
            sitter.address
              ? `${sitter.address}\n${sitter.subDistrict}, ${sitter.district}, ${sitter.province}, ${sitter.postCode}`
              : "Unknown"
          }
        />
      </div>
    </div>
  );
}

export default Profile;
