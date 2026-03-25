import { ImageIcon } from "@/assets/icons/components";
import { MessageIcon } from "@/assets/icons/components";
import {
  useState,
  FormEvent,
  KeyboardEvent,
  ChangeEvent,
  useCallback,
  useRef,
  useEffect,
} from "react";

/** ความสูงสูงสุดของ textarea (px) — แก้ค่าตรงนี้เมื่อต้องการจำกัดความสูง */
const TEXTAREA_MAX_HEIGHT_PX = 200;

type MessageInputProps = {
  onSend: (message: string) => void;
  onSendImage?: (image: File) => Promise<void>;
  isSendingImage?: boolean;
  onTypingStart?: () => void;
  onTypingStop?: () => void;
};
export default function MessageInput({
  onSend,
  onSendImage,
  isSendingImage = false,
  onTypingStart,
  onTypingStop,
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [pendingImage, setPendingImage] = useState<File | null>(null);
  const [pendingImagePreviewUrl, setPendingImagePreviewUrl] = useState<
    string | null
  >(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const isTypingRef = useRef(false);

  const adjustHeight = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const scrollHeight = el.scrollHeight;
    if (scrollHeight >= TEXTAREA_MAX_HEIGHT_PX) {
      el.style.height = `${TEXTAREA_MAX_HEIGHT_PX}px`;
      el.style.overflowY = "auto";
    } else {
      el.style.height = `${scrollHeight}px`;
      el.style.overflowY = "hidden";
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [message]);

  const startTyping = useCallback(() => {
    if (isTypingRef.current) return;
    isTypingRef.current = true;
    onTypingStart?.();
  }, [onTypingStart]);

  const stopTyping = useCallback(() => {
    if (!isTypingRef.current) return;
    isTypingRef.current = false;
    onTypingStop?.();
  }, [onTypingStop]);

  useEffect(() => {
    return () => {
      stopTyping();
    };
  }, [stopTyping]);

  const clearPendingImage = useCallback(() => {
    setPendingImage(null);
    setPendingImagePreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  }, []);

  useEffect(() => {
    return () => {
      if (pendingImagePreviewUrl) {
        URL.revokeObjectURL(pendingImagePreviewUrl);
      }
    };
  }, [pendingImagePreviewUrl]);

  const submitMessage = async () => {
    const trimmedMessage = message.trim();
    const hasImage = !!pendingImage;
    const hasText = trimmedMessage.length > 0;

    if (!hasText && !hasImage) return;

    if (hasText) {
      onSend(trimmedMessage);
      setMessage("");
      stopTyping();
    }

    if (hasImage && onSendImage && pendingImage) {
      try {
        await onSendImage(pendingImage);
        clearPendingImage();
      } catch (error) {
        console.error("Failed to send image:", error);
      }
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void submitMessage();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void submitMessage();
    }
  };

  const openImagePicker = () => {
    if (isSendingImage) return;
    imageInputRef.current?.click();
  };

  const handleImageSelected = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onSendImage) return;

    const nextPreviewUrl = URL.createObjectURL(file);
    setPendingImage(file);
    setPendingImagePreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return nextPreviewUrl;
    });
    e.target.value = "";
  };

  const canSubmit = message.trim().length > 0 || !!pendingImage;

  return (
    <div className="flex min-h-[100px] flex-col justify-center border-t border-gray-200 px-10 py-6">
      {pendingImagePreviewUrl ? (
        <div className="mb-3 flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={pendingImagePreviewUrl}
            alt="Selected image preview"
            className="h-16 w-16 rounded-lg object-cover"
          />
          <button
            type="button"
            onClick={clearPendingImage}
            className="rounded-md bg-gray-100 px-3 py-1.5 text-sm text-gray-700 transition hover:bg-gray-200"
          >
            Remove image
          </button>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="flex w-full items-end gap-3">
        <input
          ref={imageInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          className="hidden"
          onChange={handleImageSelected}
        />
        <button
          type="button"
          onClick={openImagePicker}
          disabled={isSendingImage}
          className="flex h-13 w-13 shrink-0 items-center justify-center rounded-full text-gray-400 bg-gray-100 transition hover:cursor-pointer hover:text-gray-600"
        >
          <ImageIcon />
        </button>

        <textarea
          ref={textareaRef}
          placeholder="Message here..."
          rows={1}
          className="min-h-10 flex-1 resize-none overflow-y-hidden  style-body-2 px-4 py-2.5 outline-none placeholder:text-gray-400 focus:border-orange-400 max-h-50"
          value={message}
          onChange={(e) => {
            const nextValue = e.target.value;
            setMessage(nextValue);
            if (nextValue.trim().length > 0) {
              startTyping();
            } else {
              stopTyping();
            }
          }}
          onKeyDown={handleKeyDown}
          onBlur={stopTyping}
        />

        <button
          type="submit"
          disabled={!canSubmit || isSendingImage}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <MessageIcon />
        </button>
      </form>
    </div>
  );
}