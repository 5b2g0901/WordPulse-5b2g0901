import React from 'react';

export default function SpeedTyping({ vocabularyData, typingIdx, typingScore, typedInput, setTypedInput, typingStatus, handleTypingSubmit }) {
  const current = vocabularyData[typingIdx];
  if (!current) return null;

  // Trạng thái gõ Đúng/Sai đổi màu linh hoạt
  let inputBorder = "border-[#E9D5FF] bg-white text-[#5B21B6]";
  if (typingStatus === 'correct') inputBorder = "border-[#34D399] bg-[#E8FCCF] text-[#065F46] animate-pulse";
  if (typingStatus === 'wrong') inputBorder = "border-[#F87171] bg-[#FFE5EC] text-[#9D174D] animate-shake";

  return (
    <div className="max-w-md mx-auto bg-[#FDF4FF] border-4 border-[#F5D0FE] p-6 rounded-3xl shadow-[0_8px_0_0_#F5D0FE] text-center space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <span className="text-xs font-black tracking-wider text-purple-600 bg-[#F3E8FF] px-3 py-1.5 rounded-full border border-[#E9D5FF]">
          ⚡ SPEED TYPING
        </span>
        <span className="text-xs font-black tracking-wider text-fuchsia-600 bg-[#FDF4FF] px-3 py-1.5 rounded-full border border-[#F5D0FE]">
          🏆 SCORE: {typingScore}
        </span>
      </div>

      <div className="py-4 bg-[#F5D0FE]/40 border-2 border-dashed border-[#E879F9] rounded-2xl">
        <p className="text-xs text-fuchsia-500 font-black uppercase tracking-wider mb-1">請根據意思拼寫出正確英文單字</p>
        <h3 className="text-3xl font-black text-[#701A75]">{current.meaningZh}</h3>
      </div>

      <form onSubmit={handleTypingSubmit} className="space-y-3">
        <input
          type="text"
          value={typedInput}
          onChange={(e) => setTypedInput(e.target.value)}
          disabled={typingStatus === 'correct'}
          placeholder="在此輸入英文單字..."
          className={`w-full p-4 rounded-xl border-4 text-center font-black text-lg focus:outline-none transition-all ${inputBorder}`}
        />
        <button
          type="submit"
          disabled={typingStatus === 'correct'}
          className="w-full py-3.5 bg-[#D946EF] hover:bg-[#E879F9] border-b-4 border-[#A21CAF] active:translate-y-0.5 active:border-b-0 text-white font-black rounded-xl text-xs uppercase tracking-wider transition-all"
        >
          送出答案 🚀
        </button>
      </form>
    </div>
  );
}