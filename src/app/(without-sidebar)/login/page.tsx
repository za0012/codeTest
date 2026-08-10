"use client";

import { useSetAtom } from "jotai";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Logo from "@/components/ui/Logo";
import { signIn } from "@/lib/api/auth";
import { getMyStudyInfo } from "@/lib/api/study";
import { alertAtom } from "@/lib/store/alertStore";

interface loginType {
  email: string;
  password: string;
}

// 데모 계정은 소스에 두지 않고 .env에서 읽는다.
// 값이 없으면 아래 '데모 계정 채우기' 블록 자체를 렌더하지 않는다.
const DEMO_EMAIL = process.env.NEXT_PUBLIC_DEMO_EMAIL;
const DEMO_PASSWORD = process.env.NEXT_PUBLIC_DEMO_PASSWORD;
const isDemoFillAvailable =
  process.env.NODE_ENV === "development" && !!DEMO_EMAIL && !!DEMO_PASSWORD;

function page() {
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);
  const router = useRouter();
  const setAlert = useSetAtom(alertAtom);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<loginType>();

  const handleFill = () => {
    if (!DEMO_EMAIL || !DEMO_PASSWORD) return;
    setValue("email", DEMO_EMAIL);
    setValue("password", DEMO_PASSWORD);
  };

  const onSubmit = async (data: loginType) => {
    try {
      await signIn(data.email, data.password);
      const study = await getMyStudyInfo();
      console.log(study);
      router.replace(study ? "/home" : "/find");
    } catch {
      return setAlert({
        title: "로그인 실패",
        content: "이메일 또는 비밀번호를 확인해주세요",
        variant: true,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-100 flex flex-col items-center">
        {/* 상단 로고 섹션 */}
        <div className="flex flex-col items-center mb-2">
          <Logo size={100} />
        </div>
        <Link
          href={"/"}
          className="w-full flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors text-[16px] font-medium mb-4"
        >
          <ArrowLeft size={18} />

          <span>About Us</span>
        </Link>

        <div className="w-full mb-10 px-1">
          <h1 className="text-[32px] font-extrabold text-slate-900 mb-3 leading-[1.2]">
            다시 만나서 <br /> 반가워요
          </h1>
          <p className="text-slate-400 text-[16px] font-medium">
            로그인하고 오늘의 문제를 풀어봐요
          </p>
        </div>

        {/* 폼 섹션 - 입력창 너비 최적화 */}
        <form className="w-full space-y-3" onSubmit={handleSubmit(onSubmit)}>
          <div className="relative">
            <Input
              {...register("email", {
                required: "이메일은 필수입니다",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "이메일 형식이 아닙니다",
                },
              })}
              type="email"
              placeholder="이메일"
            />
          </div>
          {errors.email && (
            <p className="ml-2 text-red-400 text-sm">
              {errors.email?.message?.toString()}
            </p>
          )}
          <div className="relative">
            <Input
              {...register("password", {
                required: "비밀번호는 필수입니다",
                minLength: {
                  value: 6,
                  message: "비밀번호는 6자 이상이어야 합니다.",
                },
              })}
              type={`${isPasswordHidden ? "password" : "text"}`}
              placeholder="비밀번호"
            />
            <button
              type="button"
              aria-label={
                isPasswordHidden ? "비밀번호 보기" : "비밀번호 숨기기"
              }
              className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
              onClick={() => setIsPasswordHidden(!isPasswordHidden)}
            >
              {isPasswordHidden ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className="ml-2 text-red-400 text-sm">
              {errors.password?.message?.toString()}
            </p>
          )}
          <div className="mb-5"></div>
          <Button type="submit" variant="blue" size="full2" label="로그인" />
        </form>

        {/* 데모 계정 채우기 - dev이면서 .env에 데모 계정이 있을 때만 노출 */}
        {isDemoFillAvailable && (
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
        )}
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
    </div>
  );
}

export default page;
