"use client"

import { useState } from "react";
import { FaUser, FaCar, FaHistory, FaCog, FaSignOutAlt, FaEdit, FaCreditCard, FaBell, FaShieldAlt, FaQuestionCircle } from "react-icons/fa";
import Image from "next/image";
import { motion } from "framer-motion";
import Nav from "../components/Nav";

export default function MyAccountPage() {
    const [user] = useState({
        name: "홍길동",
        email: "hong@example.com",
        phone: "010-1234-5678",
        profileImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1000&auto=format&fit=crop",
        chargingHistory: 12,
        favoriteStations: 5,
        registeredStations: 2,
        carInfo: {
            model: "테슬라 모델 3",
            year: "2023",
            batteryCapacity: "82kWh"
        },
        membership: {
            level: "골드",
            points: 2500,
            joinDate: "2023-01-15"
        }
    });

    const menuItems = [
        { icon: FaCar, label: "내 충전소", count: user.registeredStations },
        { icon: FaHistory, label: "충전 기록", count: user.chargingHistory },
        { icon: FaCog, label: "설정", count: null },
        { icon: FaSignOutAlt, label: "로그아웃", count: null }
    ];

    const settingsItems = [
        { icon: FaUser, label: "프로필 수정", description: "이름, 이메일, 전화번호 수정" },
        { icon: FaCar, label: "차량 정보 관리", description: "등록된 차량 정보 수정" },
        { icon: FaCreditCard, label: "결제 수단 관리", description: "카드 등록 및 관리" },
        { icon: FaBell, label: "알림 설정", description: "푸시 알림 및 이메일 알림 설정" },
        { icon: FaShieldAlt, label: "보안 설정", description: "비밀번호 변경 및 2단계 인증" },
        { icon: FaQuestionCircle, label: "고객센터", description: "문의하기 및 FAQ" }
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* 프로필 섹션 */}
            <div className="bg-gradient-to-b from-black via-gray-900 to-black p-6">
                <div className="max-w-3xl mx-auto">
                    <div className="flex items-center gap-4">
                        <div className="relative w-20 h-20">
                            <Image
                                src={user.profileImage}
                                alt="프로필"
                                fill
                                className="rounded-full object-cover border-2 border-white"
                            />
                            <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors">
                                <FaEdit className="text-blue-500" size={16} />
                            </button>
                        </div>
                        <div className="text-white">
                            <h1 className="text-2xl font-bold">{user.name}</h1>
                            <p className="text-blue-100">{user.email}</p>
                            <div className="mt-2 flex items-center gap-2">
                                <span className="px-2 py-1 bg-white/20 rounded-full text-sm">
                                    {user.membership.level} 멤버십
                                </span>
                                <span className="text-sm">{user.membership.points} 포인트</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 통계 섹션 */}
            <div className="max-w-3xl mx-auto px-4 -mt-6">
                <div className="grid grid-cols-3 gap-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl p-4 shadow-sm"
                    >
                        <div className="text-center">
                            <p className="text-gray-500 text-sm">등록한 충전소</p>
                            <p className="text-2xl font-bold text-blue-500">{user.registeredStations}</p>
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-xl p-4 shadow-sm"
                    >
                        <div className="text-center">
                            <p className="text-gray-500 text-sm">충전 기록</p>
                            <p className="text-2xl font-bold text-green-500">{user.chargingHistory}</p>
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-xl p-4 shadow-sm"
                    >
                        <div className="text-center">
                            <p className="text-gray-500 text-sm">즐겨찾기</p>
                            <p className="text-2xl font-bold text-red-500">{user.favoriteStations}</p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* 차량 정보 섹션 */}
            <div className="max-w-3xl mx-auto px-4 mt-6">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-800">차량 정보</h2>
                    </div>
                    <div className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">차량 모델</p>
                                <p className="text-gray-800 font-medium">{user.carInfo.model}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">연식</p>
                                <p className="text-gray-800 font-medium">{user.carInfo.year}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">배터리 용량</p>
                                <p className="text-gray-800 font-medium">{user.carInfo.batteryCapacity}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 설정 메뉴 섹션 */}
            <div className="max-w-3xl mx-auto px-4 mt-6">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-800">설정</h2>
                    </div>
                    {settingsItems.map((item, index) => (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-gray-100">
                                        <item.icon className="text-gray-600" size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-medium text-gray-700">{item.label}</p>
                                        <p className="text-sm text-gray-500">{item.description}</p>
                                    </div>
                                </div>
                                <span className="text-gray-400">›</span>
                            </button>
                            {index < settingsItems.length - 1 && (
                                <div className="h-px bg-gray-100" />
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* 메뉴 섹션 */}
            <div className="max-w-3xl mx-auto px-4 mt-6">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    {menuItems.map((item, index) => (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-gray-100">
                                        <item.icon className="text-gray-600" size={20} />
                                    </div>
                                    <span className="font-medium text-gray-700">{item.label}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {item.count !== null && (
                                        <span className="text-sm text-gray-500">{item.count}</span>
                                    )}
                                    <span className="text-gray-400">›</span>
                                </div>
                            </button>
                            {index < menuItems.length - 1 && (
                                <div className="h-px bg-gray-100" />
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>

            <Nav />
        </div>
    );
}