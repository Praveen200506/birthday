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
        <nav className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
            <motion.div
                className="bg-white/80 backdrop-blur-2xl rounded-full shadow-2xl border border-white/60 px-5 sm:px-6 py-2.5 sm:py-3 flex gap-4 sm:gap-8 items-center bg-gradient-to-b from-white/90 to-white/70 hover:shadow-pink-200/50 transition-shadow duration-300"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1, type: "spring", stiffness: 100, damping: 20 }}
            >
                {navItems.map((item) => {
                    const isActive = item.path === "/" ? pathname === "/" : pathname.startsWith(item.path);
                    return (
                        <Link key={item.name} href={item.path} className="relative group">
                            <div
                                className={`flex flex-col items-center gap-1 transition-all duration-300 group-hover:scale-110 ${isActive ? "text-mypink" : "text-gray-400 hover:text-gray-600"
                                    }`}
                            >
                                <item.icon className="w-6 h-6 drop-shadow-sm" />
                                <span className="text-[10px] font-sans font-medium tracking-wide">{item.name}</span>

                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute -bottom-2 w-1 h-1 bg-mypink rounded-full shadow-[0_0_8px_2px_rgba(255,183,178,0.8)]"
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
