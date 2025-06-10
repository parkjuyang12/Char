'use client'

import React, { useEffect, useState } from 'react';
import { FaPhoneAlt, FaMapMarkerAlt, FaChargingStation, FaBuilding, FaBolt } from 'react-icons/fa';
import { FaCarSide } from 'react-icons/fa';


interface CharInfoBoxProps {
    charPoi: {
        key: string;
        location: google.maps.LatLngLiteral;
        title: string;
        placeId: string;
        address: string;
        statId: string;
        statNm: string;
        busiNm : string;
        busiCall : string;
    };
    onClose: () => void;
}

interface ChargerStatusItem {
    busiId: string;
    statId: string;
    chgerId: string;
    stat: string;
    statUpdDt: string;
}

// --- 인터페이스 정의 끝 ---


const CharInfoBox: React.FC<CharInfoBoxProps> = ({ charPoi}) => { // onMoreClick 제거
    const [chargerStatus, setChargerStatus] = useState<ChargerStatusItem[] | null>(null);
    const [loadingStatus, setLoadingStatus] = useState<boolean>(true);
    const [errorStatus, setErrorStatus] = useState<string | null>(null);

    useEffect(() => {
        const fetchChargerStatus = async () => {
            setLoadingStatus(true);
            setErrorStatus(null);

            try {
                const rawServiceKey = '7XHVzTXkVRP6Vh6jOHyYyvRMo9LhW07VUbz1ucZcQuLoPDf33tTIuUqiwcdo4Nss2+FCovzJsGE2aWTQycbIaw=='; // <<-- 이 부분 확인 및 교체 필수!
                const serviceKey = encodeURIComponent(rawServiceKey);

                const statId = charPoi.statId;

                let queryParams = '';
                queryParams += '?' + encodeURIComponent('serviceKey') + '=' + serviceKey;
                queryParams += '&' + encodeURIComponent('statId') + '=' + encodeURIComponent(statId);
                queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1');
                queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('9999');
                queryParams += '&' + encodeURIComponent('period') + '=' + encodeURIComponent('5');

                const requestUrl = 'http://apis.data.go.kr/B552584/EvCharger/getChargerStatus' + queryParams;

                console.log("충전기 상태 API 요청 URL:", requestUrl);

                const response = await fetch(requestUrl);
                const responseText = await response.text();
                console.log("API Raw XML 응답:", responseText);

                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(responseText, "text/xml");

                const resultCodeElement = xmlDoc.querySelector("response > header > resultCode");
                const resultMsgElement = xmlDoc.querySelector("response > header > resultMsg");

                const resultCode = resultCodeElement?.textContent;
                const resultMsg = resultMsgElement?.textContent;

                if (resultCode === '00') {
                    const items: ChargerStatusItem[] = [];
                    const itemNodes = xmlDoc.querySelectorAll("response > body > items > item");

                    if (itemNodes.length > 0) {
                        itemNodes.forEach(itemNode => {
                            const busiId = itemNode.querySelector("busiId")?.textContent || '';
                            const statId_ = itemNode.querySelector("statId")?.textContent || '';
                            const chgerId = itemNode.querySelector("chgerId")?.textContent || '';
                            const stat = itemNode.querySelector("stat")?.textContent || '';
                            const statUpdDt = itemNode.querySelector("statUpdDt")?.textContent || '';

                            items.push({ busiId, statId: statId_, chgerId, stat, statUpdDt });
                        });
                    }
                    setChargerStatus(items);

                } else {
                    setErrorStatus(`API 오류: ${resultMsg || '알 수 없는 오류'} (코드: ${resultCode || '알 수 없음'})`);
                    setChargerStatus([]);
                }
            } catch (error) {
                console.error("충전기 상태 API 호출 실패 (XML 파싱 또는 네트워크):", error);
                setErrorStatus("충전기 상태를 불러오는데 실패했습니다. 네트워크 또는 XML 파싱 오류.");
                setChargerStatus([]);
            } finally {
                setLoadingStatus(false);
            }
        };

        if (charPoi.statId) {
            fetchChargerStatus();
        }
    }, [charPoi.statId]);

    const getTotalChargers = () => chargerStatus?.length || 0;
    const getAvailableChargers = () => {
        if (!chargerStatus) return 0;
        return chargerStatus.filter(item => item.stat === '2').length;
    };
    const getChargingChargers = () => {
        if (!chargerStatus) return 0;
        return chargerStatus.filter(item => item.stat === '3').length;
    };
    const getUnavailableChargers = () => {
        if (!chargerStatus) return 0;
        return chargerStatus.filter(item => ['1', '4', '5', '9'].includes(item.stat)).length;
    };

    // --- 길 찾기 함수 정의 ---
    const openInNaverMap = () => {
        const encodedAddress = encodeURIComponent(charPoi.address);
        // Naver Map 길찾기 (도착지 주소 검색)
        // 출발지 없는 경우: 'nmap://navigation?dname=${encodedAddress}&appname=YOUR_APP_NAME'
        // 웹 브라우저용: 'https://map.naver.com/v5/search/${encodedAddress}/place' (단순 검색)
        // 웹 브라우저용 길찾기: 'https://map.naver.com/v5/directions/-/undefined,${encodedAddress},,'
        // 모바일 앱 강제 실행: 'nmap://place?id=${placeId}&appname=YOUR_APP_NAME'
        // 여기서는 도착지 주소 검색으로 웹 페이지를 엽니다.
        const url = `https://map.naver.com/v5/search/${encodedAddress}/place`;
        window.open(url, '_blank');
    };

    const openInKakaoMap = () => {
        const encodedAddress = encodeURIComponent(charPoi.address);
        // Kakao Map 길찾기 (도착지 주소 검색)
        // 웹 브라우저용: 'https://map.kakao.com/?q=${encodedAddress}' (단순 검색)
        // 웹 브라우저용 길찾기: 'https://map.kakao.com/link/to/${encodedAddress},${lat},${lng}' (위경도 필요)
        // 모바일 앱 강제 실행: 'kakaomap://place?id=${placeId}'
        // 여기서는 도착지 주소 검색으로 웹 페이지를 엽니다.
        const url = `https://map.kakao.com/?q=${encodedAddress}`;
        window.open(url, '_blank');
    };

    const openInTmap = () => {
        encodeURIComponent(charPoi.address);
        encodeURIComponent(charPoi.title);
// T맵은 목적지 이름도 지원
        const url = `https://apis.openapi.sk.com/tmap/routes?appKey=YOUR_TMAP_APP_KEY&name=<span class="math-inline">\{encodedTitle\}&address\=</span>{encodedAddress}`;
        window.open(url, '_blank');
    };


    return (
        <div className="relative bg-white px-4 pt-0.5 pb-3.5 rounded-xl shadow-2xl min-w-[220px] max-w-xs flex flex-col"
             style={{ fontFamily: 'Pretendard, sans-serif' }}>

            <h3 className="text-xl font-extrabold text-blue-700 mt-0 mb-3 pr-8">
                {(charPoi.statNm || charPoi.busiNm || '이름 없음')}
            </h3>

            <div className="flex items-center text-gray-700 text-base mb-2">
                <FaBuilding className="text-blue-500 mr-2 flex-shrink-0" size={18} />
                <span className="font-semibold">사업자:</span>
                <span className="ml-2">{charPoi.busiNm}</span>
            </div>

            {charPoi.busiCall && (
                <div className="flex items-center text-gray-700 text-base mb-2">
                    <FaPhoneAlt className="text-blue-500 mr-2 flex-shrink-0" size={18} />
                    <span className="font-semibold">전화번호:</span>
                    <span className="ml-2">{charPoi.busiCall}</span>
                </div>
            )}

            <div className="flex items-start text-gray-700 text-base mb-4">
                <FaMapMarkerAlt className="text-blue-500 mr-2 mt-1 flex-shrink-0" size={18} />
                <span className="font-semibold">주소:</span>
                <span className="ml-2 leading-tight">{charPoi.address}</span>
            </div>

            {/* 충전기 상태 정보 섹션 */}
            <div className="pt-2 border-t border-gray-100 mt-2">
                <h4 className="font-bold text-gray-800 text-base mb-2 flex items-center">
                    <FaChargingStation className="text-green-600 mr-2" size={20} />
                    충전기 상태
                </h4>
                {loadingStatus ? (
                    <p className="text-sm text-gray-500">상태 정보 로딩 중...</p>
                ) : errorStatus ? (
                    <p className="text-sm text-red-500">{errorStatus}</p>
                ) : chargerStatus === null || getTotalChargers() === 0 ? (
                    <p className="text-sm text-gray-500">충전기 정보 없음.</p>
                ) : (
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-sm">
                        <p className="flex items-center text-green-600">
                            <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                            가능: <span className="font-bold ml-1">{getAvailableChargers()}대</span>
                        </p>
                        <p className="flex items-center text-orange-500">
                            <span className="w-2 h-2 rounded-full bg-orange-400 mr-2"></span>
                            충전 중: <span className="font-bold ml-1">{getChargingChargers()}대</span>
                        </p>
                        <p className="flex items-center text-red-500">
                            <span className="w-2 h-2 rounded-full bg-red-400 mr-2"></span>
                            사용불가: <span className="font-bold ml-1">{getUnavailableChargers()}대</span>
                        </p>
                        <p className="flex items-center text-blue-700">
                            <FaBolt className="text-blue-500 mr-1" size={14} />
                            전체: <span className="font-bold ml-1">{getTotalChargers()}대</span>
                        </p>
                    </div>
                )}
            </div>

            {/* 길 찾기 버튼 컨테이너 */}
            <div className="flex flex-wrap justify-end gap-2 mt-auto pt-4 border-t border-gray-100">
                {/* 네이버 지도 버튼 */}
                <button
                    onClick={openInNaverMap}
                    className="flex-1 min-w-[calc(50%-8px)] bg-green-500 text-white px-3 py-2 rounded-lg font-bold text-sm flex items-center justify-center hover:bg-green-600 transition-colors duration-200"
                >
                    {/* 아이콘과 텍스트를 flexbox span으로 감싸고, 텍스트에 ml-0.5 추가 */}
                    <span className="flex items-center justify-center">
                      <img src="/icons/naver.png" alt="네이버지도 아이콘" className="w-4 h-4 mr-1" />
                    <span className="ml-0.5">네이버지도</span>
                 </span>
                </button>
                {/* 카카오 지도 버튼 */}
                <button
                    onClick={openInKakaoMap}
                    className="flex-1 min-w-[calc(50%-8px)] bg-yellow-500 text-gray-800 px-3 py-2 rounded-lg font-bold text-sm flex items-center justify-center hover:bg-yellow-600 transition-colors duration-200"
                >
                    <span className="flex items-center justify-center">
                    <img src="/icons/kakaomap.png" alt="카카오맵 아이콘" className="w-4 h-4 mr-1" />
                        {/* '카카오맵' 텍스트에 좌측 마진 클래스 추가 */}
                        <span className="ml-0.5">카카오맵</span> </span>
                </button>
                {/* T맵 버튼 */}
                <button
                    onClick={openInTmap}
                    className="flex-1 min-w-[calc(50%-8px)] bg-blue-500 text-white px-3 py-2 rounded-lg font-bold text-sm flex items-center justify-center hover:bg-blue-600 transition-colors duration-200"
                >
                    <FaCarSide className="mr-1" /> T맵
                </button>
            </div>
        </div>
    );
};

export default CharInfoBox;
