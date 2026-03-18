import DetailLabel from "@/components/ui/detail/DetailLabel";
import { useBookingDetail } from "@/hooks/booking/useBookingDetail";
import { useParams } from "next/navigation";
import Image from "next/image";
import { UserRound, X } from "lucide-react";

interface ProfileModalProps {
  onClose: () => void;
}

function ProfileModal({ onClose }: ProfileModalProps) {
  const params = useParams();
  const bookingId = Number(params.bookingId);
  const { booking, isLoading } = useBookingDetail(bookingId);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div></div>
      <div className="bg-white max-w-[800px] w-full rounded-2xl">
        <div className="flex justify-between items-center border-b border-gray-200 px-[40px] py-[24px] gap-[10px]">
          <h3 className="text-2xl font-bold">
            {booking?.petOwnerName ?? "Your Name"}
          </h3>
          <X className="w-[24px] h-[24px] cursor-pointer" onClick={onClose} />
        </div>
        <div className="flex gap-[40px] p-[40px] ">
          <div>
            <div className="flex items-center justify-center w-[240px] h-[240px] bg-gray-100 rounded-full text-gray-300  overflow-hidden">
              {isLoading ? (
                <div className="animate-spin rounded-full w-8 h-8 border-1 border-t-orange-500" />
              ) : booking?.petOwnerProfileImg ? (
                <Image
                  src={booking.petOwnerProfileImg}
                  alt="Profile"
                  width={240}
                  height={240}
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserRound className="w-[240px] h-[240px]" />
              )}
            </div>
          </div>
          <div
            className="flex flex-col bg-bg-gray rounded-lg p-[24px] gap-[40px] w-[440px]
          "
          >
            <DetailLabel
              label="Pet Owner Name"
              value={booking?.petOwnerName ?? "-"}
            />
            <DetailLabel label="Email" value={booking?.petOwnerEmail ?? "-"} />
            <DetailLabel label="Phone" value={booking?.petOwnerPhone ?? "-"} />
            <DetailLabel label="ID Number" value={booking?.bookingId ?? "-"} />
            <DetailLabel
              label="Date of Birth"
              value={booking?.petOwnerDateOfBirth ?? "-"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileModal;
