import { ImageComponent } from "@/components/ui/Image";
import Link from "next/link";
import { Search } from "./Search";


export function Navbar() {
    return (
        <nav className="flex items-center justify-between navbar w-screen z-50">
            {/**
             * RIGHT
             * - Logo & Title
             */}
            <div className="flex items-center px-4 py-2">
                <Link href="/" className="flex items-center space-x-2 hover:underline underline-offset-2 focus:contrast-200 transition-all duration-100 focus:underline-offset-4">
                    <h1 className="">
                        <span className="px-[0.125rem] italic">
                            E
                        </span>
                        <span>
                            chord
                        </span>
                    </h1>
                    <ImageComponent src={"/apple-touch-icon.png"} alt="Echord" width={40} height={40} className="rounded-full grayscale-75 brightness-150" />
                </Link>
            </div>
            {
                /**
                 * LEFT
                 * - Search
                 */
            }
            <div className="flex items-center justify-end px-4 py-2">
                <Search />
            </div>
        </nav>
    )
}