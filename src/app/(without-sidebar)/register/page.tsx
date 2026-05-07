"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Logo from "@/components/Logo";
import { signUp } from "@/lib/api/auth";
import RegisterPhase1 from "./components/RegisterPhase1";
import RegisterPhase2 from "./components/RegisterPhase2";

interface submitRegisForm {
  emoji: string;
  nickname: string;
  email: string;
  password: string;
}

function page() {
  const [step, setStep] = useState(1);
  const router = useRouter();

  const form = useForm<submitRegisForm>({
    defaultValues: {
      emoji: "",
      nickname: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: submitRegisForm) => {
    const isEmailVail = await form.trigger("email");
    const isPasswordVail = await form.trigger("password");

    if (isEmailVail && isPasswordVail) {
      try {
        await signUp(data.email, data.password, data.nickname, data.emoji);
        alert("회원가입 성공!");
        router.push("/login");
      } catch (error) {
        console.log(error);
      }
    }
  };
  // addProblem(data);
  // setShowAddModal(false);
  // window.location.reload();
  // API 호출 등의 로직

  return (
    <div className="flex-col min-h-screen flex items-center justify-center bg-white p-4">
      {/* <AlertDemo alert={alertData} onClose={closeAlert} /> */}
      <div className="mb-2">
        <Logo size={100} />
      </div>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {step === 1 ? (
            <RegisterPhase1 moveStep={setStep} />
          ) : (
            <RegisterPhase2 moveStep={setStep} />
          )}
        </form>
      </FormProvider>
    </div>
  );
}

export default page;
