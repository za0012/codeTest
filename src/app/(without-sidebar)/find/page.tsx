"use client";

import { useState } from "react";
import Logo from "@/components/ui/Logo";
import FirstStep from "./component/FirstStep";
import JoinStudy from "./component/JoinStudy";
import MakeStudy from "./component/MakeStudy";

function page() {
  const [step, setStep] = useState(0);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <div className="mb-2">
        <Logo size={100} />
      </div>
      {step === 0 ? (
        <FirstStep moveStep={setStep} />
      ) : step === 1 ? (
        <JoinStudy moveStep={setStep} />
      ) : (
        <MakeStudy moveStep={setStep} />
      )}
    </div>
  );
}

export default page;
