"use client"

import { useState } from "react";
import { FaStar, FaMapMarkerAlt, FaClock, FaPlug, FaMoneyBillWave } from "react-icons/fa";
import Image from "next/image";
import { motion } from "framer-motion";
import Nav from "../components/Nav";
import { useRouter } from "next/navigation";

interface FavoritePlace {
    id: number;
    name: string;
    description: string;
    rating: number;
    imageUrl: string;
    location: string;
    price: string;
    chargingType: string;
    availableHours: string;
}

export default function FavoritesPage() {
    const router = useRouter();
    const [favorites] = useState<FavoritePlace[]>([
        {
            id: 1,
            name: "서울역 전기차 충전소",
            description: "서울역 내부에 위치한 편리한 충전소입니다. 24시간 운영되며, 주차장이 넓습니다.",
            rating: 4.5,
            imageUrl: "/charplace/yong.png",
            location: "서울시 용산구 한강대로 405",
            price: "5,000원/시간",
            chargingType: "DC 급속 (50kW)",
            availableHours: "24시간"
        },
        {
            id: 2,
            name: "강남 전기차 충전소",
            description: "강남 중심가에 위치한 고급 충전소입니다. 카페와 편의점이 바로 옆에 있습니다.",
            rating: 4.8,
            imageUrl: "/charplace/gang.png",
            location: "서울시 강남구 테헤란로 123",
            price: "6,000원/시간",
            chargingType: "DC 초급속 (150kW)",
            availableHours: "09:00-22:00"
        },
        {
            id: 3,
            name: "홍대 전기차 충전소",
            description: "홍대입구역 근처의 분위기 좋은 충전소입니다. 주변에 맛집이 많습니다.",
            rating: 4.2,
            imageUrl: "/charplace/hong.png",
            location: "서울시 마포구 홍대입구로 123",
            price: "4,500원/시간",
            chargingType: "AC 3상 (22kW)",
            availableHours: "24시간"
        },
    ]);

    const handleDetailClick = (id: number) => {
        router.push(`/station/${id}`);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8 pb-24">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <FaStar className="text-yellow-400" />
                        즐겨찾는 충전소
                    </h1>
                    <p className="mt-2 text-gray-600">자주 이용하는 충전소를 한눈에 확인하세요</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites.map((place) => (
                        <motion.div
                            key={place.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                        >
                            <div className="relative h-48">
                                <Image
                                    src={place.imageUrl}
                                    alt={place.name}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                                    <FaStar className="text-yellow-400" />
                                    <span className="font-medium">{place.rating}</span>
                                </div>
                            </div>

                            <div className="p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-2">{place.name}</h2>
                                <p className="text-gray-600 mb-4 line-clamp-2">{place.description}</p>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <FaMapMarkerAlt className="text-blue-500" />
                                        <span className="text-sm">{place.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <FaPlug className="text-green-500" />
                                        <span className="text-sm">{place.chargingType}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <FaClock className="text-purple-500" />
                                        <span className="text-sm">{place.availableHours}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <FaMoneyBillWave className="text-yellow-500" />
                                        <span className="text-sm">{place.price}</span>
                                    </div>
                                </div>

                                <div className="mt-6 flex gap-3">
                                    <button
                                        onClick={() => handleDetailClick(place.id)}
                                        className="flex-1 px-4 py-2 bg-gradient-to-b from-black via-gray-900 to-black text-white rounded-xl hover:opacity-90 transition-all duration-200"
                                    >
                                        상세보기
                                    </button>
                                    <button className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                                        <FaStar className="text-yellow-400" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Navigation */}
            <div className="fixed bottom-0 left-0 right-0">
                <Nav />
            </div>
        </div>
    );
}