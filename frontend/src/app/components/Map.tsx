'use client'

import { useEffect, useState, useRef } from 'react';
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import InfoBox from './InfoBox';
import CharInfoBox from './CharInfoBox';
import { createRoot } from 'react-dom/client';
import {
    APIProvider, Map, MapCameraChangedEvent, AdvancedMarker,
    Pin, useMap
} from '@vis.gl/react-google-maps';
import type {Marker} from '@googlemaps/markerclusterer';
import { useRouter } from 'next/navigation';

interface resDto {
    poi: resPoi[];
}

interface resPoi {
    latitude: number;
    longitude: number;
    placeTitle: string;
    placeImageURL: string;
    userid: number;
    placeId: number;
    placeDescription : string;
    per_price : number;
    play_time : string;
    max_car : string; // 백엔드에서 string으로 내려주기에 string 유지
    char_type : string;
}

interface LoadCharPlaceDtoResponse {
    poi: CharPlaceDto[];
}

interface CharPlaceDto {
    statId: string;
    statNm: string;
    address: string;
    lat: number;
    lng: number;
    busiNm: string;
    busiCall: string;
}

interface CharPoi {
    key: string;
    location: google.maps.LatLngLiteral;
    title: string;
    placeId: string;
    address: string;
    statId: string;
    statNm: string;
    busiNm: string;
    busiCall: string;
}

interface Poi {
    key: string;
    location: google.maps.LatLngLiteral;
    title: string;
    description?: string;
    imageUrl?: string;
    placeId: number;
    placeTitle: string;
    placeDescription: string;
    placeImageURL?: string;
    latitude: number;
    longitude: number;
    per_price: number;
    char_type: string;
    play_time: string;
    max_car: number; // resPoi에서 string으로 받더라도 여기서는 number로 파싱하여 사용
    userId?: number; // resPoi의 userid를 매핑
}

// PlaceDto는 백엔드 응답 resPoi와 거의 동일하므로, 혼동을 피하기 위해 제거하거나 resPoi로 통일하는 것을 권장합니다.
// 만약 PlaceDto를 프론트엔드 내부 모델로 사용한다면, resPoi에서 PlaceDto로의 변환 로직을 명확히 해야 합니다.
// 현재 코드에서는 resPoi를 직접 Poi로 매핑하고 있으므로, PlaceDto는 사용되지 않습니다.
/*
interface PlaceDto {
    latitude: number;
    longitude: number;
    placeTitle: string;
    placeImageURL: string;
    userId: number;
    placeId: number;
    placeDescription : string;
    per_price : number;
    play_time : string;
    max_car : string;
    char_type : string;
};
*/

const distanceInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // km 단위
};


export async function loadPlace(lat: number, lng: number): Promise<resDto> {
    const token = localStorage.getItem('jwtToken');
    console.log('API 요청에 사용될 일반 장소 토큰:', token);

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`/api/load_location?lat=${lat}&lng=${lng}`, {
        method: 'GET',
        headers: headers,
        credentials: 'include',
    });

    if (res.ok){
        const data: resDto = await res.json();
        console.log("일반 장소 응답: ", data);
        return data;
    }
    const errorText = await res.text();
    console.error(`일반 장소 로드 실패: ${res.status} ${res.statusText}. 서버 응답: ${errorText}`);
    throw new Error(`일반 장소 로드 실패: ${res.status} ${res.statusText}`);
}

export async function loadCharPlace(lat: number, lng: number): Promise<LoadCharPlaceDtoResponse> {
    const token = localStorage.getItem('jwtToken');
    console.log('API 요청에 사용될 충전 장소 토큰:', token);

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`/api/load_char_location?lat=${lat}&lng=${lng}`, {
        method: 'GET',
        headers: headers,
        credentials: 'include',
    });

    if (res.ok){
        const data: LoadCharPlaceDtoResponse = await res.json();
        console.log("충전 장소 응답: ", data);
        return data;
    }
    const errorText = await res.text();
    console.error(`충전 장소 로드 실패: ${res.status} ${res.statusText}. 서버 응답: ${errorText}`);
    throw new Error(`충전 장소 로드 실패: ${res.status} ${res.statusText}`);
}


