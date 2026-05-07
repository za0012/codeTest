// import Logo from "@/components/Logo";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import type { phaseType } from "@/lib/types/step";

function RegisterPhase2({ moveStep }: phaseType) {
  const [hide, setHide] = useState(true);
  // const [hide2, setHide2] = useState(true);

  const {
    register,
    formState: { errors },
    trigger,
    watch,
  } = useFormContext();

  const emoji = watch("emoji");
  const nickname = watch("nickname");

  return (
    <div className="w-full sm:min-w-75 md:min-w-100 lg:min-w-100 flex flex-col items-center">
      {/* 뒤로 가기 버튼 */}
      <button
        type="button"
        className="w-full flex items-center gap-2 text-slate-400 hover:text-slate-700 transition-colors text-[15px] font-medium mb-6 group"
        onClick={() => moveStep(1)}
      >
        <ArrowLeft
          size={18}
          className="group-hover:-translate-x-1 transition-transform"
        />
        <span>이전 단계로</span>
      </button>

      {/* 상단 프로필 카드: 더 고급스럽게 */}
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
          className="relative overflow-hidden w-full rounded-2xl p-5 flex items-center mb-8 bg-linear-to-br from-[#fcfdff] to-[#f1f7fd] border border-white"
        >
          {/* 장식용 배경 원형 (유리창 느낌) */}
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-100/30 rounded-full blur-2xl" />

          <div className="relative bg-white text-3xl w-16 h-16 flex items-center justify-center rounded-full mr-4 shadow-[0_4px_12px_rgba(0,0,0,0.04)] border border-slate-50">
            <motion.p
              whileHover={{ y: -5, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {emoji}
            </motion.p>
          </div>

          <div className="relative flex flex-col">
            <span className="text-[13px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg w-fit mb-1">
              새 멤버
            </span>
            <p className="text-lg font-extrabold text-slate-800 leading-none">
              {nickname}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* 타이틀 섹션 */}
      <div className="w-full mb-8">
        <h1 className="text-[30px] font-black text-slate-900 mb-2 tracking-tight leading-tight">
          거의 다 됐어요! <span className="text-blue-600">.</span>
        </h1>
        <p className="text-slate-400 text-[16px] font-medium tracking-tight">
          보안을 위해 계정 정보를 입력해주세요.
        </p>
      </div>

      {/* 폼 섹션 */}
      <div className="w-full space-y-4">
        <input
          {...register("email", {
            required: "이메일을 입력해주세요",
          })}
          type={"email"}
          placeholder={"이메일"}
          className="w-full px-6 py-4.5 bg-[#F8F9FB] border-none rounded-2xl focus:bg-blue-50 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-300 text-slate-700"
        />
        {errors.email && (
          <p className="mt-2 ml-2 text-red-400">
            {errors.email.message?.toString()}
          </p>
        )}
        <div className="relative">
          <input
            {...register("password", {
              required: "비밀번호를 입력해주세요",
              minLength: { value: 6, message: "최소 6자 이상 입력하세요." },
            })}
            type={hide ? "password" : "text"}
            placeholder={"비밀번호"}
            className="w-full px-6 py-4.5 bg-[#F8F9FB] border-none rounded-2xl focus:bg-blue-50 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-300 text-slate-700"
          />
          <button
            type="button"
            className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
            onClick={() => setHide(!hide)}
          >
            {hide ? <Eye size={22} /> : <EyeOff size={22} />}
          </button>
        </div>
        {errors.password && (
          <p className="mt-2 ml-2 text-red-400">
            {errors.password.message?.toString()}
          </p>
        )}
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-[22px] mt-4 text-lg"
        >
          가입하기
        </motion.button>
      </div>
      <p>test789@test.com, test789!@</p>
    </div>
  );
}

export default RegisterPhase2;
