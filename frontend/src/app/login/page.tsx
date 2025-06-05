'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [jwtToken, setJwtToken] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await fetch(`/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ username, password }),
        });

        if (res.ok) {
            // const data = await res.json();
            const token = res.headers.get('Authorization')!.split(' ')[1];
            // const token = res.headers.get('Authorization')!;
            setSuccessMsg('로그인 성공! 대시보드로 이동합니다.');


            // const token = data.token; // 서버에서 token을 JSON 응답으로 받는다고 가정
            setJwtToken(token); // 토큰 상태 업데이트
            localStorage.setItem("token", token);

            // 콘솔에 JWT 토큰 출력
            console.log('JWT Token:', token);
            setTimeout(() => router.push('/dashboard'), 1500);
        } else {
            const data = await res.json();
            setErrorMsg(data.error || '로그인 실패');
        }
    };

    return (
        <div
            className="h-screen w-screen bg-cover bg-center flex items-center justify-center"
            style={{
                backgroundImage: "url('/login/logincar.jpeg')",
            }}
        >
            <form
                onSubmit={handleLogin}
                className="w-full max-w-md bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/20"
            >
                <h2 className="text-2xl text-white font-semibold text-center mb-6">Login</h2>

                <div className="mb-4">
                    <label className="block text-white text-sm mb-1">Email</label>
                    <input
                        type="email"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full px-4 py-2 rounded bg-white/20 text-white placeholder-white/60 border-b border-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-white text-sm mb-1">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full px-4 py-2 rounded bg-white/20 text-white placeholder-white/60 border-b border-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <div className="flex items-center justify-between mb-4">
                    <label className="text-sm text-white">
                        <input type="checkbox" className="mr-1" />
                        Remember me
                    </label>
                    <span className="text-sm text-blue-300 cursor-pointer">Forgot password?</span>
                </div>

                <button
                    type="submit"
                    className="w-full py-2 text-white font-semibold rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 transition"
                >
                    Login
                </button>

                <p className="text-center text-sm text-white mt-4">
                    Don’t have an account? <span className="text-blue-300 underline cursor-pointer">Register</span>
                </p>
            </form>
        </div>
    );
}
