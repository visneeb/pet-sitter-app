import { ActionButton } from "@/components/ui/Button";
import InformationContainer from "@/components/ui/InformationContainer";
import petTypeColorTag from "@/constants/petTag";
import { SitterProfileResponse } from "@/types/admin";
import cn from "@/utils/cn";
import { idNumberWithHyphen, phoneWithSpace } from "@/utils/user";
import { format } from "date-fns";
import { User } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";

const LeafletMap = dynamic(() => import("@/components/Map/LeafletMap"), {
  ssr: false,
});
const MapControls = dynamic(
  () => import("@/components/map-search/MapControls"),
  { ssr: false },
);
const OwnerMarker = dynamic(
  () => import("@/components/Map/ui/Marker/OwnerMarker"),
  { ssr: false },
);

const showBanUserModal = () => {
  const dialog = document.getElementById(
    "ban-user",
  ) as HTMLDialogElement | null;

  if (!dialog) return;

  dialog.showModal();
};

const showUnbanUserModal = () => {
  const dialog = document.getElementById(
    "unban-user",
  ) as HTMLDialogElement | null;

  if (!dialog) return;

  dialog.showModal();
};

function Profile({
  sitter,
  sitterPending,
}: {
  sitter: SitterProfileResponse;
  sitterPending: Omit<
    SitterProfileResponse,
    "sitter" | "hasPendingUpdate" | "status"
  > | null;
}) {
  const [isSeeUpdate, setIsSeeUpdate] = useState<boolean>(true);

  const addresses = [
    sitter.address,
    [sitter.subDistrict, sitter.district, sitter.province, sitter.postCode]
      .filter((address) => address !== undefined && address !== null)
      .join(", "),
  ];
  const addressesString = addresses
    .filter((address) => address !== undefined && address !== null)
    .join("\n");

  let hasPetTypeupdate = false;
  let hasImageupdate = false;
  let pendingUpdatedAddresses: (string | undefined)[] | null = null;
  let pendingUpdatedAddressesString: string | null = null;

  if (sitterPending) {
    if (sitter.petTypes.length !== sitterPending.petTypes.length) {
      hasPetTypeupdate = true;
    } else {
      for (let i = 0; i < sitter.petTypes.length; i++) {
        if (sitter.petTypes[i] !== sitterPending.petTypes[i]) {
          hasPetTypeupdate = true;
          break;
        }
      }
    }

    if (sitter.imgUrls.length !== sitterPending.imgUrls.length) {
      hasImageupdate = true;
    } else {
      for (let i = 0; i < sitter.imgUrls.length; i++) {
        if (sitter.imgUrls[i] !== sitterPending.imgUrls[i]) {
          hasImageupdate = true;
          break;
        }
      }
    }

    pendingUpdatedAddresses = [
      sitterPending.address,
      [
        sitterPending.subDistrict,
        sitterPending.district,
        sitterPending.province,
        sitterPending.postCode,
      ]
        .filter((address) => address !== undefined && address !== null)
        .join(", "),
    ];
    pendingUpdatedAddressesString = pendingUpdatedAddresses
      .filter((address) => address !== undefined && address !== null)
      .join("\n");
  }

  return (
    <div className="flex flex-col gap-4 lg:gap-10">
      <div className="flex flex-col gap-4 lg:gap-10">
        <div className="flex flex-col gap-4 md:gap-10 xl:flex-row">
          <div className="flex justify-between items-start lg:flex-col lg:justify-start lg:gap-8">
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
            {sitter.hasPendingUpdate && (
              <ActionButton
                variant="ghost"
                onClick={() => setIsSeeUpdate((prev) => !prev)}
              >
                {isSeeUpdate ? "Hide update" : "See update"}
              </ActionButton>
            )}
          </div>
          <div className="flex min-w-0 flex-col gap-8 rounded-lg lg:gap-10 xl:flex-1 xl:p-6 xl:bg-gray-100">
            <InformationContainer
              title="Pet Owner Name"
              detail={sitter.sitter.name}
            />
            <InformationContainer title="Email" detail={sitter.sitter.email} />
            <InformationContainer
              title="Experience"
              detail={
                <>
                  <span>
                    {sitter.experience
                      ? `${sitter.experience} Years`
                      : "Unknown"}
                  </span>
                  {isSeeUpdate &&
                    sitterPending &&
                    sitterPending.experience !== sitter.experience && (
                      <span className="text-orange-500">
                        {sitterPending.experience
                          ? `${sitterPending.experience} Years`
                          : "Unknown"}
                      </span>
                    )}
                </>
              }
            />
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
              detail={
                <>
                  <span>{sitter.introduction ?? "Unknown"}</span>
                  {isSeeUpdate &&
                    sitterPending &&
                    sitterPending.introduction !== sitter.introduction && (
                      <span className="text-orange-500">
                        {sitterPending.introduction}
                      </span>
                    )}
                </>
              }
            />
          </div>
        </div>
        {sitter.sitter.status === "Normal" ? (
          <ActionButton
            variant="ghost"
            onClick={showBanUserModal}
            className="self-end"
          >
            Ban This User
          </ActionButton>
        ) : (
          <ActionButton
            variant="ghost"
            onClick={showUnbanUserModal}
            className="self-end"
          >
            Unban This User
          </ActionButton>
        )}
      </div>
      <div className="border-t border-gray-300 xl:hidden" />
      <div className="flex flex-col gap-8 rounded-lg lg:gap-10 xl:p-6 xl:bg-gray-100">
        <InformationContainer
          title="Pet sitter name (Trade Name)"
          detail={
            <>
              <span>{sitter.tradeName ?? "Unknown"}</span>
              {isSeeUpdate &&
                sitterPending &&
                sitterPending.tradeName !== sitter.tradeName && (
                  <span className="text-orange-500">
                    {sitterPending.tradeName}
                  </span>
                )}
            </>
          }
        />
        <InformationContainer
          title="Pet type"
          detail={
            <>
              {sitter.petTypes.length ? (
                <ul className="flex gap-2">
                  {sitter.petTypes.map((petType, index) => (
                    <li
                      key={petType}
                      className={cn(
                        "style-label px-4 py-1 rounded-full",
                        petTypeColorTag[petType],
                      )}
                    >
                      {petType}
                    </li>
                  ))}
                </ul>
              ) : (
                "Unknown"
              )}
              {isSeeUpdate &&
                sitterPending &&
                hasPetTypeupdate &&
                (sitterPending.petTypes.length ? (
                  <ul className="flex gap-2">
                    {sitterPending.petTypes.map((petType, index) => (
                      <li
                        key={petType}
                        className={cn(
                          "style-label px-4 py-1 rounded-full",
                          petTypeColorTag[petType],
                          "border-orange-500",
                        )}
                      >
                        {petType}
                      </li>
                    ))}
                  </ul>
                ) : (
                  "Unknown"
                ))}
            </>
          }
        />
        <InformationContainer
          title="Services"
          detail={
            <>
              <span>{sitter.services ?? "Unknown"}</span>
              {isSeeUpdate &&
                sitterPending &&
                sitterPending.services !== sitter.services && (
                  <span className="text-orange-500">
                    {sitterPending.services}
                  </span>
                )}
            </>
          }
        />
        <InformationContainer
          title="My Place"
          detail={
            <>
              <span>{sitter.description ?? "Unknown"}</span>
              {isSeeUpdate &&
                sitterPending &&
                sitterPending.description !== sitter.description && (
                  <span className="text-orange-500">
                    {sitterPending.description}
                  </span>
                )}
            </>
          }
        />
        <InformationContainer
          title="Image Gallery"
          detail={
            <>
              {sitter.imgUrls.length ? (
                <ul className="grid grid-cols-[repeat(auto-fit,240px)] justify-between gap-4">
                  {sitter.imgUrls.map((image, index) => (
                    <li key={index}>
                      <img
                        src={image}
                        className="aspect-246/185 min-w-[246px] h-[185px] object-cover"
                      />
                    </li>
                  ))}
                </ul>
              ) : (
                "No images"
              )}
              {isSeeUpdate &&
                sitterPending &&
                hasImageupdate &&
                (sitterPending.imgUrls.length ? (
                  <ul className="grid grid-cols-[repeat(auto-fit,240px)] justify-between gap-4">
                    {sitterPending.imgUrls.map((image, index) => (
                      <li key={index} className="border border-orange-500">
                        <img
                          src={image}
                          className="aspect-246/185 min-w-[246px] h-[185px] object-cover"
                        />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-orange-500">No images</span>
                ))}
            </>
          }
        />
      </div>
      <div className="border-t border-gray-300 xl:hidden" />
      <div className="flex flex-col gap-8 rounded-lg lg:gap-10 xl:p-6 xl:bg-gray-100">
        <InformationContainer
          title="Address"
          detail={
            <>
              <span>
                {addressesString.length ? addressesString : "Unknown"}
              </span>
              {isSeeUpdate &&
                sitterPending &&
                pendingUpdatedAddressesString !== addressesString && (
                  <span className="text-orange-500">
                    {pendingUpdatedAddressesString?.length
                      ? pendingUpdatedAddressesString
                      : "Unknown"}
                  </span>
                )}
            </>
          }
        />
        {typeof sitter.latitude === "number" &&
          typeof sitter.longitude === "number" && (
            <LeafletMap
              center={[sitter.latitude, sitter.longitude]}
              className="w-full h-100"
            >
              <MapControls hasSearch={false} />
              <OwnerMarker position={[sitter.latitude, sitter.longitude]} />
            </LeafletMap>
          )}
        {isSeeUpdate &&
          sitterPending &&
          (sitterPending.latitude !== sitter.latitude ||
            sitterPending.longitude !== sitter.longitude) &&
          typeof sitterPending.latitude === "number" &&
          typeof sitterPending.longitude === "number" && (
            <LeafletMap
              center={[sitterPending.latitude, sitterPending.longitude]}
              className="w-full h-100 border border-orange-500"
            >
              <MapControls hasSearch={false} />
              <OwnerMarker
                position={[sitterPending.latitude, sitterPending.longitude]}
              />
            </LeafletMap>
          )}
      </div>
    </div>
  );
}

export default Profile;
