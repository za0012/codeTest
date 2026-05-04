"use client";

import Button from "@/components/Button";
import Logo from "@/components/Logo";
import { signIn } from "@/lib/api/auth";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

function page() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleFill = () => {
    setEmail("test123@test.com");
    setPassword("test123!@");
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      return console.log("모든 필드를 채워주세요");
    }
    try {
      const res = await signIn(email, password);
      console.log(res.session.access_token);
      console.log(res.session.user.user_metadata);
      alert("로그인 성공");
      router.push("/home");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-100 flex flex-col items-center">
        <Link
          href={"/"}
          className="w-full flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors text-[16px] font-medium mb-4"
        >
          <ArrowLeft size={18} />

          <span>About Us</span>
        </Link>

        {/* 상단 로고 섹션 */}
        {/* <div className="flex flex-col items-center mb-10">
          <Logo />
        </div> */}
        <div className="w-full mb-10 px-1">
          <h1 className="text-[32px] font-extrabold text-slate-900 mb-3 leading-[1.2]">
            다시 만나서 <br /> 반가워요 👋
          </h1>
          <p className="text-slate-400 text-[16px] font-medium">
            로그인하고 오늘의 문제를 풀어봐요
          </p>
        </div>

        {/* 폼 섹션 - 입력창 너비 최적화 */}
        <form className="w-full space-y-3" onSubmit={onSubmit}>
          <div className="relative">
            <input
              type="email"
              onChange={(e) => setEmail(e.currentTarget.value)}
              value={email}
              placeholder="이메일"
              className="w-full px-6 py-4.5 bg-[#F8F9FB] border-none rounded-2xl focus:ring-2 focus:bg-blue-50 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-300 text-slate-700"
            />
          </div>

          <div className="relative">
            <input
              type={`${isPasswordVisible ? "password" : "text"}`}
              onChange={(e) => setPassword(e.currentTarget.value)}
              value={password}
              placeholder="비밀번호"
              className="w-full px-6 py-4.5 bg-[#F8F9FB] border-none rounded-2xl focus:ring-2 focus:bg-blue-50 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-300 text-slate-700"
            />
            <button
              type="button"
              className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              {isPasswordVisible ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all mt-4 text-lg"
          >
            로그인
          </button>
        </form>

        {/* 데모 계정 채우기 - 깔끔한 스타일로 추가 */}
        <div className="w-full mt-5 p-5 bg-slate-50 rounded-2xl">
          <p className="text-sm text-slate-500 font-normal">
            테스트 계정으로 빠르게 시작하기
          </p>
          <Button
            type="button"
            variant="link"
            size="normal"
            label="데모 계정 채우기 →"
            onClick={handleFill}
          />
        </div>

        {/* 하단 구분선 및 회원가입 */}
        <div className="w-full mt-10 text-center">
          <div className="relative flex items-center justify-center mb-8">
            <div className="absolute w-full h-px bg-slate-100"></div>
            <span className="relative px-4 bg-white text-slate-300 text-xs font-medium">
              또는
            </span>
          </div>

          <p className="text-slate-400 text-[15px]">
            아직 계정이 없으신가요?
            <Link
              href="/register"
              className="text-blue-600 font-bold ml-2 hover:underline"
            >
              회원가입
            </Link>
          </p>
        </div>
      </div>
      {/* alert 팝업!! */}
      {/* <AlertDemo alert={alertData} onClose={closeAlert} /> */}
    </div>
  );
}

export default page;
