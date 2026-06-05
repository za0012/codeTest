// import { Pencil, X } from "lucide-react";

// function Modal() {
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 antialiased selection:bg-blue-100">
//       {/* 1. 바깥쪽 카드: 여기 있던 no-scrollbar와 style 속성을 제거했습니다. */}
//       <div className="w-full max-w-lg bg-white rounded-4xl p-8 flex flex-col gap-6 shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
//         Webkit 전용 스크롤바 숨기기 확실한 안전장치 추가
//         <style>{`
//           .no-scrollbar::-webkit-scrollbar { display: none; }
//         `}</style>

//         {/* 헤더 영역 */}
//         <div className="flex items-start justify-between">
//           <div className="flex flex-col gap-1.5 pl-1">
//             <div className="flex items-center gap-2.5">
//               <div className="w-[3.5px] h-6 bg-blue-600 rounded-full" />
//               <h2 className="text-[#191F28] text-2xl font-bold tracking-tight">
//                 프로필 수정
//               </h2>
//             </div>
//             <p className="text-sm font-medium text-gray-400 ml-3.5">
//               스터디원들에게 보여질 나의 정보를 변경해보세요.
//             </p>
//           </div>
//           <button
//             type="button"
//             className="p-2 hover:bg-gray-100 active:bg-gray-200 text-gray-400 hover:text-gray-600 rounded-full transition-colors"
//           >
//             <X size={22} strokeWidth={2.5} />
//           </button>
//         </div>

//         {/* 2. 입력 필드 영역: 실제로 스크롤이 발생하는 여기에 no-scrollbar와 style을 넣어야 합니다! */}
//         <div
//           className="flex flex-col gap-6 max-h-[55vh] overflow-y-auto pb-4 no-scrollbar"
//           style={{
//             msOverflowStyle: "none" /* IE and Edge */,
//             scrollbarWidth: "none" /* Firefox */,
//           }}
//         >
//           {/* 1. 이모지 변경 */}
//           <div className="flex flex-col items-center justify-center gap-2 py-1">
//             <button
//               type="button"
//               className="relative group w-24 h-24 bg-[#F2F4F6] hover:bg-[#E5E8EB] rounded-full flex items-center justify-center text-5xl shadow-inner transition-colors"
//             >
//               🦊
//               <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
//                 <Pencil size={22} strokeWidth={2.5} className="text-white" />
//               </div>
//             </button>
//             <span className="text-xs font-bold text-gray-400 tracking-tight mt-1">
//               이모지 변경
//             </span>
//           </div>

//           {/* 2. 이름 */}
//           <div className="flex flex-col gap-2">
//             <label className="text-[11px] font-extrabold text-blue-600 uppercase tracking-widest ml-1">
//               NAME
//             </label>
//             <input
//               type="text"
//               defaultValue="김민준"
//               placeholder="이름을 입력해주세요"
//               className="w-full px-4 py-4 bg-[#F8F9FA] text-gray-900 font-semibold placeholder-gray-300 rounded-2xl outline-none border border-transparent focus:bg-white focus:border-blue-600/30 focus:ring-4 focus:ring-blue-600/5 transition-all text-sm"
//             />
//           </div>

//           {/* 3. 한 줄 소개 */}
//           <div className="flex flex-col gap-2">
//             <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">
//               BIO
//             </label>
//             <input
//               type="text"
//               defaultValue="알고리즘으로 세상을 바꾸겠어!"
//               placeholder="자신을 한 줄로 소개해보세요"
//               className="w-full px-4 py-4 bg-[#F8F9FA] text-gray-900 font-semibold placeholder-gray-300 rounded-2xl outline-none border border-transparent focus:bg-white focus:border-blue-600/30 focus:ring-4 focus:ring-blue-600/5 transition-all text-sm"
//             />
//           </div>

//           {/* 4. 깃허브 주소 */}
//           <div className="flex flex-col gap-2">
//             <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">
//               GITHUB URL
//             </label>
//             <input
//               type="url"
//               placeholder="https://github.com/username"
//               className="w-full px-4 py-4 bg-[#F8F9FA] text-gray-900 font-semibold placeholder-gray-300 rounded-2xl outline-none border border-transparent focus:bg-white focus:border-blue-600/30 focus:ring-4 focus:ring-blue-600/5 transition-all text-sm"
//             />
//           </div>

//           {/* 5. 블로그 주소 */}
//           <div className="flex flex-col gap-2">
//             <label className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">
//               BLOG URL
//             </label>
//             <input
//               type="url"
//               placeholder="https://velog.io/@username"
//               className="w-full px-4 py-4 bg-[#F8F9FA] text-gray-900 font-semibold placeholder-gray-300 rounded-2xl outline-none border border-transparent focus:bg-white focus:border-blue-600/30 focus:ring-4 focus:ring-blue-600/5 transition-all text-sm"
//             />
//           </div>
//         </div>

//         {/* 하단 저장 버튼 */}
//         <div className="flex flex-col gap-2 pt-2">
//           <button
//             type="button"
//             className="w-full py-4 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold rounded-2xl transition-all text-base tracking-wide"
//           >
//             저장하기
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Modal;
