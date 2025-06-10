'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
// 새로운 디자인에 필요한 라이브러리 임포트
import { FaGoogle, FaApple, FaFacebook } from 'react-icons/fa'; // 소셜 로그인 아이콘 (실제 기능 추가 안 할 거면 삭제 가능)
import { motion } from 'framer-motion'; // 애니메이션 라이브러리
import { BsLightningCharge } from 'react-icons/bs'; // 로고 아이콘

export default function RegisterPage() {
    const router = useRouter();

    // --- 기존 회원가입 로직의 상태들 그대로 유지 ---
    const [username, setUsername] = useState(''); // 이메일 ID 부분 (예: user123)
    const [emailDomain, setEmailDomain] = useState(''); // 이메일 도메인 (예: gmail.com)
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가 (UI 제어용)


    // --- 기존 handleSubmit 함수 로직을 handleRegister로 변경 및 유지 ---
    const handleRegister = async (e: React.FormEvent) => { // 이름 변경
        e.preventDefault(); // 기본 폼 제출 동작 방지

        setIsLoading(true); // 로딩 시작
        setErrorMsg('');    // 에러 메시지 초기화
        setSuccessMsg('');  // 성공 메시지 초기화

        if (password !== confirmPassword) { // 비밀번호 일치 여부 검증
            setErrorMsg('비밀번호가 일치하지 않습니다.');
            setIsLoading(false); // 로딩 종료
            return;
        }

        const fullEmail = username && emailDomain ? `${username}@${emailDomain}` : '';
        if (!fullEmail) { // 이메일이 완전하지 않으면 에러
            setErrorMsg('이메일을 올바르게 입력해주세요.');
            setIsLoading(false);
            return;
        }

        try {
            console.log('회원가입 시도:', { username: fullEmail, password }); // fullEmail 사용

            const res = await fetch(`/api/join`, { // 기존 '/api/join' 엔드포인트 유지
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: fullEmail, password }), // fullEmail과 password 전송
                credentials: 'include',
            });

            // JSON 파싱 오류 방지를 위한 개선된 응답 처리 로직 유지 (LoginPage와 동일)
            const responseText = await res.text();
            console.log('서버 응답 텍스트 (raw):', responseText);

            let data;
            if (responseText.length === 0) {
                console.error('회원가입 에러: 서버 응답이 비어있습니다.');
                setErrorMsg('서버로부터 응답을 받지 못했습니다. (빈 응답)');
                setIsLoading(false);
                return;
            }
            if (!responseText.startsWith('{') && !responseText.startsWith('[')) {
                console.error('회원가입 에러: 서버 응답이 유효한 JSON 형식이 아닙니다.');
                setErrorMsg(`서버 응답 형식 오류: ${responseText.substring(0, 100)}...`);
                setIsLoading(false);
                return;
            }
            try {
                data = JSON.parse(responseText);
            } catch (jsonParseError) {
                console.error('JSON 파싱 오류:', jsonParseError);
                console.error('서버 응답 텍스트:', responseText);
                setErrorMsg(`서버 응답 파싱 오류: ${responseText.substring(0, 100)}...`);
                setIsLoading(false);
                return;
            }

            console.log('서버 응답 (파싱됨):', data);

            if (res.ok) {
                setSuccessMsg('회원가입 성공! 로그인 페이지로 이동합니다.');
                setTimeout(() => router.push('/login'), 1500); // 1.5초 후 로그인 페이지로 이동
            } else {
                console.error('회원가입 실패:', data.error || '알 수 없는 오류');
                setErrorMsg(data.error || '회원가입 실패');
            }
        } catch (error) {
            console.error('회원가입 에러 (네트워크/예상치 못한):', error);
            setErrorMsg('서버 연결 오류가 발생했습니다.');
        } finally {
            setIsLoading(false); // 로딩 종료
        }
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center p-4 relative overflow-hidden">
            {/* 배경 디자인 요소들 (LoginPage와 동일) */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent opacity-50"></div>
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
                        <p className="text-white/60">새로운 계정 만들기</p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-6"> {/* handleSubmit 대신 handleRegister 사용 */}
                        <div className="space-y-4">
                            {/* 이메일 입력 필드: username과 emailDomain으로 분리된 기존 방식 */}
                            <div className="relative">
                                <label htmlFor="username" className="block text-sm font-medium text-white/70 mb-1">
                                    이메일
                                </label>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <input
                                        id="username"
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        placeholder="이메일 아이디"
                                        className="sm:flex-grow w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all duration-200"
                                    />
                                    <span className="self-center text-white/70">@</span>
                                    <select
                                        value={emailDomain}
                                        onChange={(e) => setEmailDomain(e.target.value)}
                                        className="sm:w-auto px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all duration-200"
                                    >
                                        <option value="" className="bg-gray-800 text-white/70">도메인 선택</option>
                                        <option value="gmail.com" className="bg-gray-800 text-white">gmail.com</option>
                                        <option value="naver.com" className="bg-gray-800 text-white">naver.com</option>
                                        <option value="daum.net" className="bg-gray-800 text-white">daum.net</option>
                                        {/* 다른 도메인 추가 가능 */}
                                    </select>
                                </div>
                            </div>

                            {/* 비밀번호 입력 필드 */}
                            <div className="relative">
                                <label htmlFor="password" className="block text-sm font-medium text-white/70 mb-1">
                                    비밀번호
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="비밀번호"
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all duration-200"
                                />
                            </div>

                            {/* 비밀번호 확인 입력 필드 */}
                            <div className="relative">
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/70 mb-1">
                                    비밀번호 확인
                                </label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    placeholder="비밀번호 재확인"
                                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all duration-200"
                                />
                                <p className="text-xs text-white/50 mt-1">
                                    6~20자 / 영문 대문자, 소문자, 숫자, 특수문자 중 2가지 이상 조합
                                </p>
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

                        {/* 회원가입 버튼 */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? '처리 중...' : '회원가입'} {/* 로딩 텍스트 */}
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
                            이미 계정이 있으신가요?{' '}
                            <button
                                type="button"
                                onClick={() => router.push('/login')}
                                className="text-white/80 hover:text-white transition-colors"
                            >
                                로그인
                            </button>
                        </p>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}