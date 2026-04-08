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

export function SelectC() {
  return (
    <div className="w-50 p-4">
      <Select defaultValue="apple">
        {/* 드롭다운의 겉모습 (클릭하는 부분) */}
        <SelectTrigger>
          <SelectValue placeholder="과일을 선택하세요" />
        </SelectTrigger>

        {/* 클릭했을 때 열리는 레이어 */}
        <SelectContent>
          <SelectGroup>
            <SelectLabel>과일 종류</SelectLabel>
            <SelectItem value="apple">사과</SelectItem>
            <SelectItem value="banana">바나나</SelectItem>
            <SelectItem value="blueberry" disabled>
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
