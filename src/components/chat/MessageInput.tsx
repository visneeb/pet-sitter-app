import { ImageIcon } from "@/assets/icons/components";
import { MessageIcon } from "@/assets/icons/components";
export default function MessageInput() {
    return (
      <div className="flex items-center justify-center border-t border-gray-200 h-[100px] px-10 py-6">
        <form className="flex items-center w-full gap-3">
          <button
            type="button"
            className="flex h-13 w-13 items-center justify-center rounded-full text-gray-400 bg-gray-100 transition hover:cursor-pointer hover:text-gray-600"
          >
            <ImageIcon />
          </button>
  
          <input
            type="text"
            placeholder="Message here..."
            className="h-10 flex-1 rounded-full style-body-2  px-4 outline-none placeholder:text-gray-400 focus:border-orange-400"
          />
  
          <button
            type="submit"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-white transition hover:bg-orange-600"
          >
            <MessageIcon />
          </button>
        </form>
      </div>
    );
  }