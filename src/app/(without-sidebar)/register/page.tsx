"use client";

import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Logo from "@/components/Logo";
import { signUp } from "@/lib/api/auth";
// import { useRouter } from "next/router";

function page() {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
  const [hide, setHide] = useState(true);
  const [hide2, setHide2] = useState(true);

  // const router = useRouter();

  const handleFillRef = () => {
    setNickname("콩쥐땃쥐");
    setEmail("test123@test.com");
    setPassword("test123!@");
    setCheckPassword("test123!@");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== checkPassword) {
      return console.log("비밀번호가 불일치입니다.");
    }
    if (!nickname || !email || !password) {
      return console.log("모든 필드를 채워주세요");
    }
    try {
      await signUp(email, password, nickname);
      alert("회원가입 성공!");
      // router.push("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-dvh p-4">
      <div className="w-full max-w-110 mb-3">
        <Link
          href="/"
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors text-[16px] font-medium"
        >
          <ArrowLeft size={18} />
          <span>돌아가기</span>
        </Link>
      </div>
      <div className="w-full max-w-md bg-white rounded-3xl p-9.5 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
        <div className="mb-4">
          <Logo />
        </div>
        <div className="mb-8">
          <h3 className="text-[28px] font-black text-slate-900 leading-tight">
            잡동사니에 오신 걸 환영해요
          </h3>
          <p className="text-slate-400 mt-2 font-medium">
            새 계정을 만들어보세요
          </p>
        </div>
        <form className="space-y-1" onSubmit={handleSubmit}>
          <div className="space-y-2 mb-4">
            <p className="text-sm font-bold text-slate-700 ml-1 mb-2">닉네임</p>
            <input
              type="text"
              onChange={(e) => setNickname(e.currentTarget.value)}
              placeholder="콩쥐땃쥐"
              value={nickname}
              className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-300 text-slate-700"
            />
          </div>
          <div className="space-y-2 mb-4">
            <p className="text-sm font-bold text-slate-700 ml-1 mb-2">이메일</p>
            <input
              type="email"
              onChange={(e) => setEmail(e.currentTarget.value)}
              placeholder="example@email.com"
              value={email}
              className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-300 text-slate-700"
            />
          </div>
          <div className="space-y-2 mb-2">
            <p className="text-sm font-bold text-slate-700 ml-1 mb-2">
              비밀번호
            </p>
            <div className="relative">
              <input
                type={`${hide ? "password" : "text"}`}
                placeholder="6자 이상 입력하세요"
                onChange={(e) => setPassword(e.currentTarget.value)}
                value={password}
                className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-300 text-slate-700"
              />
              <button
                type="button"
                onClick={() => setHide(!hide)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {hide ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
          </div>
          <div className="space-y-2 mb-4">
            <p className="text-sm font-bold text-slate-700 ml-1 mb-2">
              비밀번호 확인
            </p>
            <div className="relative">
              <input
                type={`${hide2 ? "password" : "text"}`}
                placeholder="비밀번호를 다시 입력하세요"
                onChange={(e) => setCheckPassword(e.currentTarget.value)}
                value={checkPassword}
                className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-300 text-slate-700"
              />
              <button
                type="button"
                onClick={() => setHide2(!hide2)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {hide2 ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3.5 bg-[#3581FA] text-white rounded-2xl font-bold text-lg hover:bg-blue-600 transition-all mt-4"
          >
            회원가입
          </button>
        </form>
        <div className="mt-5 p-5 bg-slate-50 rounded-2xl">
          <p className="text-sm text-slate-500 font-normal">
            테스트 계정으로 빠르게 회원가입하기
          </p>
          <button
            type="button"
            className="text-blue-600 text-sm font-bold mt-1 hover:underline flex items-center gap-1"
            onClick={handleFillRef}
          >
            데모 계정 채우기 →
          </button>
        </div>
        <div className="mt-8 text-center">
          <p className="text-slate-400 font-normal text-sm">
            이미 계정이 있으신가요?
            <Link
              href="/login"
              className="text-blue-600 font-bold ml-2 hover:underline"
            >
              로그인
            </Link>
          </p>
        </div>
      </div>
      {/* <AlertDemo alert={alertData} onClose={closeAlert} /> */}
    </div>
  );
}

export default page;
