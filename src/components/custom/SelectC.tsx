import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select"; // 컴포넌트가 위치한 경로

interface selectProps {
  placeholder?: string;
  selectLabel?: string;
  selectItem: string[];
  setDefaultValue?: boolean;
  // value?: string | null; // 추가
  onSelect: (item: string) => void;
}

export function SelectC({
  placeholder,
  selectLabel,
  selectItem,
  setDefaultValue,
  // value,
  onSelect,
}: selectProps) {
  // const controlledValue = value ?? undefined;
  const resetKey = selectItem[0] || "empty";
  // console.log(value);
  // console.log(onSelect);
  return setDefaultValue ? (
    <div className="w-full">
      <Select
        key={resetKey}
        defaultValue={selectItem[0]}
        onValueChange={onSelect}
        // value={selectItem[0]}
      >
        <SelectTrigger className="data-placeholder:text-xs">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{selectLabel}</SelectLabel>
            {selectItem.map((select) => (
              <SelectItem key={select} value={select}>
                {select}
              </SelectItem>
              //disabled.. {select.isDisabled}
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  ) : (
    <div className="w-full">
      {/*  value={controlledValue} */}
      <Select value={undefined} onValueChange={onSelect}>
        <SelectTrigger className="data-placeholder:text-xs">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{selectLabel}</SelectLabel>
            {selectItem.map((select) => (
              <SelectItem key={select} value={select}>
                {select}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
  // return (
  //   <div className="w-full">
  //     <Select
  //       // ❌ defaultValue 제거 — value와 혼용 불가
  //       value={controlledValue}
  //       onValueChange={onSelect}
  //     >
  //       <SelectTrigger>
  //         <SelectValue placeholder={placeholder} />
  //       </SelectTrigger>
  //       <SelectContent>
  //         <SelectGroup>
  //           <SelectLabel>{selectLabel}</SelectLabel>
  //           {selectItem.map((select, i) => (
  //             <SelectItem key={select} value={select}>
  //               {select}
  //             </SelectItem>
  //           ))}
  //         </SelectGroup>
  //       </SelectContent>
  //     </Select>
  //   </div>
  // );
}

export function SelectA() {
  return (
    <div className="w-50 p-4">
      <Select defaultValue="apple">
        <SelectTrigger>
          <SelectValue placeholder="과일을 선택하세요" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>과일 종류</SelectLabel>
            <SelectItem value="apple">사과</SelectItem>
            <SelectItem value="banana">바나나</SelectItem>
            <SelectItem value="blue-berry" disabled>
              블루베리 (품절)
            </SelectItem>
            <SelectItem value="grapes">포도</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

export function ControlledSelect() {
  const [value, setValue] = useState("");

  return (
    <div className="flex flex-col gap-4">
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger className="w-45">
          <SelectValue placeholder="테마 선택" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">라이트 모드</SelectItem>
          <SelectItem value="dark">다크 모드</SelectItem>
          <SelectItem value="system">시스템 설정</SelectItem>
        </SelectContent>
      </Select>

      <p className="text-sm text-muted-foreground">
        선택된 값: <strong>{value}</strong>
      </p>
    </div>
  );
}
