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
    <nav
      aria-label="Main navigation"
      className="fixed bottom-3 left-1/2 z-[60] w-max max-w-[calc(100vw-1.25rem)] -translate-x-1/2"
    >
      <div className="flex items-center gap-2 rounded-full border border-ink/15 bg-mist px-3 py-2 shadow-[0_8px_30px_rgba(41,53,50,0.12)] sm:gap-5 sm:px-5">
        {navItems.map((item) => {
          const active = item.path === "/" ? pathname === "/" : pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              href={item.path}
              aria-current={active ? "page" : undefined}
              className={`flex min-w-0 flex-col items-center gap-1 rounded-md px-1 py-1 text-[10px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-berry sm:text-xs ${active ? "text-berry" : "text-ink/65 hover:text-ink"}`}
            >
              <item.icon aria-hidden="true" className="h-4 w-4 sm:h-[18px] sm:w-[18px]" strokeWidth={1.7} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
