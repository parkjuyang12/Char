// InfoBox.tsx
'use client'

import React from 'react';
import Image from 'next/image'
// <<-- useRouter 훅은 InfoBox 내부에서 사용하지 않으므로 임포트하지 않습니다.
// import { useRouter } from "next/navigation";

// 필요한 아이콘들 (새 정보 표시용)
import { FaPlug, FaMoneyBillWave, FaClock, FaCar } from "react-icons/fa";

// --- Poi 인터페이스 확장 (기존 필드 유지 + 새로운 필드 추가) ---
// 백엔드 PlaceDTO에 맞게 필드들을 추가합니다.
export interface Poi {
    title: string;          // 예: '강남역 충전소' (PlaceDTO의 placeTitle과 다를 수 있다면 사용)
    description?: string;   // 예: '넓고 쾌적해요' (PlaceDTO의 placeDescription과 다를 수 있다면 사용)
    imageUrl?: string;      // 예: '/local/image.jpg' (PlaceDTO의 placeImageURL과 다를 수 있다면 사용)
    placeId: number;        // 해당 장소의 고유 ID
    placeTitle: string;       // 백엔드 DTO의 'placeTitle'
    placeDescription: string; // 백엔드 DTO의 'placeDescription'
    placeImageURL?: string;   // 백엔드 DTO의 'placeImageURL'
    latitude: number;         // 위도
    longitude: number;        // 경도
    per_price: number;        // 시간당 요금 (Integer)
    char_type: string;        // 충전기 종류 (String)
    play_time: string;        // 운영 시간 (String)
    max_car: number;          // 최대 수용 차량 수 (백엔드 DTO의 'max_car' 필드)
    userId?: number;          // 사용자 ID (Optional)
}
// --- Poi 인터페이스 확장 끝 ---

const InfoBox = ({ poi, onMoreClick }: { poi: Poi, onMoreClick: () => void }) => {
    // <<-- useRouter 훅을 여기에 선언하지 않습니다.

    // UI에 표시할 필드값 결정 (기존 필드 우선 또는 새 필드 우선 로직)
    // 여기서는 DTO에서 넘어오는 새 필드들을 우선적으로 사용하고, 없으면 기존 필드를 fallback으로 사용합니다.
    const displayTitle = poi.placeTitle || poi.title;
    const displayDescription = poi.placeDescription || poi.description ;
    const displayImageUrl = '/charplace/gang.png';

    // 숫자 타입 필드에 대한 기본값 처리 (undefined, null, 0 등)
    const displayPerPrice = (poi.per_price !== undefined && poi.per_price !== null && poi.per_price > 0) ? `${poi.per_price}원` : '정보 없음';
    const displayMaxCar = (poi.max_car !== undefined && poi.max_car !== null && poi.max_car > 0) ? `${poi.max_car}대` : '정보 없음';

    // 문자열 타입 필드에 대한 기본값 처리
    const displayCharType = poi.char_type;
    const displayPlayTime = poi.play_time ;
    // const displayRating = poi.rating !== undefined && poi.rating !== null ? `${poi.rating}점` : '정보 없음'; // rating이 있다면 활성화

    return (
        // 메인 컨테이너: CharInfoBox 및 Modal과 유사한 디자인 스타일 적용
        <div className="bg-white rounded-xl shadow-2xl p-4 min-w-[250px] max-w-xs flex flex-col"
             style={{ fontFamily: 'Pretendard, sans-serif' }}> {/* 폰트 적용 */}

            {/* 이미지 섹션 */}
            <div className="relative rounded-lg overflow-hidden mb-3" style={{ height: '120px' }}>
                <Image
                    src={displayImageUrl}
                    alt={displayTitle}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                />
            </div>

            {/* 제목 (충전소 이름) */}
            <h3 className="text-lg font-extrabold text-gray-800 mb-2 leading-tight">
                {displayTitle}
            </h3>

            {/* 설명 (옵션) */}
            <p className="text-gray-600 text-sm mb-3 line-clamp-2" style={{ minHeight: '3em' }}>
                {displayDescription}
            </p>

            {/* 충전 및 운영 정보 섹션 (새로운 필드들) */}
            <div className="space-y-1 text-sm text-gray-700 mb-4 pt-2 border-t border-gray-100">
                <div className="flex items-center gap-2">
                    <FaPlug className="text-blue-500 flex-shrink-0" size={16} />
                    <span className="font-semibold">충전기 종류:</span> {displayCharType}
                </div>
                <div className="flex items-center gap-2">
                    <FaMoneyBillWave className="text-green-600 flex-shrink-0" size={16} />
                    <span className="font-semibold">시간당 요금:</span> {displayPerPrice}
                </div>
                <div className="flex items-center gap-2">
                    <FaClock className="text-purple-500 flex-shrink-0" size={16} />
                    <span className="font-semibold">운영 시간:</span> {displayPlayTime}
                </div>
                <div className="flex items-center gap-2">
                    <FaCar className="text-orange-500 flex-shrink-0" size={16} />
                    <span className="font-semibold">수용 차량:</span> {displayMaxCar}
                </div>
                {/* rating 필드가 있다면 활성화 (예시) */}
                {/* {poi.rating !== undefined && poi.rating !== null && (
                    <div className="flex items-center gap-2">
                        <FaStar className="text-yellow-500 flex-shrink-0" size={16} />
                        <span className="font-semibold">평점:</span> {displayRating}
                    </div>
                )} */}
            </div>

            {/* "더보기" 버튼 */}
            {/* onMoreClick prop을 호출합니다. 이 prop은 부모 컴포넌트(Map.tsx)에서 router.push를 담당합니다. */}
            <button
                onClick={onMoreClick} // <<-- onMoreClick prop을 호출
                className="w-full py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-colors duration-200"
            >
                더보기
            </button>
        </div>
    );
};

export default InfoBox;