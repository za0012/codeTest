import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useFormContext } from "react-hook-form";
import Button from "@/components/Button";
import Input from "@/components/Input";
import type { phaseType } from "@/lib/types/step";

function RegisterPhase1({ moveStep }: phaseType) {
  const {
    register,
    setValue,
    formState: { errors },
    trigger,
  } = useFormContext();

  const emojis = [
    // 상단: 사람들 많이 쓰고 귀여운 동물 (6개)
    "🦊",
    "🐻",
    "🐼",
    "🐧",
    "🐱",
    "🐹",
    // 하단: 필수 포함 및 무생물/기타 (4개)
    "⭐",
    "👽",
    "🍀",
    "💩",
    "🎸",
    "🌸",
  ];

  const handleClickEmoji = (value: string) => {
    setValue("emoji", value, { shouldValidate: true });
  };

  const handleNextStep = async () => {
    const isNicknameVali = await trigger("nickname");
    const isEmojiVali = await trigger("emoji");

    if (isNicknameVali && isEmojiVali) {
      return moveStep(2);
    }
  };
  return (
    <div className="w-full max-w-100 flex flex-col items-center">
      <Link
        href={"/"}
        className="w-full flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors text-[16px] font-medium mb-4"
      >
        <ArrowLeft size={18} />

        <span>돌아가기</span>
      </Link>
      <div className="w-full mb-10 px-1">
        <h1 className="text-[32px] font-extrabold text-slate-900 mb-3 leading-[1.2]">
          반가워요! 🙌
          <br />
          먼저 자기소개를 해주세요
        </h1>
        <p className="text-slate-400 text-[16px] font-medium">
          스터디원들에게 보이는 이름이에요
        </p>
      </div>

      {/* 폼 섹션 - 입력창 너비 최적화 */}
      <div className="w-full space-y-3">
        <div className="mb-4">
          <p className="mb-4 text-slate-500 text-sm font-extrabold">
            나를 표현하는 이모지
          </p>
          <div className="grid grid-cols-6 gap-2.5">
            {emojis.map((emoji) => (
              <div key={emoji} className="relative">
                <input
                  {...register("emoji", {
                    required: "이모지를 선택해주세요.",
                    minLength: {
                      value: 1,
                      message: "이모지를 선택해주세요.",
                    },
                  })}
                  type="radio"
                  id={emoji}
                  value={emoji}
                  className="peer hidden"
                  onChange={() => handleClickEmoji(emoji)}
                />
                <label
                  htmlFor={emoji}
                  // className="flex h-14.5 w-14.5 cursor-pointer items-center justify-center rounded-2xl bg-slate-50 text-3xl transition-all duration-200
                  //  /* 기본 효과 */
                  //  hover:bg-slate-100 hover:scale-105 active:scale-95
                  //  /* 선택(checked)되었을 때 크기 커짐과 스타일 */
                  //  peer-checked:bg-blue-50 peer-checked:ring-2 peer-checked:ring-blue-500
                  //  peer-checked:scale-110 peer-checked:shadow-md peer-checked:z-10"
                  className={
                    "flex h-14.5 w-14.5 cursor-pointer items-center justify-center rounded-2xl bg-slate-50 text-3xl transition-all duration-200 hover:bg-slate-100 hover:scale-105 active:scale-95 peer-checked:bg-blue-50 peer-checked:ring-2 peer-checked:ring-blue-500 peer-checked:scale-110 peer-checked:shadow-md peer-checked:z-10"
                  }
                >
                  <span className="transition-transform duration-200">
                    {emoji}
                  </span>
                </label>
              </div>
            ))}
          </div>
          {errors.emoji && (
            <p className="mt-2 ml-2 text-red-400">
              {errors.emoji.message?.toString()}
            </p>
          )}
        </div>
        <div>
          <Input
            {...register("nickname", {
              required: "닉네임을 입력해주세요.",
              minLength: { value: 2, message: "최소 2자 이상 입력하세요." },
            })}
            type="text"
            placeholder="이름(닉네임)"
          />
          {errors.nickname && (
            <p className="mt-2 ml-2 text-red-400">
              {errors.nickname.message?.toString()}
            </p>
          )}
        </div>
        <Button
          type="button"
          variant="blue"
          onClick={handleNextStep}
          label="다음"
          size="full2"
        />
      </div>

      {/* 하단 구분선 및 회원가입 */}
      <div className="w-full mt-10 text-center">
        <p className="text-slate-400 text-[15px]">
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
  );
}

export default RegisterPhase1;
