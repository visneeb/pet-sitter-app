import { ChatbotResponse } from "@/types/chatbot";
import { chatbotApi } from "@/services/api/chatbot";
import { useEffect, useRef, useState } from "react";
import { showCustomToast } from "@/components/ui/toast/Toast";
import { usePathname, useRouter } from "next/navigation";

function useChatbot() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [userMessages, setUserMessages] = useState<string[]>([]);
  const [botMessages, setBotMessages] = useState<ChatbotResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showIntro, setShowIntro] = useState<boolean>(false);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);
  const lastScrollTopRef = useRef<number | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!chatScrollRef.current) return;

    chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
  }, [userMessages, botMessages]);

  useEffect(() => {
    if (!isOpen) return;
    if (!chatScrollRef.current) return;
    if (lastScrollTopRef.current == null) return;

    chatScrollRef.current.scrollTop = lastScrollTopRef.current;
  }, [isOpen]);

  const handleOpen = () => {
    if (isOpen && chatScrollRef.current) {
      lastScrollTopRef.current = chatScrollRef.current.scrollTop;
    }

    setShowIntro(false);
    setIsOpen((prev) => !prev);
  };

  const handleOnChange = (value: string) => {
    setInputValue(value);
  };

  const handleSubmit = async (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    setInputValue("");
    setUserMessages((prev) => [...prev, trimmed]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await chatbotApi.ask({ query: trimmed, topK: 5 });

      setBotMessages((prev) => [...prev, response]);
    } catch (err: unknown) {
      setError("Failed to contact chatbot");
      setUserMessages((prev) => prev.slice(0, -1));
      setInputValue(query);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigate = (sitterId: string) => {
    if (chatScrollRef.current) {
      lastScrollTopRef.current = chatScrollRef.current.scrollTop;
    }
    setIsOpen(false);
    router.push(`/petsitter/${sitterId}`);
  };

  useEffect(() => {
    setShowIntro(false);
  }, [pathname]);

  useEffect(() => {
    if (pathname !== "/") return;
    if (typeof window === "undefined") return;

    setShowIntro(true);

    const timeoutId = window.setTimeout(() => {
      setShowIntro(false);
    }, 5000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (!error) return;

    showCustomToast({
      variant: "error",
      title: "Error!",
      description: error,
      position: "top-center",
    });
  }, [error]);

  return {
    isOpen,
    inputValue,
    handleOpen,
    handleOnChange,
    handleSubmit,
    handleNavigate,
    userMessages,
    botMessages,
    isLoading,
    error,
    chatScrollRef,
    showIntro,
    setShowIntro,
  };
}

export default useChatbot;
