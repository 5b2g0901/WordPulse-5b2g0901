import React from 'react';

export default function SpeedTyping({ vocabularyData, typingIdx, typingScore, typedInput, setTypedInput, typingStatus, handleTypingSubmit }) {
  const current = vocabularyData[typingIdx];
  if (!current) return null;

  return (
    <div className="w-full max-w-4xl mx-auto border-[8px] border-[#FFC107] bg-white p-12 rounded-[32px] text-center space-y-6 transition-all duration-300">
      
      {/* Header Info */}
      <div className="flex justify-center items-center space-x-2 text-xl font-bold text-gray-700">
        <span>⚡ SPEED TYPING</span>
        <span>🏆 SCORE: {typingScore}</span>
      </div>

      {/* Target Word Question Prompt */}
      <div className="space-y-2">
        <p className="text-gray-500 font-medium text-base">請根據意思拼寫出正確英文單字</p>
        <h3 className="text-3xl font-bold text-gray-800 py-4">👉 {current.meaningZh}</h3>
      </div>

      {/* Input Form Fields */}
      <form onSubmit={handleTypingSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <input
          type="text"
          value={typedInput}
          onChange={(e) => setTypedInput(e.target.value)}
          disabled={typingStatus === 'correct'}
          placeholder="在此輸入英文單字..."
          className="w-full sm:w-80 p-3 rounded-xl border-2 border-gray-300 text-center font-semibold text-lg focus:outline-none"
        />
        <button
          type="submit"
          disabled={typingStatus === 'correct'}
          className="w-full sm:w-auto px-6 py-3 bg-gray-100 hover:bg-gray-200 border-2 border-gray-400 text-gray-800 font-bold rounded-xl text-base transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <span>送出答案</span>
          <span>🚀</span>
        </button>
      </form>

      {/* ================= DYNAMIC FEEDBACK BLOCKS ================= */}
      {/* 1. Correct Answer Banner (Green) */}
      {typingStatus === 'correct' && (
        <div className="w-full mt-6 p-6 bg-[#DCFCE7] border-2 border-[#22C55E] rounded-2xl animate-fade-in">
          <div className="text-2xl mb-1">🥳</div>
          <p className="text-[#16A34A] font-black text-xl">太棒了，答對了！</p>
          <p className="text-gray-700 font-bold mt-1 text-lg">正確答案是 : {current.word}</p>
        </div>
      )}

      {/* 2. Incorrect Answer Banner (Red) */}
      {typingStatus === 'wrong' && (
        <div className="w-full mt-6 p-6 bg-[#FEE2E2] border-2 border-[#EF4444] rounded-2xl animate-shake">
          <div className="text-2xl mb-1">😭</div>
          <p className="text-[#DC2626] font-black text-xl">好可惜，答錯了！</p>
          <p className="text-gray-700 font-bold mt-1 text-lg">正確答案是 : {current.word}</p>
        </div>
      )}
      
    </div>
  );
}