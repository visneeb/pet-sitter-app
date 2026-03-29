type Props = {
  id: string;
  text: string;
  messageType: "text" | "image";
  imageUrl?: string | null;
  isMe: "me" | "other";
  onImageLoadError?: (messageId: string) => void;
  onImageLoad?: () => void;
  otherAvatarUrl?: string | null;
  otherDisplayName?: string | null;
};

export default function MessageBubble({
  id,
  text,
  messageType,
  imageUrl,
  isMe,
  onImageLoadError,
  onImageLoad,
  otherAvatarUrl,
  otherDisplayName,
}: Props) {
  const bubbleClassName =
    messageType === "image"
      ? `max-w-[70%] overflow-hidden rounded-2xl p-2 ${
          isMe === "me" ? "bg-orange-500 rounded-br-none" : "bg-gray-100 rounded-bl-none"
        }`
      : `max-w-[60%] whitespace-pre-wrap rounded-2xl px-4 py-2 style-body-2 ${
          isMe === "me"
            ? "bg-orange-500 text-white rounded-br-none"
            : "bg-gray-100 text-gray-800 rounded-bl-none"
        }`;

  const shouldShowAvatar = isMe === "other" && Boolean(otherAvatarUrl || otherDisplayName);
  const avatarLetter = (otherDisplayName?.trim()?.[0] ?? "").toUpperCase();

  return (
    <div
      className={`flex ${isMe === "me" ? "justify-end" : "justify-start"} ${
        shouldShowAvatar ? "gap-2 items-start" : ""
      }`}
    >
      {shouldShowAvatar ? (
        <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-gray-200">
          {otherAvatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={otherAvatarUrl}
              alt={otherDisplayName ?? "Chat partner"}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-sm font-semibold text-gray-600">
              {avatarLetter || "?"}
            </div>
          )}
        </div>
      ) : null}

      <div className={bubbleClassName}>
        {messageType === "image" && imageUrl ? (
          <a href={imageUrl} target="_blank" rel="noreferrer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt="Chat image"
              className="max-h-80 w-auto max-w-full rounded-xl object-cover"
              onLoad={onImageLoad}
              onError={() => {
                onImageLoadError?.(id);
              }}
            />
          </a>
        ) : (
          text
        )}
      </div>
    </div>
  );
}
