import React from 'react';

export default function BlockBlast({
  gameScore,
  initBlockGame,
  gameBlocks,
  selectedBlock,
  shakeBlockId,
  handleBlockClick
}) {
  // Tách mảng dữ liệu thành 2 cột rõ ràng chống tràn/lộn xộn chữ
  const wordColumns = gameBlocks.filter((b) => b.type === 'word');
  const meanColumns = gameBlocks.filter((b) => b.type === 'mean');
  const isAllCleared = gameBlocks.length > 0 && gameBlocks.every((b) => b.cleared);

  return (
    <div className="w-full max-w-4xl mx-auto qz-wrapper" style={{ padding: '10px 0' }}>
      
      {/* KHU VỰC THÔNG TIN TRÊN (BẢNG ĐIỂM + NÚT RESET) */}
      <div style={{
        display: 'flex',
        justifyContent: 'between',
        alignItems: 'center',
        backgroundColor: '#406293',
        padding: '16px 24px',
        borderRadius: '20px',
        border: '3px solid #1e293b',
        boxShadow: '0 6px 0 #1e293b',
        marginBottom: '28px',
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '28px' }}>🧩</span>
          <h2 style={{ fontSize: '20px', fontWeight: '950', color: '#ffffff', margin: 0, letterSpacing: '1px' }}>
            單字翻翻樂連連看
          </h2>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            backgroundColor: '#fef3c7',
            color: '#b45309',
            padding: '10px 20px',
            borderRadius: '14px',
            fontWeight: '900',
            fontSize: '15px',
            border: '2.5px solid #1e293b',
            boxShadow: '0 4px 0 #1e293b',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            ⭐ SCORE: <span style={{ fontSize: '20px', color: '#d97706' }}>{gameScore}</span>
          </div>
          <button
            onClick={initBlockGame}
            style={{
              backgroundColor: '#ffffff',
              color: '#1e293b',
              padding: '10px 20px',
              borderRadius: '14px',
              fontWeight: '900',
              fontSize: '14px',
              border: '2.5px solid #1e293b',
              boxShadow: '0 4px 0 #1e293b',
              cursor: 'pointer',
              transition: 'all 0.1s ease',
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'translateY(3px)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'none'}
          >
            🔄 重置配對
          </button>
        </div>
      </div>

      {/* KHU VỰC CHƠI CHÍNH */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '4px solid #1e293b',
        borderRadius: '32px',
        padding: '32px',
        boxShadow: '0 12px 0px #1e293b',
        minHeight: '400px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        boxSizing: 'border-box'
      }}>
        
        {isAllCleared ? (
          /* MÀN HÌNH CHIẾN THẮNG */
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <span style={{ fontSize: '64px', display: 'block', marginBottom: '16px' }}>🎉</span>
            <h3 style={{ fontSize: '32px', fontWeight: '950', color: '#0f172a', margin: '0 0 8px 0' }}>太厲害了！</h3>
            <p style={{ color: '#64748b', fontWeight: '700', fontSize: '15px', margin: '0 0 24px 0' }}>您已成功配對所有單字！</p>
            <div style={{
              display: 'inline-block',
              backgroundColor: '#dcfce7',
              color: '#166534',
              border: '3px dashed #22c55e',
              padding: '12px 32px',
              borderRadius: '20px',
              fontWeight: '900',
              fontSize: '22px',
              marginBottom: '28px'
            }}>
              最終得分: {gameScore} 分
            </div>
            <div>
              <button
                onClick={initBlockGame}
                style={{
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  padding: '16px 36px',
                  borderRadius: '20px',
                  fontWeight: '950',
                  fontSize: '18px',
                  border: '3px solid #1e293b',
                  boxShadow: '0 6px 0 #1e293b',
                  cursor: 'pointer',
                  transition: 'all 0.1s'
                }}
                onMouseDown={(e) => e.currentTarget.style.transform = 'translateY(4px)'}
                onMouseUp={(e) => e.currentTarget.style.transform = 'none'}
              >
                再玩一次 🚀
              </button>
            </div>
          </div>
        ) : (
          /* GIAO DIỆN CHƠI CHIA 2 CỘT */
          <div style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '1fr 1fr',
            gap: '32px'
          }}>
            
            {/* CỘT TIẾNG ANH (LEFT) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{
                textAlign: 'center',
                fontWeight: '900',
                fontSize: '13px',
                letterSpacing: '1.5px',
                color: '#0369a1',
                backgroundColor: '#e0f2fe',
                border: '2.5px solid #0284c7',
                padding: '8px 0',
                borderRadius: '14px',
                textTransform: 'uppercase'
              }}>
                🔤 English Word
              </div>
              
              {wordColumns.map((block) => {
                const isSelected = selectedBlock?.id === block.id;
                const isShaking = shakeBlockId === block.id;

                return (
                  <button
                    key={block.id}
                    disabled={block.cleared}
                    onClick={() => handleBlockClick(block)}
                    style={{
                      width: '100%',
                      padding: '18px 24px',
                      borderRadius: '20px',
                      textAlign: 'left',
                      fontWeight: '900',
                      fontSize: '17px',
                      border: '3px solid',
                      borderColor: isShaking ? '#ef4444' : isSelected ? '#1e293b' : '#e2e8f0',
                      backgroundColor: block.cleared ? '#f1f5f9' : isShaking ? '#fef2f2' : isSelected ? '#0ea5e9' : '#ffffff',
                      color: block.cleared ? '#cbd5e1' : isShaking ? '#ef4444' : isSelected ? '#ffffff' : '#1e293b',
                      boxShadow: block.cleared || isSelected ? 'none' : '0 6px 0 #f1f5f9',
                      transform: isSelected ? 'translateY(3px)' : 'none',
                      cursor: block.cleared ? 'default' : 'pointer',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      opacity: block.cleared ? 0.35 : 1,
                      textDecoration: block.cleared ? 'line-through' : 'none',
                      animation: isShaking ? 'shake 0.4s ease-in-out' : 'none',
                      boxSizing: 'border-box'
                    }}
                  >
                    <span>{block.text}</span>
                    {!block.cleared && (
                      <span style={{
                        fontSize: '10px',
                        fontWeight: '900',
                        padding: '3px 8px',
                        borderRadius: '8px',
                        backgroundColor: isSelected ? 'rgba(255,255,255,0.25)' : '#f8fafc',
                        color: isSelected ? '#ffffff' : '#94a3b8',
                        border: isSelected ? '1px solid rgba(255,255,255,0.4)' : '1px solid #e2e8f0'
                      }}>
                        {isSelected ? 'SELECTED' : 'WORD'}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* CỘT TIẾNG TRUNG (RIGHT) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{
                textAlign: 'center',
                fontWeight: '900',
                fontSize: '13px',
                letterSpacing: '1.5px',
                color: '#4338ca',
                backgroundColor: '#e0e7ff',
                border: '2.5px solid #4f46e5',
                padding: '8px 0',
                borderRadius: '14px',
                textTransform: 'uppercase'
              }}>
                🇨🇳 中文釋義
              </div>
              
              {meanColumns.map((block) => {
                const isSelected = selectedBlock?.id === block.id;
                const isShaking = shakeBlockId === block.id;

                return (
                  <button
                    key={block.id}
                    disabled={block.cleared}
                    onClick={() => handleBlockClick(block)}
                    style={{
                      width: '100%',
                      padding: '18px 24px',
                      borderRadius: '20px',
                      textAlign: 'left',
                      fontWeight: '800',
                      fontSize: '15px',
                      border: '3px solid',
                      borderColor: isShaking ? '#ef4444' : isSelected ? '#1e293b' : '#e2e8f0',
                      backgroundColor: block.cleared ? '#f1f5f9' : isShaking ? '#fef2f2' : isSelected ? '#6366f1' : '#ffffff',
                      color: block.cleared ? '#cbd5e1' : isShaking ? '#ef4444' : isSelected ? '#ffffff' : '#334155',
                      boxShadow: block.cleared || isSelected ? 'none' : '0 6px 0 #f1f5f9',
                      transform: isSelected ? 'translateY(3px)' : 'none',
                      cursor: block.cleared ? 'default' : 'pointer',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      opacity: block.cleared ? 0.35 : 1,
                      textDecoration: block.cleared ? 'line-through' : 'none',
                      animation: isShaking ? 'shake 0.4s ease-in-out' : 'none',
                      lineHeight: '1.4',
                      boxSizing: 'border-box'
                    }}
                  >
                    <span style={{ paddingRight: '8px' }}>{block.text}</span>
                    {!block.cleared && (
                      <span style={{
                        fontSize: '10px',
                        fontWeight: '900',
                        padding: '3px 8px',
                        borderRadius: '8px',
                        backgroundColor: isSelected ? 'rgba(255,255,255,0.25)' : '#f8fafc',
                        color: isSelected ? '#ffffff' : '#94a3b8',
                        border: isSelected ? '1px solid rgba(255,255,255,0.4)' : '1px solid #e2e8f0',
                        flexShrink: 0
                      }}>
                        {isSelected ? 'SELECTED' : 'MEANING'}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

          </div>
        )}
      </div>

      {/* EFFECT SHAKE ANIMATION */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}