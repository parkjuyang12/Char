'use client';

import { useEffect, useRef, useState } from "react";
import { FaCamera, FaUpload, FaTimes } from "react-icons/fa";
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlug, FaClock } from "react-icons/fa"; // FaPlug(충전), FaClock(시간/운영) 아이콘

// --- ModalProps 인터페이스 ---
// onSubmit 함수가 모든 필요한 데이터를 받을 수 있도록 정의합니다.
interface ModalProps {
    isOpen: boolean; // 모달이 열려있는지 여부
    onClose: () => void; // 모달을 닫는 함수
    onSubmit: (
        placeTitle: string,       // 장소 이름
        longitude: number,        // 경도
        latitude: number,         // 위도
        placeDescription: string, // 장소 설명
        imageFile: File,          // 이미지 파일
        per_price: number,        // 시간당 요금
        char_type: string,        // 충전기 종류
        play_time: string,        // 운영 시간
        max_car: number           // 최대 수용 차량 수
    ) => void;
}
// --- ModalProps 인터페이스 끝 ---

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit }) => {
    // --- 폼 입력 필드 및 상태 관리 변수들 ---
    const [placeTitle, setPlaceTitle] = useState("");
    const [placeDescription, setPlaceDescription] = useState("");
    const [longitude, setLongitude] = useState(0); // 현재 위치 경도
    const [latitude, setLatitude] = useState(0);   // 현재 위치 위도
    const [imageFile, setImageFile] = useState<File | null>(null); // 사용자가 선택/캡처한 이미지 파일
    const [previewUrl, setPreviewUrl] = useState<string | null>(null); // 이미지 미리보기 URL

    // 카메라/모바일 관련 상태 및 ref
    const [isMobile, setIsMobile] = useState<boolean>(false); // 모바일 기기 여부
    const [showVideo, setShowVideo] = useState(false); // 카메라 미리보기 비디오 표시 여부
    const videoRef = useRef<HTMLVideoElement>(null); // 비디오 스트림을 위한 ref
    const canvasRef = useRef<HTMLCanvasElement>(null); // 사진 캡처를 위한 canvas ref
    const [stream, setStream] = useState<MediaStream | null>(null); // 미디어 스트림 객체

    // 새로 추가된 충전소 상세 정보 관련 상태
    const [chargingType, setChargingType] = useState<string>("AC3"); // 충전기 종류 (AC3, DC 등)
    const [pricePerHour, setPricePerHour] = useState<number>(0); // 시간당 요금
    const [availableHours, setAvailableHours] = useState<string>("24시간"); // 운영 시간
    const [maxCars, setMaxCars] = useState<number>(1); // 최대 수용 차량 수

    // 충전기 종류 선택 옵션 (셀렉트 박스용)
    const chargingTypes = [
        { value: "AC3", label: "AC 3상 (22kW)" },
        { value: "DC", label: "DC 급속 (50kW)" },
        { value: "DC_FAST", label: "DC 초급속 (150kW)" },
        { value: "DC_ULTRA", label: "DC 초초급속 (350kW)" }
    ];

    // --- 컴포넌트 마운트 시 실행되는 효과 ---
    useEffect(() => {
        // 사용자 에이전트 문자열을 통해 모바일 기기 여부 판단
        setIsMobile(/Mobi|Android/i.test(navigator.userAgent));

        // Geolocation API를 사용하여 현재 위치 정보를 한 번 가져옵니다.
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                // 위치 정보 획득 성공 시 위도, 경도 상태 업데이트
                setLatitude(pos.coords.latitude);
                setLongitude(pos.coords.longitude);
            },
            (error) => {
                // 위치 정보 획득 실패 시 에러 로깅 및 사용자에게 알림
                console.error("위치 정보를 가져올 수 없습니다:", error);
                alert("위치 정보를 가져올 수 없습니다. 장소 등록 시 기본 위치가 사용될 수 있습니다.");
                // 필요하다면 기본 위치를 설정하거나, 수동 입력 필드를 활성화할 수 있습니다.
            }
        );
    }, []); // 빈 의존성 배열로 컴포넌트 마운트 시 한 번만 실행되도록 설정

    // --- 카메라 관련 함수들 ---
    // 카메라 스트림을 열고 비디오 미리보기를 시작합니다.
    const openCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream; // 비디오 엘리먼트에 스트림 연결
            }
            setStream(mediaStream); // 스트림 상태 저장
            setShowVideo(true); // 비디오 미리보기 표시
        } catch (error) {
            console.error('카메라 접근 오류:', error);
            alert('카메라에 접근할 수 없습니다. 브라우저 권한을 확인해주세요.');
        }
    };

    // 현재 비디오 스트림에서 사진을 캡처합니다.
    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d"); // 2D 렌더링 컨텍스트 가져오기
            if (ctx) {
                // 캔버스 크기를 비디오와 동일하게 설정
                canvas.width = videoRef.current.videoWidth;
                canvas.height = videoRef.current.videoHeight;
                // 비디오 프레임을 캔버스에 그리기
                ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
                // 캔버스 내용을 이미지 파일 (Blob)로 변환
                canvas.toBlob((blob) => {
                    if (blob) {
                        const file = new File([blob], "captured_photo.jpg", { type: "image/jpeg" });
                        setImageFile(file); // 이미지 파일 상태 저장
                        setPreviewUrl(URL.createObjectURL(file)); // 미리보기 URL 생성

                        // 캡처 후 카메라 스트림 중지
                        stream?.getTracks().forEach((track) => track.stop());
                        setShowVideo(false); // 비디오 미리보기 숨기기
                    }
                }, "image/jpeg");
            }
        }
    };

    // 파일 입력 (input type="file")을 통해 이미지를 선택했을 때 처리합니다.
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]; // 선택된 첫 번째 파일 가져오기
        if (file) {
            setImageFile(file); // 이미지 파일 상태 저장
            setPreviewUrl(URL.createObjectURL(file)); // 미리보기 URL 생성
            // 파일 선택 시 비디오 스트림이 열려있다면 닫기 (충돌 방지)
            stream?.getTracks().forEach((track) => track.stop());
            setShowVideo(false);
        }
    };

    // --- 폼 제출 (Submit) 핸들러 ---
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // 폼의 기본 제출 동작 방지

        // 모든 필수 필드에 대한 유효성 검사 (trim()으로 공백 제거 후 확인)
        if (
            placeTitle.trim() === "" ||
            placeDescription.trim() === "" ||
            !imageFile || // 이미지가 선택되었는지 확인
            !chargingType || // 충전기 종류가 선택되었는지 확인
            pricePerHour <= 0 || // 시간당 요금이 0보다 큰지 확인
            availableHours.trim() === "" || // 운영 시간이 입력되었는지 확인
            maxCars <= 0 // 최대 수용 차량 수가 0보다 큰지 확인
        ) {
            alert("모든 필수 필드를 입력하고 이미지를 업로드해주세요.");
            return; // 유효성 검사 실패 시 함수 종료
        }

        // onSubmit 콜백 함수를 호출하여 모든 폼 데이터를 부모 컴포넌트로 전달합니다.
        // 여기서 실제 백엔드 API 호출이 발생합니다 (부모 컴포넌트의 onSubmit 구현).
        onSubmit(
            placeTitle,
            longitude,
            latitude,
            placeDescription,
            imageFile,
            pricePerHour,
            chargingType,
            availableHours,
            maxCars
        );

        // 폼 제출 후 상태 초기화 (사용자 경험을 위해 필드 값을 초기화)
        setPlaceTitle('');
        setPlaceDescription('');
        setImageFile(null);
        setPreviewUrl(null);
        setChargingType("AC3");
        setPricePerHour(0);
        setAvailableHours("24시간");
        // setParkingFee(0); // 주차 요금 필드 제거됨
        setMaxCars(1);
        // setRating(0); // 평점 필드 제거됨
        setLongitude(0); // 위치 정보도 초기화 (선택 사항)
        setLatitude(0);   // 위치 정보도 초기화 (선택 사항)
    };
    // --- handleSubmit 함수 끝 ---

    // --- 모달 닫기 핸들러 ---
    const handleClose = () => {
        // 열려있는 카메라 스트림이 있다면 중지
        stream?.getTracks().forEach((track) => track.stop());
        setStream(null);
        setShowVideo(false);

        // 모달 닫기 시 모든 폼 상태를 초기화 (새로운 등록을 위해)
        setPlaceTitle('');
        setPlaceDescription('');
        setLongitude(0);
        setLatitude(0);
        setImageFile(null);
        setPreviewUrl(null);
        setChargingType("AC3");
        setPricePerHour(0);
        setAvailableHours("24시간");
        // setParkingFee(0); // 주차 요금 필드 제거됨
        setMaxCars(1);
        // setRating(0); // 평점 필드 제거됨

        onClose(); // 부모 컴포넌트로부터 전달받은 onClose 함수 호출
    };

    // 모달이 열려있지 않으면 아무것도 렌더링하지 않습니다.
    if (!isOpen) return null;

    // --- JSX 렌더링 부분 ---
    return (
        // AnimatePresence: Framer Motion에서 컴포넌트가 마운트/언마운트될 때 애니메이션을 적용할 수 있도록 돕습니다.
        <AnimatePresence>
            {/* isOpen이 true일 때만 내부 컨텐츠 렌더링 (exit 애니메이션 활성화) */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }} // 초기 상태 (완전히 투명)
                    animate={{ opacity: 1 }} // 애니메이션 완료 상태 (불투명)
                    exit={{ opacity: 0 }} // 컴포넌트 언마운트 시 상태 (다시 투명)
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
                    onClick={handleClose} // 모달 외부 반투명 영역 클릭 시 모달 닫기
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }} // 초기 상태 (작고 투명)
                        animate={{ scale: 1, opacity: 1 }} // 애니메이션 완료 상태 (원래 크기, 불투명)
                        exit={{ scale: 0.9, opacity: 0 }} // 언마운트 시 (작고 투명)
                        className="bg-white rounded-2xl w-full max-w-lg shadow-2xl my-8"
                        onClick={(e) => e.stopPropagation()} // 모달 내부 클릭이 외부로 전파되어 모달이 닫히는 것을 방지
                    >
                        {/* 모달 헤더 섹션 */}
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                    <FaPlug className="text-blue-500" /> 충전소 등록 {/* 헤더 아이콘 및 제목 */}
                                </h2>
                                <button
                                    onClick={handleClose} // 닫기 버튼 클릭 시 handleClose 호출
                                    className="text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    <FaTimes size={24} /> {/* X 아이콘 */}
                                </button>
                            </div>
                        </div>

                        {/* 스크롤 가능한 폼 컨텐츠 영역 */}
                        <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                            {/* 폼 제출 핸들러 연결 및 CSS 클래스 */}
                            <form onSubmit={handleSubmit} className="space-y-6" id="modal-form"> {/* 'id="modal-form"' 추가 */}
                                {/* 기본 정보 섹션 */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-800">기본 정보</h3>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            충전소 이름
                                        </label>
                                        <input
                                            type="text"
                                            value={placeTitle}
                                            onChange={(e) => setPlaceTitle(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            placeholder="예: 홍길동의 충전소"
                                            required // 필수 입력 필드
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            설명
                                        </label>
                                        <textarea
                                            value={placeDescription}
                                            onChange={(e) => setPlaceDescription(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                                            rows={3}
                                            placeholder="충전소에 대한 설명을 입력하세요"
                                            required // 필수 입력 필드
                                        />
                                    </div>
                                    {/* 평점 섹션은 제거됨 */}
                                </div>

                                {/* 충전 정보 섹션 */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                        <FaPlug className="text-blue-500" /> 충전 정보
                                    </h3>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            충전기 종류
                                        </label>
                                        <select
                                            value={chargingType}
                                            onChange={(e) => setChargingType(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            required // 필수 선택
                                        >
                                            {chargingTypes.map(type => (
                                                <option key={type.value} value={type.value}>
                                                    {type.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            시간당 요금 (원)
                                        </label>
                                        <input
                                            type="number"
                                            value={pricePerHour === 0 ? '' : pricePerHour} // 0이면 빈 칸으로 표시하여 사용자 입력 용이하게 함
                                            onChange={(e) => setPricePerHour(Number(e.target.value))}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            placeholder="예: 5000"
                                            min="0" // 최소값 0
                                            required // 필수 입력 필드
                                        />
                                    </div>
                                </div>

                                {/* 운영 정보 섹션 */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                        <FaClock className="text-blue-500" /> 운영 정보
                                    </h3>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            운영 시간
                                        </label>
                                        <input
                                            type="text"
                                            value={availableHours}
                                            onChange={(e) => setAvailableHours(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            placeholder="예: 24시간, 09:00-18:00"
                                            required // 필수 입력 필드
                                        />
                                    </div>
                                    {/* 주차 요금 필드는 제거됨 */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            최대 수용 차량 수
                                        </label>
                                        <input
                                            type="number"
                                            value={maxCars === 0 ? '' : maxCars} // 0이면 빈 칸으로 표시
                                            onChange={(e) => setMaxCars(Number(e.target.value))}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                            min="1" // 최소값 1 (차량이 1대 이상이어야 함)
                                            required // 필수 입력 필드
                                        />
                                    </div>
                                </div>

                                {/* 이미지 업로드 섹션 */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-800">충전소 사진</h3>
                                    {isMobile ? (
                                        // 모바일 기기일 경우 (capture="environment"로 후면 카메라 우선)
                                        <input
                                            type="file"
                                            accept="image/*" // 이미지 파일만 허용
                                            capture="environment" // 후면 카메라 우선
                                            onChange={handleFileChange}
                                            className="w-full"
                                            required // 필수
                                        />
                                    ) : (
                                        // 데스크톱/기타 기기일 경우 (카메라 켜기, 사진 촬영, 업로드)
                                        <div className="space-y-4">
                                            {showVideo && (
                                                <div className="relative rounded-xl overflow-hidden">
                                                    <video
                                                        ref={videoRef}
                                                        autoPlay
                                                        playsInline
                                                        className="w-full h-64 object-cover"
                                                    />
                                                </div>
                                            )}

                                            <div className="flex gap-3">
                                                <button
                                                    type="button"
                                                    onClick={openCamera}
                                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                                                >
                                                    <FaCamera />
                                                    <span>카메라</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={capturePhoto}
                                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                                                >
                                                    <FaCamera />
                                                    <span>사진 촬영</span>
                                                </button>
                                                <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors cursor-pointer">
                                                    <FaUpload />
                                                    <span>업로드</span>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleFileChange}
                                                        className="hidden"
                                                    />
                                                </label>
                                            </div>

                                            <canvas ref={canvasRef} className="hidden" /> {/* 캡처용 캔버스 */}
                                        </div>
                                    )}

                                    {/* 이미지 미리보기 */}
                                    {previewUrl && (
                                        <div className="mt-4">
                                            <div className="relative rounded-xl overflow-hidden">
                                                <Image
                                                    src={previewUrl}
                                                    alt="미리보기"
                                                    width={400} // 미리보기 이미지의 기본 너비 (CSS w-full로 조절됨)
                                                    height={300} // 미리보기 이미지의 기본 높이 (CSS h-48로 조절됨)
                                                    className="w-full h-48 object-cover"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* 푸터 섹션 (등록/취소 버튼) */}
                        <div className="p-6 border-t border-gray-100">
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={handleClose} // 취소 버튼 클릭 시 모달 닫기
                                    className="px-6 py-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-3 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                                    form="modal-form" // <-- 이 버튼을 'modal-form' ID를 가진 폼과 연결
                                >
                                    충전소 등록하기
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Modal;