const CharPoiMarkers = (props: { charPois: CharPoi[] }) => {
    const map = useMap();
    const router = useRouter();
    const [markers, setMarkers] = useState<{[key: string]: Marker}>({});
    const clusterer = useRef<MarkerClusterer | null>(null);
    const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

    useEffect(() => {
        if (!map) return;
        if (!clusterer.current) {
            clusterer.current = new MarkerClusterer({map});
        }
        if (!infoWindowRef.current) {
            infoWindowRef.current = new google.maps.InfoWindow();
        }
    }, [map]);

    useEffect(() => {
        clusterer.current?.clearMarkers();
        clusterer.current?.addMarkers(Object.values(markers));
    }, [markers]);

    const setMarkerRef = (marker: Marker | null, key: string) => {
        if (marker && markers[key]) return;
        if (!marker && !markers[key]) return;

        setMarkers(prev => {
            if (marker) {
                return {...prev, [key]: marker};
            } else {
                const newMarkers = {...prev};
                delete newMarkers[key];
                return newMarkers;
            }
        });
    };

    const handleMoreClick = (placeId: string) => {
        router.push(`/charge-stations/${placeId}`);
    };

    const handleMarkerClick = (charPoi: CharPoi) => {
        if (map && infoWindowRef.current) {
            const container = document.createElement('div');
            createRoot(container).render(
                <CharInfoBox
                    charPoi={charPoi}
                    onMoreClick={() => handleMoreClick(charPoi.placeId)}
                    onClose={() => infoWindowRef.current?.close()}
                />
            );
            infoWindowRef.current.setContent(container);
            infoWindowRef.current.setPosition(charPoi.location);
            infoWindowRef.current.open(map);
        }
    };

    return (
        <>
            {props.charPois.map((charPoi: CharPoi) => (
                <AdvancedMarker
                    key={charPoi.key}
                    position={charPoi.location}
                    ref={marker => setMarkerRef(marker, charPoi.key)}
                    onClick={() => handleMarkerClick(charPoi)}
                >
                    <Pin background={'#007bff'} glyphColor={'#FFFFFF'} borderColor={'#000000'} />
                </AdvancedMarker>
            ))}
        </>
    );
};


