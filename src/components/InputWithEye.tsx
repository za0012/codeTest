// function InputWithEye() {
//   return (
//     <div className="relative">
//       <input
//         {...register("password", {
//           required: "비밀번호는 필수입니다",
//           minLength: {
//             value: 6,
//             message: "비밀번호는 6자 이상이어야 합니다.",
//           },
//         })}
//         type={`${isPasswordHidden ? "password" : "text"}`}
//         onChange={(e) => setPassword(e.currentTarget.value)}
//         value={password}
//         placeholder="비밀번호"
//         className="w-full px-6 py-4.5 bg-[#F8F9FB] border-none rounded-2xl focus:ring-2 focus:bg-blue-50 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-300 text-slate-700"
//       />
//       <button
//         type="button"
//         className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
//         onClick={() => setIsPasswordHidden(!isPasswordHidden)}
//       >
//         {isPasswordHidden ? (
//           <Eye size={20} aria-label={"비밀번호 보기"} />
//         ) : (
//           <EyeOff size={20} aria-label={"비밀번호 숨기기"} />
//         )}
//       </button>
//     </div>
//   );
// }

// export default InputWithEye;
