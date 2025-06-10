'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
// 새로운 디자인에 필요한 라이브러리 임포트
import { FaGoogle, FaApple, FaFacebook } from 'react-icons/fa'; // 소셜 로그인 아이콘 (실제 기능 추가 안 할 거면 제거 가능)
import { motion } from 'framer-motion'; // 애니메이션 라이브러리
import { BsLightningCharge } from 'react-icons/bs'; // 로고 아이콘

export default function LoginPage() {
    const router = useRouter();

    // 기존 로그인 로직에 사용되는 상태들 (username 그대로 사용)
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [jwtToken, setJwtToken] = useState(''); // 필요에 따라 jwtToken 상태도 유지
    const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가 (UI 제어용)

    // --- 원래의 잘 작동하던 handleLogin 함수 로직 그대로 유지 ---
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        setIsLoading(true); // 로딩 시작 (새 디자인에 필요)
        setErrorMsg('');    // 에러 메시지 초기화
        setSuccessMsg('');  // 성공 메시지 초기화

        try {
            console.log('로그인 시도:', { username, password });
            const res = await fetch(`/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ username, password }),
            });

            if (res.ok) { // 성공 응답 (2xx 상태 코드)
                // 성공 시에만 JSON을 파싱
                // const data = await res.json(); // <-- 만약 서버가 토큰을 본문에 담아준다면 이 줄을 활성화
                const token = res.headers.get('Authorization')!.split(' ')[1]; // <-- 헤더에서 토큰 추출 (원래 코드 방식)
                // const token = res.headers.get('Authorization')!; // Bearer 접두사까지 필요한 경우

                if (token) {
                    setJwtToken(token); // 토큰 상태 업데이트
                    localStorage.setItem("token", token); // 로컬 스토리지에 저장
                    setSuccessMsg('로그인 성공! 대시보드로 이동합니다.');
                    console.log('JWT Token:', token);

                    setTimeout(() => router.push('/dashboard'), 1500); // 대시보드로 이동
                } else {
                    console.error('토큰이 없습니다: Authorization 헤더에 토큰이 없거나 형식이 올바르지 않습니다.');
                    setErrorMsg('인증 토큰을 받지 못했습니다.');
                }
            } else { // 실패 응답 (4xx, 5xx 상태 코드)
                // 실패 시에도 서버가 JSON 응답을 보낸다고 가정
                const data = await res.json();
                console.error('로그인 실패:', data.error || '알 수 없는 오류');
                setErrorMsg(data.error || '로그인에 실패했습니다.');
            }
        } catch (error) { // 네트워크 오류 등 예외 처리
            console.error('로그인 에러 (네트워크 문제 또는 서버 응답 문제):', error);
            setErrorMsg('서버 연결 또는 응답 처리 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false); // 로딩 종료
        }
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center p-4 relative overflow-hidden">
            {/* 배경 그라데이션 */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5"></div>

            {/* 배경 패턴 */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent opacity-50"></div>

            {/* 글로우 효과 */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-500/5 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-0 right-1/2 translate-x-1/2 w-[800px] h-[800px] bg-purple-500/5 blur-[120px] rounded-full"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10">
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center mb-4">
                            <div className="relative">
                                {/* 로고 아이콘 */}
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl rounded-full"></div>
                                <BsLightningCharge className="w-8 h-8 text-white mr-2 relative" />
                            </div>
                            {/* 서비스 이름 */}
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">Chargeous</h1>
                        </div>
                        <p className="text-white/60">전기차 충전의 새로운 경험</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-4">
                            <div className="relative">
                                {/* 이메일/ID 입력 필드: username 상태와 연결 */}
                                <input
                                    type="email" // type은 email로 유지하여 이메일 형식 유효성 검사 활용
                                    value={username} // <<-- username 상태와 연결
                                    onChange={(e) => setUsername(e.target.value)} // <<-- setUsername 함수 사용
                                    placeholder="이메일"
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all duration-200"
                                    required // 필드 비어있을 경우 제출 막음
                                />
                            </div>

                            <div className="relative">
                                {/* 비밀번호 입력 필드 */}
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="비밀번호"
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all duration-200"
                                    required // 필드 비어있을 경우 제출 막음
                                />
                            </div>
                        </div>

                        {/* 에러 메시지 표시 */}
                        {errorMsg && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-red-400 text-sm text-center"
                            >
                                {errorMsg}
                            </motion.p>
                        )}

                        {/* 성공 메시지 표시 */}
                        {successMsg && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-green-400 text-sm text-center"
                            >
                                {successMsg}
                            </motion.p>
                        )}

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center text-white/60">
                                <input type="checkbox" className="mr-2 rounded border-white/20 bg-white/5" />
                                로그인 상태 유지
                            </label>
                            <button type="button" className="text-white/80 hover:text-white transition-colors">
                                비밀번호 찾기
                            </button>
                        </div>

                        {/* 로그인 버튼 */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? '로그인 중...' : '로그인'} {/* 로딩 텍스트 */}
                        </motion.button>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/10"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-transparent text-white/40">또는</span>
                            </div>
                        </div>

                        {/* 소셜 로그인 버튼 (기능은 없음, UI만) */}
                        <div className="grid grid-cols-3 gap-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="button"
                                className="flex items-center justify-center py-2 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                            >
                                <FaGoogle className="text-white text-xl" />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="button"
                                className="flex items-center justify-center py-2 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                            >
                                <FaApple className="text-white text-xl" />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="button"
                                className="flex items-center justify-center py-2 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                            >
                                <FaFacebook className="text-white text-xl" />
                            </motion.button>
                        </div>

                        <p className="text-center text-sm text-white/60">
                            계정이 없으신가요?{' '}
                            <button
                                type="button"
                                onClick={() => router.push('/register')}
                                className="text-white/80 hover:text-white transition-colors"
                            >
                                회원가입
                            </button>
                        </p>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}