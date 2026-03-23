import { ImageIcon } from "@/assets/icons/components";
import { MessageIcon } from "@/assets/icons/components";
import { useState, FormEvent, KeyboardEvent, useRef, useEffect } from "react";

/** ความสูงสูงสุดของ textarea (px) — แก้ค่าตรงนี้เมื่อต้องการจำกัดความสูง */
const TEXTAREA_MAX_HEIGHT_PX = 200;

type MessageInputProps = {
  onSend: (message: string) => void;
  onTypingStart?: () => void;
  onTypingStop?: () => void;
};
export default function MessageInput({
  onSend,
  onTypingStart,
  onTypingStop,
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
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

  const startTyping = () => {
    if (isTypingRef.current) return;
    isTypingRef.current = true;
    onTypingStart?.();
  };

  const stopTyping = () => {
    if (!isTypingRef.current) return;
    isTypingRef.current = false;
    onTypingStop?.();
  };

  useEffect(() => {
    return () => {
      stopTyping();
    };
  }, []);

  const submitMessage = () => {
    onSend(message);
    setMessage("");
    stopTyping();
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submitMessage();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitMessage();
    }
  };

  return (
    <div className="flex min-h-[100px] items-end justify-center border-t border-gray-200 px-10 py-6">
      <form onSubmit={handleSubmit} className="flex w-full items-end gap-3">
        <button
          type="button"
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
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white transition hover:bg-orange-600"
        >
          <MessageIcon />
        </button>
      </form>
    </div>
  );
}