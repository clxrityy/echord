"use client";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {

  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleClick = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        router.push("/login");
      }

      if (res.status === 500) {
        console.error("Error logging out");
      }
    } catch (e) {
      console.error("Error logging out", e);
      setError("An error occurred while logging out. Please try again.");
    }
  }


  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full">
      <Button onClick={async () => await handleClick()} aria-label="Logout" className="px-4 py-2 text-lg font-semibold text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">
        Logout
      </Button>
      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
