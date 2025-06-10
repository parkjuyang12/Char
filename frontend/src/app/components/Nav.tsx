"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { FaMapMarkerAlt, FaHeart, FaUser } from "react-icons/fa";

export default function Nav() {
    const pathname = usePathname();

    const navItems = [
        { href: "/dashboard", icon: FaMapMarkerAlt, text: "주변", color: "text-blue-500" },
        { href: "/favorites", icon: FaHeart, text: "즐겨찾기", color: "text-red-500" },
        { href: "/myaccount", icon: FaUser, text: "마이", color: "text-purple-500" },
    ];

    return (
        <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-lg">
            <div className="grid grid-cols-3 h-16">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center gap-1 hover:bg-gray-50 transition-colors ${
                                isActive ? 'bg-gray-50' : ''
                            }`}
                        >
                            <div className={`p-2 rounded-full ${isActive ? 'bg-gray-100' : ''}`}>
                                <Icon size={20} className={isActive ? item.color : 'text-gray-400'} />
                            </div>
                            <span className={`text-xs font-medium ${isActive ? item.color : 'text-gray-400'}`}>
                                {item.text}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </footer>
    );
}