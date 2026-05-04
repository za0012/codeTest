"use client";

import { useRouter } from "next/navigation";
import { signOut } from "@/lib/api/auth";

function page() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    alert("로그아웃 되었습니다");
    router.push("/login");
  };

  return (
    <div>
      <button type="button" className="bg-violet-300" onClick={handleLogout}>
        로그아웃
      </button>
    </div>
  );
}

export default page;
