import React, { useState } from 'react';

export default function VocabularyBank({ vocabularyData = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, short, long

  // 1. Hàm chuẩn hóa dữ liệu đầu vào để tránh lỗi thuộc tính
  const getWordText = (item) => item?.word || item?.vocabulary || item?.english || "";
  const getMeaningText = (item) => item?.meaningZh || item?.meaning || item?.chinese || "暫無中文資料";
  const getSentenceText = (item) => item?.example || item?.sentence || "";

  // 2. Bộ lọc tìm kiếm thông minh (Tìm theo cả tiếng Anh lẫn tiếng Trung)
  const filteredData = vocabularyData.filter(item => {
    const word = getWordText(item).toLowerCase();
    const meaning = getMeaningText(item).toLowerCase();
    const search = searchTerm.toLowerCase();
    
    const matchesSearch = word.includes(search) || meaning.includes(search);
    
    if (filterType === 'short') {
      return matchesSearch && getWordText(item).length <= 6; // Từ ngắn
    }
    if (filterType === 'long') {
      return matchesSearch && getWordText(item).length > 6;  // Từ dài
    }
    return matchesSearch;
  });

  // 3. Hàm phát âm
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
    <div className="vb-container">
      <style>{`
        .vb-container {
          max-width: 1200px;
          margin: 20px auto;
          padding: 24px;
          font-family: 'PingFang TC', 'Microsoft JhengHei', system-ui, sans-serif;
        }

        /* Tựa đề và Thống kê nhanh */
        .vb-header-zone {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          color: #fff;
        }
        .vb-title {
          font-size: 24px;
          font-weight: 800;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .vb-badge {
          background: rgba(255, 255, 255, 0.2);
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
        }

        /* Lưới hiển thị danh sách dạng Card chống tràn màn hình */
        .vb-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
        }
        
        /* Chi tiết thiết kế Card từ vựng */
        .vb-card {
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
        .vb-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 32px rgba(0, 0, 0, 0.15) !important;
        }
        .vb-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 5px;
          height: 100%;
          background: #0066cc;
        }

        .vb-word-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 8px;
        }
        .vb-word-text {
          font-size: 22px;
          font-weight: 800;
          color: #0f172a !important;
          letter-spacing: -0.3px;
          margin: 0;
        }
        .vb-speaker-btn {
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
        .vb-speaker-btn:hover {
          background: #0066cc !important;
          color: #fff !important;
          transform: scale(1.1);
        }

        .vb-meaning-text {
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

        .vb-divider {
          height: 1px;
          background: #f1f5f9 !important;
          margin: 4px 0 12px 0;
        }

        .vb-sentence-box {
          font-size: 14px;
          color: #475569 !important;
          line-height: 1.5;
          font-style: italic;
          margin: 0;
          position: relative;
          padding-left: 12px;
          border-left: 2px solid #cbd5e1 !important;
        }

        .vb-empty {
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

      {/* Tiêu đề & Tổng số lượng */}
      <div className="vb-header-zone">
        <h2 className="vb-title">🗂️ Vocabulary Bank</h2>
        <span className="vb-badge">共收錄 {vocabularyData.length} 個單字</span>
      </div>

      {/* 🛠️ GIẢI PHÁP MỚI: Dùng Grid thuần inline đè bẹp hoàn toàn CSS ẩn giấu bên ngoài */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        padding: '16px 20px',
        borderRadius: '16px',
        display: 'grid',
        gridTemplateColumns: '7fr 3fr', 
        alignItems: 'center',
        gap: '20px',
        marginBottom: '28px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        
        {/* Khung chứa ô tìm kiếm */}
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
            placeholder="搜尋英文單字..." 
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
        
        {/* Khung chứa 3 nút bộ lọc: Ép buộc hiển thị inline-flex xếp hàng ngang */}
        <div style={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'flex-start',
          alignItems: 'center',
          width: '100%'
        }}>
          <button 
            onClick={() => setFilterType('all')}
            style={{
              background: filterType === 'all' ? '#0066cc' : '#f1f5f9',
              color: filterType === 'all' ? '#ffffff' : '#475569',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: filterType === 'all' ? '0 4px 12px rgba(0, 102, 204, 0.25)' : 'none',
              display: 'inline-block' /* Ép hiển thị rõ ràng */
            }}
          >
            全部
          </button>
          
          <button 
            onClick={() => setFilterType('short')}
            style={{
              background: filterType === 'short' ? '#0066cc' : '#f1f5f9',
              color: filterType === 'short' ? '#ffffff' : '#475569',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: filterType === 'short' ? '0 4px 12px rgba(0, 102, 204, 0.25)' : 'none',
              display: 'inline-block'
            }}
          >
            短字 (≤6碼)
          </button>
          
          <button 
            onClick={() => setFilterType('long')}
            style={{
              background: filterType === 'long' ? '#0066cc' : '#f1f5f9',
              color: filterType === 'long' ? '#ffffff' : '#475569',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: filterType === 'long' ? '0 4px 12px rgba(0, 102, 204, 0.25)' : 'none',
              display: 'inline-block'
            }}
          >
            長字 (&gt;6碼)
          </button>
        </div>
      </div>

      {/* Lưới danh sách Card từ vựng */}
      <div className="vb-grid">
        {filteredData.length === 0 ? (
          <div className="vb-empty">
            💨 沒有找到符合条件的單字，更換關鍵字再試試看吧！
          </div>
        ) : (
          filteredData.map((item, index) => {
            const word = getWordText(item);
            return (
              <div key={index} className="vb-card">
                <div>
                  <div className="vb-word-row">
                    <h3 className="vb-word-text">{word}</h3>
                    <button className="vb-speaker-btn" onClick={() => handleSpeak(word)} title="播放發音">
                      🔊
                    </button>
                  </div>
                  <p className="vb-meaning-text">{getMeaningText(item)}</p>
                </div>
                
                {getSentenceText(item) && (
                  <div>
                    <div className="vb-divider"></div>
                    <p className="vb-sentence-box">
                      "{getSentenceText(item)}"
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