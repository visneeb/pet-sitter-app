type Props = {
    text: string;
    isMe: boolean;
  };
  
  export default function MessageBubble({ text, isMe }: Props) {
    return (
      <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
        <div
          className={`max-w-[60%] rounded-2xl  px-4 py-2 style-body-2 ${
            isMe
              ? "bg-orange-500 text-white rounded-br-none"
              : "bg-gray-100 text-gray-800 rounded-bl-none"
          }`}
        >
          {text}
        </div>
      </div>
    );
  }