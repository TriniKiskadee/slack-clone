import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function getOrdinalSuffix(day: number) {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
}

export function formatDateWithOrdinal(date: Date) {
    const day = date.getDate();
    const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(date);
    const year = date.getFullYear();
    const time = new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true
    }).format(date);

    return `${month} ${day}${getOrdinalSuffix(day)}, ${year} - ${time}`;
}