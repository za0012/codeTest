import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // 컴포넌트 경로 확인

interface SelectProps {
  selectArray: string[];
  label?: string;
  value?: string;
  placeholder?: string;
  selectChange: React.Dispatch<React.SetStateAction<string>>;
  // selectChange: () => void;
  size?: string;
}

export default function SelectDemo({
  selectArray,
  label,
  value,
  placeholder,
  selectChange,
  size,
}: SelectProps) {
  return (
    <div className={`${size}`}>
      <Select onValueChange={selectChange}>
        {/* placeholder는 SelectValue의 placeholder 속성으로 넣습니다 */}
        <SelectTrigger className="w-full">
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
    </div>
  );
}
