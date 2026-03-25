type Props = {
  id: string;
  text: string;
  messageType: "text" | "image";
  imageUrl?: string | null;
  isMe: "me" | "other";
  onImageLoadError?: (messageId: string) => void;
};

export default function MessageBubble({
  id,
  text,
  messageType,
  imageUrl,
  isMe,
  onImageLoadError,
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

  return (
    <div className={`flex ${isMe === "me" ? "justify-end" : "justify-start"}`}>
      <div className={bubbleClassName}>
        {messageType === "image" && imageUrl ? (
          <a href={imageUrl} target="_blank" rel="noreferrer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt="Chat image"
              className="max-h-80 w-auto max-w-full rounded-xl object-cover"
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
