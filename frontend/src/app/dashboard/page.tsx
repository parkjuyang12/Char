'use client';

import { useEffect, useState } from "react";
import Map from "../components/Map";
import Nav from "../components/Nav";
import Modal from "../components/Modal"; // Modal 컴포넌트 임포트
import axios from "axios"; // axios 사용
import Image from "next/image"; // next/image 사용

export default function Dashboard() {
    const [token, setToken] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        setToken(storedToken);
        console.log("JWT Token:", storedToken);

        if (storedToken) {
            fetch(`/api/`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${storedToken}`,
                    "Content-Type": "application/json",
                },
            })
                .then(res => res.json())
                .then(data => {
                    console.log("GET / 응답:", data);
                })
                .catch(err => {
                    console.error("GET 요청 실패:", err);
                });
        }
    }, []);

    // 모달 열기
    const openModal = () => setIsModalOpen(true);
    // 모달 닫기
    const closeModal = () => setIsModalOpen(false);

    // --- 모달에서 장소 등록 처리 함수 수정 (rating 제거) ---
    const handlePlaceSubmit = async (
        placeTitle: string,
        longitude: number,
        latitude: number,
        placeDescription: string,
        // rating: number, // <--- 여기서 rating 매개변수 제거!
        imageFile: File,
        per_price: number,
        char_type: string,
        play_time: string,
        max_car: number
    ) => {
        if (!token) {
            alert("인증된 사용자만 장소를 등록할 수 있습니다.");
            return;
        }

        const formData = new FormData();
        formData.append("placeTitle", placeTitle);
        formData.append("placeDescription", placeDescription);
        formData.append("lat", latitude.toString());
        formData.append("lng", longitude.toString());
        // formData.append("rating", rating.toString()); // <--- formData에서 rating 추가 코드 제거!
        formData.append("placeImageURL", imageFile);

        formData.append("per_price", per_price.toString());
        formData.append("char_type", char_type);
        formData.append("play_time", play_time);
        formData.append("max_car", max_car.toString());

        try {
            const response = await axios.post(`/api/api/place/add`, formData, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                alert("장소가 성공적으로 등록되었습니다.");
                closeModal();
            } else {
                const errorData = response.data;
                alert(`장소 등록 실패: ${errorData.message || errorData.error || response.statusText}`);
            }
        } catch (error) {
            console.error("장소 등록 실패:", error);
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    console.error("서버 응답 오류:", error.response.data);
                    alert(`장소 등록 실패: ${error.response.data.message || error.response.data.error || '알 수 없는 서버 오류'}`);
                } else if (error.request) {
                    console.error("응답 없음:", error.request);
                    alert("장소 등록에 실패했습니다: 서버 응답이 없습니다.");
                } else {
                    console.error("요청 설정 오류:", error.message);
                    alert(`장소 등록 실패: ${error.message}`);
                }
            } else {
                alert("장소 등록 중 알 수 없는 오류가 발생했습니다.");
            }
        }
    };

    return (
        <div className="relative min-h-screen font-[family-name:var(--font-geist-sans)]">
            <div className="absolute inset-0">
                {/* 검색창 */}
                <div className="absolute top-12 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3 items-center">
                    {/* 검색창 박스 */}
                    <div className="flex items-center bg-white px-3 h-12 rounded-xl shadow-md w-72">
                        {/* 돋보기 아이콘 */}
                        <div className="relative w-5 h-5 mr-2">
                            <Image
                                src="/map/search.svg"
                                alt="검색"
                                width={20}
                                height={20}
                            />
                        </div>
                        {/* 입력창 */}
                        <input
                            type="text"
                            placeholder=""
                            className="w-full p-1 border-none focus:outline-none"
                        />
                    </div>

                    {/* 별도 버튼 (모달 열기 버튼) */}
                    <button
                        onClick={openModal}
                        className="w-12 h-12 bg-[#1C4966] text-white rounded-xl hover:bg-blue-600 focus:outline-none flex justify-center items-center shadow-md"
                    >
                        <div className="relative w-5 h-5">
                            <Image
                                src="/map/addplace.svg"
                                alt="장소 추가"
                                width={20}
                                height={20}
                            />
                        </div>
                    </button>
                </div>

                {/* 지도 컴포넌트 */}
                <Map />

            </div>

            {/* 네비게이션 바 */}
            <div className="fixed bottom-0 left-0 right-0 z-10">
                <Nav />
            </div>

            {/* 모달 컴포넌트 */}
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSubmit={handlePlaceSubmit} // 업데이트된 handlePlaceSubmit 함수 전달
            />
        </div>
    );
}