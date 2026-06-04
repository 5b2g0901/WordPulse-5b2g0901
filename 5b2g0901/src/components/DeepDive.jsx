import React from 'react';

export default function DeepDive({ diveIdx, vocabularyData, handleSpeak, getSentenceAnalysis, activeNoteText, setActiveNoteText, saveNote, setDiveIdx }) {
  const current = vocabularyData[diveIdx];
  if (!current) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
      
      {/* Cột trái: Từ vựng nổi bật màu Cam Sữa */}
      <div className="md:col-span-2 bg-[#FFF7ED] border-4 border-[#FFEDD5] p-6 rounded-3xl shadow-[0_8px_0_0_#FFEDD5] space-y-6">
        <div className="flex justify-between items-center bg-white p-4 rounded-2xl border-2 border-[#FFD8A8]">
          <div>
            <span className="text-[10px] font-black bg-[#FFEDD5] text-[#C2410C] px-2.5 py-1 rounded-full uppercase">Current Word</span>
            <h2 className="text-4xl font-black text-[#9A3412] mt-2 tracking-wide">{current.word}</h2>
          </div>
          <button onClick={() => handleSpeak(current.word)} className="w-14 h-14 bg-[#F97316] hover:bg-[#FB923C] rounded-2xl text-xl flex items-center justify-center border-b-4 border-[#C2410C] active:translate-y-0.5 text-white shadow-md">
            🔊
          </button>
        </div>

        {/* Nghĩa & Ví dụ màu Mint nhẹ mắt */}
        <div className="bg-[#ECFDF5] border-2 border-[#A7F3D0] p-4 rounded-2xl">
          <h4 className="text-xs font-black text-[#047857] uppercase mb-1">中文釋義</h4>
          <p className="text-xl font-black text-[#065F46]">{current.meaningZh}</p>
          <hr className="my-3 border-[#A7F3D0]" />
          <h4 className="text-xs font-black text-[#047857] uppercase mb-1">情境例句</h4>
          <p className="text-sm font-bold text-[#064E3B] italic leading-relaxed">"{current.example}"</p>
        </div>

        {/* Phân tích ngữ pháp màu Xanh Lam Nhạt */}
        <div className="bg-[#EFF6FF] border-2 border-[#BFDBFE] p-4 rounded-2xl grid grid-cols-2 gap-4">
          <div>
            <h5 className="text-[10px] font-black text-[#1E40AF] uppercase">詞性標籤</h5>
            <p className="text-xs font-black text-[#1D4ED8] bg-white px-2.5 py-1 rounded-lg border border-[#93C5FD] mt-1 inline-block">
              🏷️ {getSentenceAnalysis(current.word).grammar}
            </p>
          </div>
          <div>
            <h5 className="text-[10px] font-black text-[#1E40AF] uppercase">推薦句型</h5>
            <p className="text-xs font-bold text-[#1E40AF] mt-1">
              💡 {getSentenceAnalysis(current.word).structures[0]}
            </p>
          </div>
        </div>

        {/* Nút lật trang điều hướng */}
        <div className="flex justify-between items-center pt-2">
          <button onClick={() => setDiveIdx(p => Math.max(0, p - 1))} disabled={diveIdx === 0} className="px-4 py-2 bg-white border-2 border-b-4 border-gray-300 rounded-xl font-black text-xs disabled:opacity-30 active:translate-y-0.5">
            ◀ 上一個
          </button>
          <span className="text-xs font-mono font-black text-gray-500 bg-white border-2 border-gray-200 px-3 py-1 rounded-full">
            {diveIdx + 1} / {vocabularyData.length}
          </span>
          <button onClick={() => setDiveIdx(p => Math.min(vocabularyData.length - 1, p + 1))} disabled={diveIdx === vocabularyData.length - 1} className="px-4 py-2 bg-white border-2 border-b-4 border-gray-300 rounded-xl font-black text-xs disabled:opacity-30 active:translate-y-0.5">
            下一個 ▶
          </button>
        </div>
      </div>

      {/* Cột phải: Khối ghi chú màu Vàng Chuối dễ thương */}
      <div className="bg-[#FEFCE8] border-4 border-[#FEF08A] p-5 rounded-3xl shadow-[0_8px_0_0_#FEF08A] flex flex-col justify-between gap-4">
        <div>
          <h3 className="text-sm font-black text-[#854D0E] flex items-center gap-2 mb-3">
            <span>📌</span> 筆記空間
          </h3>
          <textarea
            value={activeNoteText}
            onChange={(e) => setActiveNoteText(e.target.value)}
            placeholder="在此輸入您對該單字的記憶聯想、補充筆記..."
            className="w-full h-44 p-3 bg-white border-2 border-[#FDE047] rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#EAB308] resize-none text-[#713F12]"
          />
        </div>
        <button onClick={saveNote} className="w-full py-3 bg-[#EAB308] hover:bg-[#FACC15] border-b-4 border-[#A16207] active:translate-y-0.5 active:border-b-0 text-white font-black text-xs rounded-xl transition-all uppercase tracking-wider">
          💾 儲存
        </button>
      </div>

    </div>
  );
}