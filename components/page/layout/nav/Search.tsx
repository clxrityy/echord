"use client";
import { ChangeEvent, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ICONS } from "@/lib/config";


export function Search() {
    const [searchField, setSearchField] = useState<string>("");
    const [clicked, setClicked] = useState<boolean>(false);

    const router = useRouter();

    useEffect(() => {
        if (searchField.length > 2) {
            const timeoutId = setTimeout(() => {
                router.push(`/search/${searchField}`);
            }, 500);

            return () => {
                clearTimeout(timeoutId);
            };
        }
    }, [searchField, router]);
    
    const handleChange = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
        setSearchField(e.target.value);
    }, []);

    const handleClick = useCallback(() => {
        setClicked(!clicked);
    }, [clicked]);

    return (
        <search className="flex flex-col items-center relative gap-5">
            <button role="button" onClick={handleClick} className={`${clicked ? "ring-2 ring-[var(--color-grey-blue-leaf)]" : ""} p-2 transition duration-200 focus:outline-none rounded-md`}>
                <ICONS.search />
            </button>
            {
                clicked && (
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchField}
                        onChange={handleChange}
                        className="w-64 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-grey-blue-leaf)] transition duration-200 absolute top-15 right-0 z-10 shadow-md"
                    />
                )
            }
        </search>
    )
}