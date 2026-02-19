import logo from "@/assets/logo.svg";
import Image from "next/image";
import { useScreenContext } from "@/contexts/ScreenContext";
import cn from "@/utils/cn";
export default function Footer() {
    const { isMedium } = useScreenContext();
    return (
        <footer className="bg-black w-full flex flex-col items-center justify-center pt-20 pb-20 gap-6">
            <Image src={logo} alt="logo" width={200} height={60} />
            <p className={cn("text-white", isMedium ? "style-headline-3" : "style-body-1")}>
                Find your perfect pet sitter with us.
            </p>
        </footer>
    );
}
