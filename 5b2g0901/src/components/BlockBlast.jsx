import React from 'react';

export default function BlockBlast({ gameScore, initBlockGame, gameBlocks, selectedBlock, shakeBlockId, handleBlockClick }) {
  return (
    <div className="max-w-2xl mx-auto bg-[#E0F2FE] border-4 border-[#7DD3FC] p-6 rounded-3xl shadow-[0_8px_0_0_#7DD3FC] animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-black text-[#0369A1] tracking-wider">🧩 單字連連看 GAME</h3>
        <div className="flex items-center gap-4">
          <span className="text-xs font-black text-[#0369A1] bg-[#BAE6FD] px-3 py-1.5 rounded-full border border-[#7DD3FC]">
            ⭐ SCORE: {gameScore}
          </span>
          <button onClick={initBlockGame} className="px-3 py-1.5 bg-[#0EA5E9] hover:bg-[#38BDF8] border-b-4 border-[#0284C7] active:translate-y-0.5 active:border-b-0 text-white font-black text-xs rounded-xl transition-all">
            🔄 重置配對
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {gameBlocks.map((block) => {
          if (block.cleared) {
            return (
              <div key={block.id} className="h-20 rounded-2xl bg-[#F0FDF4] border-2 border-dashed border-[#BBF7D0] flex items-center justify-center text-2xl animate-pulse">
                ✅
              </div>
            );
          }

          const isSelected = selectedBlock?.id === block.id;
          const isShaking = shakeBlockId === block.id;

          // Phối màu sắc sặc sỡ dựa theo loại khối (Từ tiếng Anh màu Hồng / Nghĩa tiếng Trung màu Vàng)
          let colorClass = block.type === 'word' 
            ? 'bg-[#FCE7F3] border-[#F9A8D4] text-[#9D174D] shadow-[0_4px_0_0_#F9A8D4]' 
            : 'bg-[#FEF3C7] border-[#FCD34D] text-[#78350F] shadow-[0_4px_0_0_#FCD34D]';

          if (isSelected) {
            colorClass = 'bg-[#38BDF8] border-[#0284C7] text-white scale-95 shadow-inner';
          }
          if (isShaking) {
            colorClass = 'bg-[#FCA5A5] border-[#EF4444] text-[#7F1D1D] animate-shake';
          }

          return (
            <button
              key={block.id}
              onClick={() => handleBlockClick(block)}
              className={`h-20 p-2 rounded-2xl border-2 font-black text-xs flex items-center justify-center text-center transition-all duration-150 break-words active:translate-y-1 active:shadow-none ${colorClass}`}
            >
              {block.text}
            </button>
          );
        })}
      </div>
    </div>
  );
}