"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Image as ImageIcon, Heart, Gift, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Memories", path: "/memories", icon: ImageIcon },
    { name: "Letter", path: "/letter", icon: Heart },
    { name: "Surprise", path: "/surprise", icon: Gift },
    { name: "Blog", path: "/blog", icon: BookOpen },
];

const Navbar = () => {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-[60] w-auto max-w-[calc(100vw-1.5rem)] px-1">
            <motion.div
                className="bg-white/85 backdrop-blur-2xl rounded-full shadow-2xl border border-white/70 px-3.5 xs:px-5 sm:px-6 py-2 sm:py-2.5 flex gap-2 xs:gap-4 sm:gap-7 md:gap-8 items-center bg-gradient-to-b from-white/95 to-white/75 hover:shadow-pink-200/50 transition-shadow duration-300"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 120, damping: 20 }}
            >
                {navItems.map((item) => {
                    const isActive = item.path === "/" ? pathname === "/" : pathname.startsWith(item.path);
                    return (
                        <Link key={item.name} href={item.path} className="relative group px-1 sm:px-1.5 py-0.5">
                            <div
                                className={`flex flex-col items-center gap-0.5 sm:gap-1 transition-all duration-300 group-hover:scale-105 active:scale-95 ${
                                    isActive ? "text-mypink" : "text-stone-400 hover:text-stone-600"
                                }`}
                            >
                                <item.icon className="w-5 h-5 sm:w-6 sm:h-6 drop-shadow-sm" />
                                <span className="text-[9px] xs:text-[10px] sm:text-[11px] font-sans font-medium tracking-tight sm:tracking-wide">
                                    {item.name}
                                </span>

                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute -bottom-1.5 sm:-bottom-2 w-1.5 h-1.5 bg-mypink rounded-full shadow-[0_0_8px_2px_rgba(255,183,178,0.9)]"
                                    />
                                )}
                            </div>
                        </Link>
                    );
                })}
            </motion.div>
        </nav>
    );
};

export default Navbar;
