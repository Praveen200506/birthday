"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Image as ImageIcon, Heart, Gift, BookOpen } from "lucide-react";

const navItems = [
  { name: "Home", path: "/", icon: Home },
  { name: "Memories", path: "/memories", icon: ImageIcon },
  { name: "Letter", path: "/letter", icon: Heart },
  { name: "Surprise", path: "/surprise", icon: Gift },
  { name: "Blog", path: "/blog", icon: BookOpen },
];

export default function Navbar() {
  const pathname = usePathname();
  return (
    <nav aria-label="Main navigation" className="fixed bottom-3 left-1/2 z-[60] w-max max-w-[calc(100vw-1.25rem)] -translate-x-1/2">
      <div className="flex items-center gap-1 rounded-full border-2 border-[#DDA9A9] bg-[#FFF9F4]/95 px-2 py-2 shadow-[0_10px_34px_rgba(102,43,61,0.20)] backdrop-blur-xl sm:gap-3 sm:px-4">
        {navItems.map((item) => {
          const active = item.path === "/" ? pathname === "/" : pathname.startsWith(item.path);
          return (
            <Link key={item.path} href={item.path} aria-current={active ? "page" : undefined}
              className={"flex min-w-0 flex-col items-center gap-1 rounded-full px-2 py-1.5 text-[10px] font-bold transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8B294B] sm:min-w-[58px] sm:px-3 sm:text-xs " + (active ? "bg-[#8B294B] text-white shadow-md" : "text-[#59313F] hover:bg-[#F9E2E3] hover:text-[#762D49]")}>
              <item.icon aria-hidden="true" className="h-4 w-4 sm:h-[18px] sm:w-[18px]" strokeWidth={1.9} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
