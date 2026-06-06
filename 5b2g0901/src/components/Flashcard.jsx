import React, { useState } from 'react';

export default function Flashcard({ vocabularyData = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [speechRate, setSpeechRate] = useState(0.85);
  const [isRandom, setIsRandom] = useState(false);
  const [dataList, setDataList] = useState(vocabularyData);
  
  const [knownWords, setKnownWords] = useState([]);
  const [unknownWords, setUnknownWords] = useState([]);

  const current = dataList[currentIndex] || dataList[0];

  const handleSpeak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
       utterance.lang = 'en-US';
      utterance.rate = speechRate;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleMarkKnown = (idx) => {
    if (!knownWords.includes(idx)) {
      setKnownWords([...knownWords, idx]);
      setUnknownWords(unknownWords.filter(item => item !== idx));
    }
    handleNext();
  };

  const handleMarkUnknown = (idx) => {
    if (!unknownWords.includes(idx)) {
      setUnknownWords([...unknownWords, idx]);
      setKnownWords(knownWords.filter(item => item !== idx));
    }
    handleNext();
  };

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex < dataList.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(dataList.length - 1);
    }
  };

  const handleToggleRandom = () => {
    if (!isRandom) {
      const shuffled = [...dataList].sort(() => Math.random() - 0.5);
      setDataList(shuffled);
      setCurrentIndex(0);
    } else {
      setDataList(vocabularyData);
      setCurrentIndex(0);
    }
    setIsRandom(!isRandom);
    setIsFlipped(false);
  };

  return (
    <div className="qz-wrapper">
      <style>{`
        .qz-wrapper { 
          max-width: 1000px; 
          margin: 0 auto; 
          padding: 20px; 
          font-family: system-ui, -apple-system, sans-serif;
          background-color: #0081cc; 
          border-radius: 24px;
          box-shadow: inset 0px 4px 10px rgba(0,0,0,0.15);
        }
        
        /* Thanh tinh chỉnh trên (Toolbar) */
        .qz-toolbar { 
          background: #ffffff; 
          padding: 10px 20px; 
          border-radius: 12px; 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          margin-bottom: 20px; 
          border: 1px solid #cbd5e1; 
        }
        .qz-tool-item { 
          display: flex; 
          align-items: center; 
          gap: 8px; 
          font-size: 14px; 
          font-weight: bold; 
          color: #334155; 
        }
        .qz-slider { 
          -webkit-appearance: none; 
          width: 110px; 
          height: 6px; 
          background: #000000; 
          border-radius: 3px; 
          outline: none;
        }
        .qz-slider::-webkit-slider-thumb { 
          -webkit-appearance: none; 
          width: 16px; 
          height: 16px; 
          background: #000000; 
          border-radius: 50%; 
          cursor: pointer; 
        }
        .qz-select { 
          padding: 4px 10px; 
          border: 1px solid #a1a1aa; 
          border-radius: 6px; 
          font-size: 14px; 
          background: #fff; 
          outline: none;
        }
        .qz-rnd-btn { 
          background: #0066cc; 
          border: none; 
          padding: 6px 16px; 
          border-radius: 8px; 
          font-size: 14px; 
          font-weight: bold; 
          cursor: pointer; 
          color: #fff; 
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .qz-rnd-btn.active { 
          background: #1d4ed8; 
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);
        }

        /* Vùng Flashcard chính */
        .qz-flashcard-container {
          background: #0066cc;
          border-radius: 20px;
          padding: 24px;
          border: 1px solid rgba(255,255,255,0.2);
          margin-bottom: 20px;
        }
        .qz-flashcard-row { 
          display: flex; 
          align-items: center; 
          gap: 16px; 
        }
        .qz-arrow-btn { 
          background: none; 
          border: none; 
          color: rgba(255, 255, 255, 0.8); 
          font-size: 48px; 
          cursor: pointer; 
          font-weight: 300;
          transition: color 0.2s;
          user-select: none;
        }
        .qz-arrow-btn:hover { 
          color: #ffffff; 
        }

        /* Thẻ từ vựng trắng dạng Quizlet */
        .qz-card-main { 
          background: #ffffff; 
          border-radius: 24px; 
          box-shadow: 0 10px 25px rgba(0,0,0,0.1); 
          width: 100%; 
          min-height: 320px; 
          padding: 30px; 
          box-sizing: border-box; 
          display: flex; 
          flex-direction: column; 
          align-items: center; 
          justify-content: center; 
          position: relative; 
          cursor: pointer; 
        }
        .qz-side-badge { 
          position: absolute; 
          top: 16px; 
          right: 24px; 
          background: #f1f5f9; 
          color: #64748b; 
          font-size: 12px; 
          font-weight: bold; 
          padding: 4px 12px; 
          border-radius: 8px; 
        }
        .qz-flip-hint {
          background: #0066cc;
          color: white;
          font-size: 13px;
          font-weight: bold;
          padding: 4px 14px;
          border-radius: 20px;
          margin-bottom: 12px;
        }
        
        /* Chữ hiển thị trên thẻ */
        .qz-word {
          font-size: 46px;
          font-weight: bold;
          color: #000 !important;
          margin: 10px 0 2px 0; 
          text-align: center;
        }
        .qz-ipa-row { 
          font-size: 18px; 
          color: #64748b; 
          margin-bottom: 20px; 
          display: flex; 
          align-items: center; 
          gap: 8px; 
        }
        .qz-audio-icon { 
          background: none; 
          border: none; 
          color: #0066cc; 
          cursor: pointer; 
          font-size: 20px; 
          padding: 0; 
        }
        .qz-line { 
          width: 100%; 
          height: 1px; 
          background: #e2e8f0; 
          margin: 20px 0; 
        }
        .qz-sentence {
          color: #150257 !important; 
          font-size: 16px; 
          text-align: center; 
          max-width: 600px; 
          margin: 0; 
          line-height: 1.6; 
        }
        .qz-chinese-label {
          font-size: 14px;
          color: #64748b;
          font-weight: bold;
          margin-bottom: 8px;
        }
        .qz-chinese {
          font-size: 34px;
          font-weight: bold;
          color: #000 !important;
          text-align: center; 
          margin: 0; 
          letter-spacing: 1px;
        }

        /* Nút phân loại Đúng / Sai bên dưới */
        .qz-action-buttons {
          display: flex; 
          justify-content: center; 
          gap: 16px; 
          margin-bottom: 20px;
        }
        .qz-btn-wrong {
          background: #ffffff; 
          border: 1px solid #ef4444; 
          color: #ef4444; 
          padding: 8px 24px; 
          border-radius: 6px; 
          font-weight: bold; 
          cursor: pointer; 
          display: flex; 
          align-items: center;
          gap: 8px; 
          font-size: 15px;
        }
        .qz-btn-right {
          background: #ffffff; 
          border: 1px solid #10b981; 
          color: #10b981; 
          padding: 8px 24px; 
          border-radius: 6px; 
          font-weight: bold; 
          cursor: pointer; 
          display: flex; 
          align-items: center;
          gap: 8px; 
          font-size: 15px;
        }
        .qz-badge-count {
          font-family: monospace;
          font-size: 16px;
          font-weight: bold;
          margin-left: 4px;
        }

        /* Khối danh sách thống kê học tập (Bảng dưới) */
        .qz-list-grid { 
          display: grid; 
          grid-template-columns: 1fr; 
          gap: 20px; 
        }
        @media(min-width: 768px) { 
          .qz-list-grid { grid-template-columns: 1fr 1fr; } 
        }
        .qz-list-box { 
          background: #ffffff; 
          border-radius: 16px; 
          padding: 20px; 
          box-shadow: 0 4px 6px rgba(0,0,0,0.05); 
          border: 1px solid #e2e8f0;
        }
        .qz-list-header { 
          font-size: 16px; 
          font-weight: bold; 
          padding-bottom: 12px; 
          margin: 0 0 16px 0; 
          border-bottom: 1px solid #e2e8f0; 
          display: flex; 
          justify-content: space-between; 
          align-items: center;
        }
        .qz-ul { 
          list-style: none; 
          padding: 0; 
          margin: 0; 
          display: flex; 
          flex-direction: column; 
          gap: 10px; 
          max-height: 250px; 
          overflow-y: auto; 
        }
        .qz-li { 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          background: #ffffff; 
          padding: 12px 16px; 
          border-radius: 8px; 
          border: 1px solid #e2e8f0; 
          font-size: 15px; 
        }
        .qz-li-btn-audio {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 14px;
          margin-right: 8px;
          color: #64748b;
        }
        .qz-li-word {
          font-weight: bold;
          color: #000 !important;
        }
        .qz-li-meaning {
          color: #475569!important; 
          font-size: 14px;
        }
      `}</style>

      {/* 1. Thanh tinh chỉnh trên */}
      <div className="qz-toolbar">
        <div className="qz-tool-item">
          <span>🔊 語速調節:</span>
          <input type="range" min="0.5" max="1.5" step="0.05" value={speechRate} onChange={(e) => setSpeechRate(parseFloat(e.target.value))} className="qz-slider" />
          <span style={{fontFamily:'monospace'}}>{speechRate}x</span>
        </div>
        <div className="qz-tool-item">
          <span>📋 切換單字:</span>
          <select value={currentIndex} onChange={(e) => { setCurrentIndex(Number(e.target.value)); setIsFlipped(false); }} className="qz-select">
            {dataList.map((item, idx) => (
              <option key={idx} value={idx}>{idx + 1}. {item.word}</option>
            ))}
          </select>
        </div>
        <button className={`qz-rnd-btn ${isRandom ? 'active' : ''}`} onClick={handleToggleRandom}>🔀 隨機播放</button>
        <div className="qz-tool-item" style={{color:'#64748b', fontFamily:'monospace'}}>
          🕒 {currentIndex + 1} / {dataList.length}
        </div>
      </div>

      {/* 2. Khu vực thẻ lật Flashcard */}
      <div className="qz-flashcard-container">
        <div className="qz-flashcard-row">
          <button className="qz-arrow-btn" onClick={handlePrev}>‹</button>
          
          <div className="qz-card-main" onClick={() => setIsFlipped(!isFlipped)}>
            <div className="qz-side-badge">{isFlipped ? "背面" : "正面"}</div>
            
            {!isFlipped ? (
              <>
                <div className="qz-flip-hint">點擊卡片翻面</div>
                <h2 className="qz-word">{current.word}</h2>
                <div className="qz-ipa-row">
                  {current.ipa ? `/${current.ipa}/` : ''}
                  <button className="qz-audio-icon" onClick={(e) => { e.stopPropagation(); handleSpeak(current.word); }}>🔊</button>
                </div>
                {current.sentence && (
                  <>
                    <div className="qz-line"></div>
                    <p className="qz-sentence">"{current.sentence}"</p>
                  </>
                )}
                <div style={{marginTop: '20px', fontSize: '13px', color: '#94a3b8'}}>點擊卡片查看中文解釋</div>
              </>
            ) : (
              <>
                <span className="qz-chinese-label">中文意思</span>
                <h2 className="qz-chinese">{current.meaning}</h2>
              </>
            )}
          </div>

          <button className="qz-arrow-btn" onClick={handleNext}>›</button>
        </div>
      </div>

      {/* 3. Nút bấm ghi nhớ Đỏ / Xanh */}
      <div className="qz-action-buttons">
        <button onClick={() => handleMarkUnknown(currentIndex)} className="qz-btn-wrong">
          ❌ 未記住 <span className="qz-badge-count" style={{color: '#ef4444'}}>{unknownWords.length}</span>
        </button>
        <button onClick={() => handleMarkKnown(currentIndex)} className="qz-btn-right">
          ✅ 已記住 <span className="qz-badge-count" style={{color: '#10b981'}}>{knownWords.length}</span>
        </button>
      </div>

      {/* 4. Thống kê 2 khối danh sách bên dưới */}
      <div className="qz-list-grid">
        <div className="qz-list-box">
          <h3 className="qz-list-header" style={{color: '#047857'}}>
            <span>🟢 已學會的單字清單 {knownWords.length} 個</span>
          </h3>
          {knownWords.length === 0 ? (
            <p style={{fontSize: '14px', color: '#94a3b8', fontStyle: 'italic', textAlign: 'center', padding: '20px 0', margin:0}}>目前尚無已記住的單字</p>
          ) : (
            <ul className="qz-ul">
              {knownWords.map((idx) => (
                <li key={idx} className="qz-li" style={{borderColor: '#a7f3d0'}}>
                  <div>
                    <button className="qz-li-btn-audio" onClick={() => handleSpeak(dataList[idx].word)}>🔊</button>
                    <span className="qz-li-word">{dataList[idx].word}</span>
                  </div>
                  <span className="qz-li-meaning">{dataList[idx].meaning}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="qz-list-box">
          <h3 className="qz-list-header" style={{color: '#b91c1c'}}>
            <span>🔴 還需要加強的單字清單 {unknownWords.length} 個</span>
          </h3>
          {unknownWords.length === 0 ? (
            <p style={{fontSize: '14px', color: '#94a3b8', fontStyle: 'italic', textAlign: 'center', padding: '20px 0', margin:0}}>目前沒有未記住的單字</p>
          ) : (
            <ul className="qz-ul">
              {unknownWords.map((idx) => (
                <li key={idx} className="qz-li" style={{borderColor: '#fca5a5'}}>
                  <div>
                    <button className="qz-li-btn-audio" onClick={() => handleSpeak(dataList[idx].word)}>🔊</button>
                    <span className="qz-li-word">{dataList[idx].word}</span>
                  </div>
                  <span className="qz-li-meaning">{dataList[idx].meaning}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}