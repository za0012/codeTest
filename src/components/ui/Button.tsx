import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes, FC } from "react";
import cn from "@/util/cn";

export const ButtonVariants = cva(
  `
  flex justify-center items-center active:scale-95 transition-all duration-200
  disabled:opacity-50 disabled:pointer-events-none font-bold
  `,
  {
    variants: {
      variant: {
        default: "shadow-none active:scale-100 text-slate-500",
        blue: "bg-blue-600 text-white hover:bg-blue-700 shadow-md",
        grey: "bg-slate-100 text-slate-700 hover:bg-slate-200 shadow-none",
        link: "bg-transparent text-blue-600 hover:underline shadow-none p-0 h-auto active:scale-100",
        // [추가] 배경 없고 아이콘 강조에 최적화된 ghost
        ghost:
          "bg-transparent text-slate-s400 hover:text-slate-600 shadow-none active:scale-90",
      },
      size: {
        md: "w-[6.875rem] h-[2.375rem] text-[1rem] rounded-xl",
        sm: "px-4 py-2 text-sm rounded-lg",
        full: "w-full py-3.5 text-lg rounded-2xl",
        full2: "w-full py-4 text-lg rounded-2xl",
        // [추가] 아이콘 버튼용 (정사각형)
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

interface ButtonProps
  extends
    ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof ButtonVariants> {
  label?: string;
  children?: React.ReactElement;
}

const Button: FC<ButtonProps> = ({
  variant,
  size,
  children,
  label,
  ...props
}) => {
  return (
    <button className={cn(ButtonVariants({ variant, size }))} {...props}>
      {children && children}
      {label && label}
    </button>
  );
};

export default Button;
