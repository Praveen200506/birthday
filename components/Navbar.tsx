"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Gift, Heart, Home, Images } from "lucide-react";
import { birthdayConfig } from "@/data/birthdayConfig";

const icons = { home: Home, images: Images, heart: Heart, gift: Gift, "book-open": BookOpen } as const;

export default function Navbar() {
  const pathname = usePathname();
  return (
    <nav aria-label="Main navigation" className="fixed inset-x-0 bottom-3 z-[60] flex justify-center px-2">
      <div className="grid w-full max-w-[560px] grid-cols-5 items-stretch gap-1 rounded-[1.5rem] border border-[#DDA9A9] bg-[#FFF9F4]/95 p-1.5 shadow-[0_10px_34px_rgba(102,43,61,0.22)] backdrop-blur-xl sm:gap-2 sm:p-2">
        {birthdayConfig.navigation.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = icons[item.icon as keyof typeof icons];
          return <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined}
            className={"relative flex min-h-[58px] w-full flex-col items-center justify-center gap-1.5 rounded-[1.1rem] px-1 py-2 text-center text-[10px] font-bold leading-none transition-all duration-200 sm:min-h-[64px] sm:text-xs focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8B294B] " + (active ? "bg-[#8B294B] text-white shadow-md" : "text-[#59313F] hover:bg-[#F9E2E3] hover:text-[#762D49]")}>
              <Icon aria-hidden="true" className="h-[18px] w-[18px] shrink-0" strokeWidth={1.9}/>
              <span className="block w-full text-center">{item.label}</span>
            </Link>;
        })}
      </div>
    </nav>
  );
}
