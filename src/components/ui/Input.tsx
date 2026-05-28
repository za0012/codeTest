import { useId, type InputHTMLAttributes, type PropsWithChildren } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import cn from "@/util/cn";

export const inputVariants = cva(
  `w-full bg-[#F8F9FB] rounded-2xl focus:bg-blue-50 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-300 text-slate-700`,
  {
    variants: {
      variant: {
        default: "border-none shadow-none active:scale-100 text-slate-500",
        white: "bg-white border border-gray-200",
        beige: "bg-[#f9fafb]",
        blue: "bg-[#3581FA] text-white hover:bg-blue-600 shadow-md",
        grey: "bg-slate-100 text-slate-700 hover:bg-slate-200 shadow-none",
        link: "bg-transparent text-blue-600 hover:underline shadow-none p-0 h-auto active:scale-100",
        // [추가] 배경 없고 아이콘 강조에 최적화된 ghost
        ghost:
          "bg-transparent text-slate-400 hover:text-slate-600 shadow-none active:scale-90",
      },
      size: {
        md: "px-6 py-4.5",
        sm: "px-4 py-3 text-[15px] rounded-xl",
        full: "w-full py-3.5 text-lg rounded-2xl",
        icon: "w-10 h-10 p-0 rounded-full",
        xs: "text-xs px-0 py-0",
        normal: "text-sm px-0 py-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export interface InputProps
  extends
    Omit<InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  label?: string;
}

const Input = ({ variant, size, className, label, ...props }: InputProps) => {
  const inputId = useId(); //useId라는 react훅을 사용해서 id 맞춰주기...
  // useId는 고유 Id를 생성하는 역할을 하는 훅이다.
  // useId는 어떠한 매개변수도 받지 않으며 useId를 호출한 특정 컴포넌트오 특정 useId에 관련된 고유 ID문자열을 반환한다.
  // 훅이므로 최상위 혹은 커스텀 훅에서만 호출이 가능하다. 반복문이나 조건문에서는 사용할 수 없다.
  // key를 생성하기 위해 사용하면 안 된다.

  return (
    <div>
      {label && (
        <label
          htmlFor={inputId}
          className="text-[11px] font-bold text-gray-400 mb-2 block uppercase tracking-tight"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(inputVariants({ variant, size, className }))}
        {...props}
      />
    </div>
  );
};

export default Input;
