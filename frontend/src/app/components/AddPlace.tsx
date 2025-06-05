// AddPlace.tsx

import { useState } from "react";
import axios from "axios";

const AddPlace = () => {
    const [placeTitle, setPlaceTitle] = useState<string>("");
    const [placeDescription, setPlaceDescription] = useState<string>("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [message, setMessage] = useState<string>("");

    // 이미지 파일 변경 핸들러
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImageFile(file);
        }
    };

    // 폼 제출 핸들러
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!placeTitle || !placeDescription || !imageFile) {
            setMessage("모든 필드를 채워주세요.");
            return;
        }

        const formData = new FormData();
        formData.append("placeTitle", placeTitle);
        formData.append("placeDescription", placeDescription);
        formData.append("placeImageURL", imageFile);

        try {
            const response = await axios.post(
                "/api/place/add", // Next.js API route로 데이터 전송
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "Authorization": `Bearer ${localStorage.getItem('token')}`, // JWT 토큰을 Authorization 헤더로 추가
                    },
                }
            );

            if (response.status === 200) {
                setMessage("장소가 성공적으로 등록되었습니다!");
            }
        } catch (error) {
            console.error("Error uploading place:", error);
            setMessage("장소 등록에 실패했습니다. 다시 시도해주세요.");
        }
    };

    return (
        <div>
            <h1>장소 등록</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="placeTitle">장소 제목</label>
                    <input
                        type="text"
                        id="placeTitle"
                        value={placeTitle}
                        onChange={(e) => setPlaceTitle(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="placeDescription">장소 설명</label>
                    <textarea
                        id="placeDescription"
                        value={placeDescription}
                        onChange={(e) => setPlaceDescription(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="placeImageURL">이미지 업로드</label>
                    <input
                        type="file"
                        id="placeImageURL"
                        onChange={handleFileChange}
                        required
                    />
                </div>

                <button type="submit">장소 등록</button>
            </form>

            {message && <p>{message}</p>}
        </div>
    );
};

export default AddPlace;
