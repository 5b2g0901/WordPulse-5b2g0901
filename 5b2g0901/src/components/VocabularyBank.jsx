import React, { useState } from 'react';

// Nhận thêm prop onDeleteWord từ App.jsx xuống để xử lý xóa
export default function VocabularyBank({ vocabularyData = [], savedWordIds = [], onToggleSave, onDeleteWord }) {
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
          padding: 16px;
          font-family: 'PingFang TC', 'Microsoft JhengHei', system-ui, sans-serif;
          box-sizing: border-box;
        }

        @media (min-width: 768px) {
          .vb-container {
            padding: 24px;
          }
        }

        /* Tựa đề và Thống kê nhanh */
        .vb-header-zone {
          display: flex;
          flex-direction: column;
          gap: 10px;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
          color: #fff;
        }
        
        @media (min-width: 576px) {
          .vb-header-zone {
            flex-direction: row;
            align-items: center;
          }
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
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
        }

        /* Khu vực tìm kiếm và bộ lọc cải tiến Responsive */
        .vb-filter-wrapper {
          background: rgba(255, 255, 255, 0.95);
          padding: 16px;
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 28px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          width: 100%;
          box-sizing: border-box;
        }

        @media (min-width: 992px) {
          .vb-filter-wrapper {
            display: grid;
            grid-template-columns: 6fr 4fr;
            align-items: center;
            padding: 16px 20px;
          }
        }

        .vb-search-box {
          position: relative;
          width: 100%;
        }
        .vb-search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 16px;
          color: #94a3b8;
          z-index: 5;
        }
        .vb-input {
          width: 100%;
          padding: 12px 16px 12px 40px;
          border: 1px solid #cbd5e1;
          border-radius: 12px;
          font-size: 15px;
          outline: none;
          color: #1e293b;
          box-sizing: border-box;
          display: block;
          transition: border-color 0.2s;
        }
        .vb-input:focus {
          border-color: #0066cc;
          box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
        }

        .vb-btn-group {
          display: flex;
          gap: 8px;
          width: 100%;
          overflow-x: auto;
          scrollbar-width: none;
          padding-bottom: 2px;
        }
        .vb-btn-group::-webkit-scrollbar {
          display: none;
          }

        .vb-filter-btn {
          flex: 1;
          min-width: fit-content;
          border: none;
          padding: 11px 16px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s;
          text-align: center;
        }

        /* Lưới hiển thị danh sách dạng Card */
        .vb-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
        }
        
        @media (min-width: 576px) {
          .vb-grid {
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 20px;
          }
        }
        
        /* Chi tiết thiết kế Card từ vựng */
        .vb-card {
          background: #ffffff !important;
          border-radius: 18px;
          padding: 20px;
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
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }
        .vb-word-text {
          font-size: 20px;
          font-weight: 800;
          color: #0f172a !important;
          letter-spacing: -0.3px;
          margin: 0;
          word-break: break-word;
        }
        @media (min-width: 576px) {
          .vb-word-text {
            font-size: 22px;
          }
        }
        
        /* CỤM BA NÚT HÀNH ĐỘNG HÀNG NGANG (Nghe - Sao - Thùng rác) */
        .vb-action-cluster {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
        }
        @media (min-width: 576px) {
          .vb-action-cluster {
            gap: 8px;
          }
        }

        /* Định dạng chung cho các nút tròn hành động */
        .vb-action-btn {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 15px;
          transition: all 0.2s;
          border: none;
          padding: 0;
        }
        @media (min-width: 576px) {
          .vb-action-btn {
            width: 36px;
            height: 36px;
            font-size: 16px;
          }
        }

        /* 🔊 Nút Phát Âm */
        .vb-speaker-btn {
          background: #f0f7ff !important;
          color: #0066cc !important;
        }
        .vb-speaker-btn:hover {
          background: #0066cc !important;
          color: #fff !important;
          transform: scale(1.1);
        }

        /* ⭐ Nút Lưu trữ ngôi sao */
        .vb-save-btn {
          background: #fef8e7 !important;
          color: #eab308 !important;
        }
        .vb-save-btn:hover {
          background: #eab308 !important;
          color: #fff !important;
          transform: scale(1.1);
        }

        /* 🗑️ Nút Xóa từ vựng tự thêm */
        .vb-delete-btn {
          background: #fef2f2 !important;
          color: #ef4444 !important;
        }
        .vb-delete-btn:hover {
          background: #ef4444 !important;
          color: #fff !important;
          transform: scale(1.1);
        }

        .vb-meaning-text {
          font-size: 14px;
          font-weight: 600;
          color: #0284c7 !important;
          margin: 0 0 14px 0;
          background: #f0f9ff;
          padding: 6px 12px;
          border-radius: 8px;
          display: inline-block;
          width: fit-content;
        }
        @media (min-width: 576px) {
          .vb-meaning-text {
            font-size: 15px;
          }
        }

        .vb-divider {
          height: 1px;
          background: #f1f5f9 !important;
          margin: 4px 0 12px 0;
        }

        .vb-sentence-box {
          font-size: 13px;
          color: #475569 !important;
          line-height: 1.5;
          font-style: italic;
          margin: 0;
          position: relative;
          padding-left: 12px;
          border-left: 2px solid #cbd5e1 !important;
        }
        @media (min-width: 576px) {
          .vb-sentence-box {
            font-size: 14px;
          }
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

      {/* 🛠️ Bộ lọc và thanh tìm kiếm dạng Responsive */}
      <div className="vb-filter-wrapper">
        {/* Khung chứa ô tìm kiếm */}
        <div className="vb-search-box">
          <span className="vb-search-icon">🔍</span>
          <input
            type="text"
            placeholder="搜尋英文單字..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="vb-input"
          />
        </div>

        {/* Khung chứa 3 nút bộ lọc */}
        <div className="vb-btn-group">
          <button
            onClick={() => setFilterType('all')}
            className="vb-filter-btn"
            style={{
              background: filterType === 'all' ? '#0066cc' : '#f1f5f9',
              color: filterType === 'all' ? '#ffffff' : '#475569',
              boxShadow: filterType === 'all' ? '0 4px 12px rgba(0, 102, 204, 0.25)' : 'none',
            }}
          >
            全部
          </button>

          <button
            onClick={() => setFilterType('short')}
            className="vb-filter-btn"
            style={{
              background: filterType === 'short' ? '#0066cc' : '#f1f5f9',
              color: filterType === 'short' ? '#ffffff' : '#475569',
              boxShadow: filterType === 'short' ? '0 4px 12px rgba(0, 102, 204, 0.25)' : 'none',
            }}
          >
            短字 (≤6碼)
          </button>

          <button
            onClick={() => setFilterType('long')}
            className="vb-filter-btn"
            style={{
              background: filterType === 'long' ? '#0066cc' : '#f1f5f9',
              color: filterType === 'long' ? '#ffffff' : '#475569',
              boxShadow: filterType === 'long' ? '0 4px 12px rgba(0, 102, 204, 0.25)' : 'none',
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
            const isSaved = savedWordIds.includes(item.id);
            return (
              <div key={item.id || index} className="vb-card">
                <div>
                  <div className="vb-word-row">
                    {/* Tên từ vựng bên trái */}
                    <h3 className="vb-word-text">{word}</h3>

                    {/* CỤM HÀNH ĐỘNG XẾP THEO THỨ TỰ: NGHE -> SAO -> THÙNG RÁC */}
                    <div className="vb-action-cluster">
                      {/* 1. 🔊 Nút Phát âm */}
                      <button className="vb-action-btn vb-speaker-btn" onClick={() => handleSpeak(word)} title="播放發音">
                        🔊
                      </button>

                      {/* 2. ⭐ Nút Ngôi sao lưu trữ */}
                      <button
                        className="vb-action-btn vb-save-btn"
                        onClick={() => onToggleSave && onToggleSave(item.id)}
                        title={isSaved ? "取消收藏" : "加入收藏"}
                      >
                        {isSaved ? '⭐' : '☆'}
                      </button>

                      {/* 3. 🗑️ Nút Thùng rác xóa - ĐÃ LOẠI BỎ ĐIỀU KIỆN ITEM.ISCUSTOM */}
                      {onDeleteWord && (
                        <button
                          className="vb-action-btn vb-delete-btn"
                          onClick={() => {
                            if (window.confirm(`確定要刪除單字 "${word}" 嗎？`)) {
                              onDeleteWord(item.id);
                            }
                          }}
                          title="刪除單字"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
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