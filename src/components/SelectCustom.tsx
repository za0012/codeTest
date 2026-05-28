import { cva, type VariantProps } from "class-variance-authority";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // 컴포넌트 경로 확인
import { cn } from "@/components/ui/utils";

const selectVariants = cva(
  // Base: 테두리(border)를 아예 없애고 인풋과 결이 같은 연한 회색 면으로 채웁니다.
  "flex items-center justify-between gap-2.5 w-full bg-[#f9fafb] text-[#4e5968] font-semibold transition-all outline-none select-none border-0 focus:bg-blue-50/50 data-[state=open]:bg-blue-50/50 data-[state=open]:ring-2 data-[state=open]:ring-blue-500/20 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        // 인풋창(px-4 py-3)과 높이 및 둥글기를 완벽하게 맞춘 대시보드 필터 전용 세팅
        xs: "h-20 text-sm rounded-lg",
        sm2: "w-auto min-w-[100px] h-11 px-4 text-[15px] rounded-xl",
        sm: "h-20 px-4 py-5 text-sm rounded-xl",
        md: "h-20 px-4 py-5.75 text-sm rounded-xl",
        lg: "w-[240px] h-12 px-5 text-lg rounded-2xl",
        full: "w-full h-11 px-4 rounded-xl",
      },
      variant: {
        // 인풋창과 동일한 연회색 배경으로 일체감을 줍니다.
        toss: "bg-[#f9fafb] text-[#4e5968] data-[placeholder]:text-[#4e5968]",
        tossWhite: "bg-white text-[#4e5968] border border-gray-200",
        outline: "border border-gray-200 bg-white hover:bg-gray-50",
        ghost: "border-none bg-transparent hover:bg-gray-100",
      },
    },
    defaultVariants: {
      size: "sm2",
      variant: "toss",
    },
  },
);

interface SelectProps extends VariantProps<typeof selectVariants> {
  selectArray: string[];
  label?: string;
  value?: string;
  placeholder?: string;
  selectChange: (value: string) => void;
  className?: string; // 추가적인 스타일 확장을 위해
}

export default function SelectDemo({
  selectArray,
  label,
  placeholder,
  selectChange,
  size,
  variant,
  className,
}: SelectProps) {
  return (
    <div className={size === "full" ? "w-full" : "w-auto"}>
      {placeholder ? (
        <Select onValueChange={selectChange}>
          {/* placeholder는 SelectValue의 placeholder 속성으로 넣습니다 */}
          <SelectTrigger
            className={cn(selectVariants({ size, variant }), className)}
          >
            <SelectValue placeholder={placeholder} />
            {/* placeholder가있으면호출하도록.. 없으면 첫 번째애로 value선택하게... */}
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              <SelectLabel>{label}</SelectLabel>
              {selectArray?.map((select) => (
                <SelectItem value={select} key={select}>
                  {select}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      ) : (
        <Select onValueChange={selectChange} defaultValue={selectArray[0]}>
          {/* placeholder는 SelectValue의 placeholder 속성으로 넣습니다 */}
          <SelectTrigger
            className={cn(selectVariants({ size, variant }), className)}
          >
            <SelectValue placeholder={placeholder} />
            {/* placeholder가있으면호출하도록.. 없으면 첫 번째애로 value선택하게... */}
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              <SelectLabel>{label}</SelectLabel>
              {selectArray?.map((select) => (
                <SelectItem value={select} key={select}>
                  {select}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
