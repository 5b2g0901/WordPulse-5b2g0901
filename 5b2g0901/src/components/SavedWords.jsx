import React, { useState } from 'react';

export default function SavedWords({ vocabularyData = [], savedWordIds = [], toggleSaveWord = () => {} }) {
  const [searchTerm, setSearchTerm] = useState('');

  // 获取已收藏的单词
  const savedWords = vocabularyData.filter(item => savedWordIds.includes(item.id));

  // 搜索过滤
  const filteredData = savedWords.filter(item => {
    const word = (item?.word || '').toLowerCase();
    const meaning = (item?.meaningZh || '').toLowerCase();
    const search = searchTerm.toLowerCase();
    return word.includes(search) || meaning.includes(search);
  });

  // 播放发音
  const handleSpeak = (text) => {
    if ('speechSynthesis' in window && text) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '20px auto',
      padding: '24px',
      fontFamily: "'PingFang TC', 'Microsoft JhengHei', system-ui, sans-serif"
    }}>
      <style>{`
        .saved-container {
          max-width: 1200px;
          margin: 20px auto;
          padding: 24px;
          font-family: 'PingFang TC', 'Microsoft JhengHei', system-ui, sans-serif;
        }

        .saved-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          color: #fff;
        }

        .saved-title {
          font-size: 24px;
          font-weight: 800;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .saved-badge {
          background: rgba(255, 255, 255, 0.2);
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
        }

        .saved-search-box {
          background: rgba(255, 255, 255, 0.95);
          padding: '16px 20px';
          border-radius: '16px';
          margin-bottom: '28px';
          box-shadow: '0 8px 24px rgba(0, 0, 0, 0.15)';
        }

        .saved-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
        }

        .saved-card {
          background: #ffffff !important;
          border-radius: 18px;
          padding: 22px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08) !important;
          border: 1px solid rgba(241, 245, 249, 0.8) !important;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .saved-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 32px rgba(0, 0, 0, 0.15) !important;
        }

        .saved-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 5px;
          height: 100%;
          background: #F59E0B;
        }

        .saved-word-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 8px;
        }

        .saved-word-text {
          font-size: 22px;
          font-weight: 800;
          color: #0f172a !important;
          letter-spacing: -0.3px;
          margin: 0;
        }

        .saved-speaker-btn {
          background: #f0f7ff !important;
          border: none;
          color: #0066cc !important;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 16px;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .saved-speaker-btn:hover {
          background: #0066cc !important;
          color: #fff !important;
          transform: scale(1.1);
        }

        .saved-meaning-text {
          font-size: 15px;
          font-weight: 600;
          color: #0284c7 !important;
          margin: 0 0 14px 0;
          background: #f0f9ff;
          padding: 6px 12px;
          border-radius: 8px;
          display: inline-block;
          width: fit-content;
        }

        .saved-divider {
          height: 1px;
          background: #f1f5f9 !important;
          margin: 4px 0 12px 0;
        }

        .saved-sentence-box {
          font-size: 14px;
          color: #475569 !important;
          line-height: 1.5;
          font-style: italic;
          margin: 0;
          position: relative;
          padding-left: 12px;
          border-left: 2px solid #cbd5e1 !important;
        }

        .saved-empty {
          background: rgba(255, 255, 255, 0.1);
          border: 2px dashed rgba(255, 255, 255, 0.3);
          border-radius: 16px;
          padding: 40px;
          text-align: center;
          color: #fff;
          font-size: 16px;
          grid-column: 1 / -1;
        }
      `}</style>

      {/* 标题和统计 */}
      <div className="saved-header">
        <h2 className="saved-title">⭐ 收藏單字</h2>
        <span className="saved-badge">已收藏 {savedWords.length} 個單字</span>
      </div>

      {/* 搜索框 */}
      <div className="saved-search-box" style={{
        background: 'rgba(255, 255, 255, 0.95)',
        padding: '16px 20px',
        borderRadius: '16px',
        marginBottom: '28px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <span style={{
            position: 'absolute',
            left: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '16px',
            color: '#94a3b8',
            zIndex: 5
          }}>🔍</span>
          <input 
            type="text" 
            placeholder="搜尋已收藏的單字..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px 12px 40px',
              border: '1px solid #cbd5e1',
              borderRadius: '12px',
              fontSize: '15px',
              outline: 'none',
              color: '#1e293b',
              boxSizing: 'border-box',
              display: 'block'
            }}
          />
        </div>
      </div>

      {/* 卡片网格 */}
      <div className="saved-grid">
        {filteredData.length === 0 ? (
          <div className="saved-empty">
            {savedWords.length === 0 
              ? '🌟 還沒有收藏任何單字，點擊星星來收藏吧！'
              : '💨 沒有找到符合條件的已收藏單字'}
          </div>
        ) : (
          filteredData.map((item, index) => {
            return (
              <div key={index} className="saved-card">
                <div>
                  <div className="saved-word-row">
                    <h3 className="saved-word-text">{item?.word}</h3>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      {/* 🔊 播放按钮 */}
                      <button 
                        className="saved-speaker-btn" 
                        onClick={() => handleSpeak(item?.word)} 
                        title="播放發音"
                      >
                        🔊
                      </button>

                      {/* ⭐ 取消收藏按钮 */}
                      <button
                        onClick={() => toggleSaveWord(item.id)}
                        style={{
                          background: '#FEF3C7',
                          border: '2px solid #F59E0B',
                          color: '#F59E0B',
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          fontSize: '16px',
                          fontWeight: '800',
                          transition: 'all 0.2s',
                          flexShrink: 0
                        }}
                        title="取消收藏"
                      >
                        ⭐
                      </button>
                    </div>
                  </div>
                  <p className="saved-meaning-text">{item?.meaningZh}</p>
                </div>
                
                {item?.example && (
                  <div>
                    <div className="saved-divider"></div>
                    <p className="saved-sentence-box">
                      "{item.example}"
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