export default function CustomeMap() {
    const router = useRouter();
    const [userCenter, setUserCenter] = useState<{ lat: number, lng: number } | null>(null);
    const [lastPosition, setLastPosition] = useState<{ lat: number, lng: number } | null>(null);
    const [textContent, setTextContent] = useState('위치 파악 중…');
    const [point, setPoint] = useState<Poi[] | null>(null);
    const [chargingPoints, setChargingPoints] = useState<CharPoi[] | null>(null);


    useEffect(() => {
        if (!navigator.geolocation) {
            setTextContent("브라우저에서 위치 기능을 제공하지 않습니다.");
            console.log(textContent);
        } else {
            const getCurrentLocation = async () => {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const pos = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                        };
                        setTextContent("Location Succes");
                        setUserCenter(pos);
                        setLastPosition(pos);

                        try {
                            const places: resDto = await loadPlace(pos.lat, pos.lng);
                            const placepoi: Poi[] = (places.poi || []).map((p: resPoi) => ({ // p 타입을 resPoi로 변경
                                key: `general-${p.placeId}-${Math.random().toString(36).substring(2, 6)}`,
                                location: { lat: p.latitude, lng: p.longitude },
                                title: p.placeTitle,
                                placeId: p.placeId,
                                placeDescription: p.placeDescription,
                                placeImageURL: p.placeImageURL,
                                placeTitle:p.placeTitle,
                                latitude: p.latitude,
                                longitude: p.longitude,
                                per_price: p.per_price,
                                char_type: p.char_type,
                                play_time: p.play_time,
                                max_car: parseInt(p.max_car, 10), // string을 number로 변환
                                userId: p.userid, // resPoi의 userid 매핑
                            }));
                            setPoint(placepoi);
                            console.log('초기 일반 장소 데이터:', placepoi);

                            const chargingStationsResponse: LoadCharPlaceDtoResponse = await loadCharPlace(pos.lat, pos.lng);
                            const chargingPoiData: CharPoi[] = (chargingStationsResponse.poi || []).map((cp: CharPlaceDto) => ({
                                key: `charging-${cp.statId}-${Math.random().toString(36).substring(2, 6)}`,
                                location: { lat: cp.lat, lng: cp.lng },
                                title: cp.statNm + " (" + cp.busiNm + ")",
                                placeId: cp.statId,
                                address: cp.address,
                                statId: cp.statId,
                                statNm: cp.statNm,
                                busiNm : cp.busiNm,
                                busiCall : cp.busiCall,
                            }));
                            setChargingPoints(chargingPoiData);
                            console.log('초기 충전 장소 데이터:', chargingPoiData);

                            setLastPosition(pos);
                        } catch (error) {
                            console.error('초기 장소 로딩 실패:', error);
                            const defaultPos = { lat: 37.5665, lng: 126.9780 }; // 서울 시청
                            setTextContent("위치 정보를 가져올 수 없어 기본 위치로 설정합니다.");
                            setUserCenter(defaultPos);
                            setLastPosition(defaultPos);

                            try {
                                const generalPlaces: resDto = await loadPlace(defaultPos.lat, defaultPos.lng);
                                const generalPoiData: Poi[] = (generalPlaces.poi || []).map((p: resPoi) => ({ // p 타입을 resPoi로 변경
                                    key: `general-${p.placeId}-${Math.random().toString(36).substring(2, 6)}`,
                                    location: { lat: p.latitude, lng: p.longitude },
                                    title: p.placeTitle,
                                    placeId: p.placeId,
                                    placeDescription: p.placeDescription,
                                    placeImageURL: p.placeImageURL,
                                    placeTitle: p.placeTitle,
                                    latitude: p.latitude,
                                    longitude: p.longitude,
                                    per_price: p.per_price,
                                    char_type: p.char_type,
                                    play_time: p.play_time,
                                    max_car: parseInt(p.max_car, 10), // string을 number로 변환
                                    userId: p.userid, // resPoi의 userid 매핑
                                }));
                                setPoint(generalPoiData);
                                console.log('기본 위치로 로드된 일반 장소 POI:', generalPoiData);

                                const chargingStationsResponse: LoadCharPlaceDtoResponse = await loadCharPlace(defaultPos.lat, defaultPos.lng);
                                const chargingPoiData: CharPoi[] = (chargingStationsResponse.poi || []).map((cp: CharPlaceDto) => ({
                                    key: `charging-${cp.statId}-${Math.random().toString(36).substring(2, 6)}`,
                                    location: { lat: cp.lat, lng: cp.lng },
                                    title: cp.statNm + " (" + cp.busiNm + ")",
                                    placeId: cp.statId,
                                    address: cp.address,
                                    statId: cp.statId,
                                    statNm: cp.statNm,
                                    busiNm : cp.busiNm,
                                    busiCall : cp.busiCall,
                                }));
                                setChargingPoints(chargingPoiData);
                                console.log('기본 위치로 로드된 충전 장소 POI:', chargingPoiData);

                            } catch (defaultLoadError) {
                                console.error('기본 위치 장소 로딩에도 실패:', defaultLoadError);
                                setTextContent("기본 위치 장소 로딩에도 실패했습니다.");
                            }
                        }
                    },
                    (error) => {
                        setTextContent(`현재 위치를 가져올 수 없음: ${error.message}. 기본 위치로 설정합니다.`);
                        console.error("위치 가져오기 오류:", error);
                        const defaultPos = { lat: 37.5665, lng: 126.9780 }; // 서울 시청
                        setUserCenter(defaultPos);
                        setLastPosition(defaultPos);

                        Promise.allSettled([
                            loadPlace(defaultPos.lat, defaultPos.lng),
                            loadCharPlace(defaultPos.lat, defaultPos.lng)
                        ]).then(([generalResult, charResult]) => {
                            if (generalResult.status === 'fulfilled') {
                                const generalPoiData: Poi[] = (generalResult.value.poi || []).map((p: resPoi) => ({ // p 타입을 resPoi로 변경
                                    key: `general-${p.placeId}-${Math.random().toString(36).substring(2, 6)}`,
                                    location: { lat: p.latitude, lng: p.longitude },
                                    title: p.placeTitle,
                                    placeId: p.placeId,
                                    placeDescription: p.placeDescription,
                                    placeImageURL: p.placeImageURL,
                                    latitude: p.latitude,
                                    placeTitle: p.placeTitle,
                                    longitude: p.longitude,
                                    per_price: p.per_price,
                                    char_type: p.char_type,
                                    play_time: p.play_time,
                                    max_car: parseInt(p.max_car, 10), // string을 number로 변환
                                    userId: p.userid, // resPoi의 userid 매핑
                                }));
                                setPoint(generalPoiData);
                                console.log('Geolocation 실패 후 일반 장소 POI:', generalPoiData);
                            } else {
                                console.error('Geolocation 실패 후 일반 장소 로딩 실패:', generalResult.reason);
                            }

                            if (charResult.status === 'fulfilled') {
                                const chargingPoiData: CharPoi[] = (charResult.value.poi || []).map((cp: CharPlaceDto) => ({
                                    key: `charging-${cp.statId}-${Math.random().toString(36).substring(2, 6)}`,
                                    location: { lat: cp.lat, lng: cp.lng },
                                    title: cp.statNm + " (" + cp.busiNm + ")",
                                    placeId: cp.statId,
                                    address: cp.address,
                                    statId: cp.statId,
                                    statNm: cp.statNm,
                                    busiNm : cp.busiNm,
                                    busiCall : cp.busiCall,
                                }));
                                setChargingPoints(chargingPoiData);
                                console.log('Geolocation 실패 후 충전 장소 POI:', chargingPoiData);
                            } else {
                                console.error('Geolocation 실패 후 충전 장소 로딩 실패:', charResult.reason);
                            }
                        });
                    },
                    { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
                );
            };
            getCurrentLocation();
        }
    }, []);


    const PoiMarkers = (props: { pois: Poi[] }) => {
        const map = useMap();
        const [markers, setMarkers] = useState<{[key: string]: Marker}>({});
        const clusterer = useRef<MarkerClusterer | null>(null);
        const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

        useEffect(() => {
            if (!map) return;
            if (!clusterer.current) {
                clusterer.current = new MarkerClusterer({map});
            }
            if (!infoWindowRef.current) {
                infoWindowRef.current = new google.maps.InfoWindow();
            }
        }, [map]);

        useEffect(() => {
            clusterer.current?.clearMarkers();
            clusterer.current?.addMarkers(Object.values(markers));
        }, [markers]);


        const setMarkerRef = (marker: Marker | null, key: string) => {
            if (marker && markers[key]) return;
            if (!marker && !markers[key]) return;

            setMarkers(prev => {
                if (marker) {
                    return {...prev, [key]: marker};
                } else {
                    const newMarkers = {...prev};
                    delete newMarkers[key];
                    return newMarkers;
                }
            });
        };

        const handleMoreClick = (placeId: number) => {
            router.push(`/place/${placeId}`);
        };

        const handleMarkerClick = (poi: Poi) => {
            if (map && infoWindowRef.current) {
                console.log("current: ",poi.placeId);
                const container = document.createElement('div');
                createRoot(container).render(
                    <InfoBox
                        poi={poi}
                        onMoreClick={() => handleMoreClick(poi.placeId)}
                        // InfoBox에 onClose prop이 있다면 주석 해제 후 추가
                        onClose={() => infoWindowRef.current?.close()}
                    />
                );
                infoWindowRef.current.setContent(container);
                infoWindowRef.current.setPosition(poi.location);
                infoWindowRef.current.open(map);

            } else {
                console.log(poi.placeId);
                // infoWindowRef.current가 null인 경우 초기화 후 재시도
                infoWindowRef.current = new google.maps.InfoWindow();
                const container = document.createElement('div');
                createRoot(container).render(
                    <InfoBox
                        poi={poi}
                        onMoreClick={() => handleMoreClick(poi.placeId)}
                        onClose={() => infoWindowRef.current?.close()}
                    />
                );
                infoWindowRef.current.setContent(container);
                infoWindowRef.current.setPosition(poi.location);
                infoWindowRef.current.open(map);

            }
        };

        return (
            <>
                {props.pois.map( (poi: Poi) => (
                    <AdvancedMarker
                        key={poi.key}
                        position={poi.location}
                        ref={marker => setMarkerRef(marker, poi.key)}
                        onClick={() => handleMarkerClick(poi)}
                    >
                        <Pin background={'#FF0000'} glyphColor={'#FFFFFF'} borderColor={'#000000'} />
                    </AdvancedMarker>

                ))}
            </>
        );
    };

    const handleCameraChange = async (ev: MapCameraChangedEvent) => {
        const newCenter = ev.detail.center;
        console.log('📍 지도 중심 변경됨:', newCenter.lat, newCenter.lng);

        if (lastPosition) {
            const distance = distanceInKm(lastPosition.lat, lastPosition.lng, newCenter.lat, newCenter.lng);
            if (distance > 30) {
                setPoint([]);
                setChargingPoints([]);

                try {
                    const places:resDto = await loadPlace(newCenter.lat, newCenter.lng);
                    const placepoi:Poi[] = (places.poi || []).map((p: resPoi)=> ({ // p 타입을 resPoi로 변경
                        key:`general-${p.placeId}-${Math.random().toString(36).substring(2, 6)}`,
                        location:{lat: p.latitude, lng: p.longitude},
                        title:p.placeTitle,
                        placeId:p.placeId,
                        placeDescription: p.placeDescription,
                        placeImageURL: p.placeImageURL,
                        latitude: p.latitude,
                        longitude: p.longitude,
                        placeTitle: p.placeTitle,
                        per_price: p.per_price,
                        char_type: p.char_type,
                        play_time: p.play_time,
                        max_car: parseInt(p.max_car, 10), // string을 number로 변환
                        userId: p.userid, // resPoi의 userid 매핑
                    }));
                    setPoint(placepoi);
                    console.log('카메라 변경 후 일반 장소 데이터:', placepoi);

                    const chargingStationsResponse: LoadCharPlaceDtoResponse = await loadCharPlace(newCenter.lat, newCenter.lng);
                    const chargingPoiData: CharPoi[] = (chargingStationsResponse.poi || []).map((cp: CharPlaceDto) => ({
                        key:`charging-${cp.statId}-${Math.random().toString(36).substring(2, 6)}`,
                        location:{lat: cp.lat, lng: cp.lng},
                        title:cp.statNm + " (" + cp.busiNm + ")",
                        placeId:cp.statId,
                        address: cp.address,
                        statId: cp.statId,
                        statNm: cp.statNm,
                        busiNm : cp.busiNm,
                        busiCall : cp.busiCall,
                    }));
                    setChargingPoints(chargingPoiData);
                    console.log('카메라 변경 후 충전 장소 데이터:', chargingPoiData);

                    setLastPosition({ lat: newCenter.lat, lng: newCenter.lng });
                } catch (error) {
                    console.error('카메라 이동 후 장소 로딩 실패:', error);
                    setTextContent('카메라 이동 후 장소 로딩에 실패했습니다.');
                }
            }
        }
    };

    return (
        <div className='w-full h-full'>
            <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API!} onLoad={() => console.log('Maps API has loaded.')}>
                {userCenter && (<Map
                    defaultZoom={15}
                    defaultCenter={userCenter}
                    mapId='YOUR_MAP_ID' // 실제 Map ID로 변경 필요!
                    onCameraChanged={handleCameraChange}
                    scaleControl={false}
                    fullscreenControl={false}
                    rotateControl={false}
                    mapTypeControl={false}
                    zoomControl={false}
                    streetViewControl={false}
                >
                    {userCenter && (
                        <AdvancedMarker
                            key="current-user-location"
                            position={userCenter}
                        >
                            <Pin background={'#4285F4'} glyphColor={'#FFFFFF'} borderColor={'#000000'} />
                        </AdvancedMarker>
                    )}

                    {point && <PoiMarkers pois={point} />}
                    {chargingPoints && <CharPoiMarkers charPois={chargingPoints} />}

                </Map>)}
            </APIProvider>
            <div style={{ position: 'absolute', top: '10px', left: '10px', background: 'white', padding: '10px', border: '1px solid gray', zIndex: 1000 }}>
                {textContent}
            </div>
        </div>
    );
}