import {
  SelectA,
  ControlledSelect,
  SelectC,
} from "@/components/custom/SelectC";
import { useState } from "react";

function UiTest() {
  const [test, setTest] = useState<string | null>(null);
  const [selectKey, setSelectKey] = useState(0);

  const handleClear = () => {
    setTest(null);
    setSelectKey((prev) => prev + 1); // key 변경 → 리마운트
  };

  return (
    <div className="bg-white h-screen">
      <div className="w-60 mt-10 ml-10">
        <SelectC
          key={selectKey}
          selectItem={["aaa", "bbb", "ccc", "dddd", "eeee", "ffff", "ggg"]}
          placeholder="테스트"
          value={test}
          onSelect={setTest}
        />
        <p className="text-2xl text-blue-500">{test}</p>
        <button
          className="bg-violet-400 text-white px-5 py-2 rounded-lg"
          type="button"
          onClick={handleClear}
        >
          초기화
        </button>
      </div>
      <SelectA />
      <ControlledSelect />
    </div>
  );
}

export default UiTest;
