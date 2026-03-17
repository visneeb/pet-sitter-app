import { BotMessageSquare } from "lucide-react";
import { ActionButton } from "../ui/Button";

interface Props {
  handleOpen: () => void;
}

function ChatbotButton(props: Props) {
  return (
    <ActionButton
      variant="icon"
      onClick={props.handleOpen}
      className="shadow-[0_0_16px_-2px_rgba(0,0,0,0.3)] w-fit"
    >
      {<BotMessageSquare />}
    </ActionButton>
  );
}

export default ChatbotButton;
