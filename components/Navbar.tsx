"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Image as ImageIcon, Heart, Gift } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Memories", path: "/memories", icon: ImageIcon },
    { name: "Letter", path: "/letter", icon: Heart },
    { name: "Surprise", path: "/surprise", icon: Gift },
];

const Navbar = () => {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
            <motion.div
                className="bg-white/90 backdrop-blur-lg rounded-full shadow-2xl border border-white/50 px-6 py-3 flex gap-8 items-center"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
            >
                {navItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <Link key={item.name} href={item.path} className="relative group">
                            <div
                                className={`flex flex-col items-center gap-1 transition-colors duration-300 ${isActive ? "text-mypink" : "text-gray-400 hover:text-gray-600"
                                    }`}
                            >
                                <item.icon className="w-6 h-6" />
                                <span className="text-[10px] font-sans font-medium">{item.name}</span>

                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute -bottom-2 w-1 h-1 bg-mypink rounded-full"
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
