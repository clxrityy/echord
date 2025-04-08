import { StringOrUndefined } from "@/types";
import { ImageComponent } from "../ui/Image";
import "@/styles/css/hero.css";

export function Hero({
  userId,
}: {
  userId: StringOrUndefined;
}) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-10 py-10 px-10">
      {
        !userId ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <div>
              <h1 className="text-4xl font-bold text-center">Welcome to 乇chord</h1>
              <p className="text-lg text-center mb-8">
                Join and start cataloging your music collection
              </p>
            </div>
            <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200">
              Get Started
            </button>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-1 items-center justify-center mb-4 gap-4 w-full">
              <div className="flex flex-col items-center justify-center">
                <h1 className="text-4xl font-bold text-center mb-4">Welcome Back!</h1>
                <p className="text-lg text-center mb-8">
                  Explore your personalized feed and discover new content.
                </p>
              </div>
              <div className="w-full flex items-center justify-center xl:items-start xl:w-fit 2xl:w-full 2xl:items-start">
              <Disk />
              </div>
            </div>
          </div>
        )
      }
    </div>
  );
}

export function Disk() {
  return (
    <ImageComponent src="/img/disk.png" alt="Disk" className="w-50 h-50 rounded-full disk" width={75} height={75} />
  )
}
