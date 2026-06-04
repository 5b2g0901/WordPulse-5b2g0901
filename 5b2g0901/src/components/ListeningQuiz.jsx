import React from 'react';

export default function ListeningQuiz({ 
  vocabularyData, 
  listeningIdx, 
  setListeningIdx, 
  speechRate, 
  setSpeechRate, 
  handleSpeak 
}) {
  
  const current = vocabularyData[listeningIdx];
  if (!current) return null;

  const handlePrev = () => {
    if (listeningIdx > 0) {
      setListeningIdx(listeningIdx - 1);
    } else {
      setListeningIdx(vocabularyData.length - 1);
    }
  };

  const handleNext = () => {
    if (listeningIdx < vocabularyData.length - 1) {
      setListeningIdx(listeningIdx + 1);
    } else {
      setListeningIdx(0);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto border-[8px] border-[#FFC107] bg-white p-8 rounded-[32px] text-center space-y-6">
      
      {/* Thanh chỉnh tốc độ & Chọn nhanh từ */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-purple-50 p-4 rounded-2xl border border-purple-200">
        <div className="flex items-center space-x-2 text-gray-700 font-bold">
          <span>語速調節:</span>
          <input 
            type="range" 
            min="0.5" 
            max="1.5" 
            step="0.05" 
            value={speechRate} 
            onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
            className="w-32 accent-purple-600"
          />
          <span className="text-sm bg-white px-2 py-0.5 rounded border border-purple-300">
            {speechRate}x
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-sm font-black text-purple-700">📋 切換單字:</label>
          <select
            value={listeningIdx}
            onChange={(e) => setListeningIdx(Number(e.target.value))}
            className="p-2 border-2 border-purple-300 rounded-xl font-bold text-sm bg-white text-gray-700 focus:outline-none"
          >
            {vocabularyData.map((item, index) => (
              <option key={index} value={index}>
                {index + 1}. {item.word}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Khu vực phát âm */}
      <div className="py-8 bg-pink-50/50 border-4 border-double border-pink-200 rounded-2xl space-y-6">
        <button 
          onClick={() => handleSpeak(current.word)}
          className="p-4 bg-white hover:bg-pink-100 border-2 border-pink-400 rounded-xl shadow-sm text-2xl"
        >
          📢
        </button>

        <h2 className="text-4xl font-black text-purple-900 tracking-wide">
          {current.word}
        </h2>

        {current.sentence && (
          <div className="px-4 max-w-2xl mx-auto flex items-center justify-center gap-2 text-gray-600 italic text-lg">
            <span>"{current.sentence}"</span>
            <button 
              onClick={() => handleSpeak(current.sentence)}
              className="text-sm p-1 bg-gray-100 hover:bg-gray-200 rounded border border-gray-300"
            >
              🔊
            </button>
          </div>
        )}
      </div>

      {/* Nút điều hướng danh sách nghe */}
      <div className="flex items-center justify-center gap-6 pt-2">
        <button
          type="button"
          onClick={handlePrev}
          className="px-6 py-3 bg-gray-100 hover:bg-gray-200 border-2 border-gray-400 text-gray-800 font-bold rounded-xl"
        >
          <span>◀ 上一個</span>
        </button>

        <span className="text-gray-500 font-black tracking-wider bg-gray-100 px-4 py-2 rounded-full border">
          {listeningIdx + 1} / {vocabularyData.length}
        </span>

        <button
          type="button"
          onClick={handleNext}
          className="px-6 py-3 bg-[#D946EF] hover:bg-[#E879F9] border-b-4 border-[#A21CAF] text-white font-bold rounded-xl"
        >
          <span>下一個 ▶</span>
        </button>
      </div>

    </div>
  );
}