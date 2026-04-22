function page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-dvh p-4">
      <div className="w-full max-w-110 mb-6">
        {/* <Link
          to="/"
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors text-[16px] font-medium"
        > */}
        {/* <ArrowLeft size={18} /> */}
        <span>돌아가기</span>
        {/* </Link> */}
      </div>
      <div className="w-full max-w-md bg-white rounded-3xl p-9.5 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
        <div className="mb-8">{/* <Logo /> */}</div>
        <div className="mb-8">
          <h3 className="text-[28px] font-black text-slate-900 leading-tight">
            다시 만나서 반가워요
          </h3>
          <p className="text-slate-400 mt-2 font-medium">계정에 로그인하세요</p>
        </div>
        <form className="space-y-1">
          <div className="space-y-2 mb-4">
            <p className="text-sm font-bold text-slate-700 ml-1 mb-2">이메일</p>
            <input
              type="email"
              //   ref={emailRef}
              placeholder="example@email.com"
              className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-300 text-slate-700"
            />
          </div>
          <div className="space-y-2 mb-2">
            <p className="text-sm font-bold text-slate-700 ml-1 mb-2">
              비밀번호
            </p>
            <div className="relative">
              <input
                // type={`${isPasswordVisible ? "password" : "text"}`}
                // ref={passwordRef}
                placeholder="비밀번호를 입력하세요"
                className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-300 text-slate-700"
              />
              {/* <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600" // 위치만 지정
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                {isPasswordVisible ? <Eye size={20} /> : <EyeOff size={20} />}
              </Button> */}
            </div>
          </div>
          {/* <Button
            type="submit"
            size="full"
            variant={"blue"}
            label={isLoading ? "로그인 중 ..." : "로그인"}
          /> */}
        </form>
        <div className="mt-5 p-5 bg-slate-50 rounded-2xl">
          <p className="text-sm text-slate-500 font-normal">
            테스트 계정으로 빠르게 시작하기
          </p>
          {/* <Button
            type="button"
            variant="link"
            size="normal"
            label="데모 계정 채우기 →"
            onClick={handleFillRef}
          /> */}
        </div>
        <div className="mt-8 text-center">
          <p className="text-slate-400 font-normal text-sm">
            계정이 없으신가요?
            {/* <Link
              to="/register"
              className="text-blue-600 font-bold ml-2 hover:underline"
            > */}
            회원가입
            {/* </Link> */}
          </p>
        </div>
      </div>
      {/* alert 팝업!! */}
      {/* <AlertDemo alert={alertData} onClose={closeAlert} /> */}
    </div>
  );
}

export default page;
