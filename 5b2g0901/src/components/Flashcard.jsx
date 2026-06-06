import React, { useState, useEffect } from 'react';

export default function Flashcard({ vocabularyData = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [speechRate, setSpeechRate] = useState(0.85);
  const [isRandom, setIsRandom] = useState(false);
  const [dataList, setDataList] = useState([]);
  
  const [knownWords, setKnownWords] = useState([]);
  const [unknownWords, setUnknownWords] = useState([]);

  // 同步更新內部狀態
  useEffect(() => {
    if (vocabularyData && vocabularyData.length > 0) {
      setDataList(vocabularyData);
      setCurrentIndex(0);
      setIsFlipped(false);
      setKnownWords([]);
      setUnknownWords([]);
    }
  }, [vocabularyData]);

  const current = dataList[currentIndex] || {};

  // 1. Hàm đọc Từ vựng tiếng Anh
  const getWordText = (item) => {
    return item?.word || item?.vocabulary || item?.english || "";
  };

  // 2. Hàm đọc Nghĩa tiếng Trung (Đã sửa để nhận diện đúng meaningZh)
  const getMeaningText = (item) => {
    if (!item) return "暫無中文資料";
    return item.meaningZh || item.meaning || item.chinese || "暫無中文資料";
  };

  // 3. Hàm đọc Phiên âm (Đã sửa để nhận diện đúng phonetic)
  const getPhoneticText = (item) => {
    if (!item) return "";
    return item.phonetic || item.ipa || "";
  };

  // 4. Hàm đọc Câu ví dụ (Đã sửa để nhận diện đúng example)
  const getSentenceText = (item) => {
    if (!item) return "";
    return item.example || item.sentence || "";
  };

  const activeWord = getWordText(current);

  const handleSpeak = (text) => {
    if ('speechSynthesis' in window && text) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = speechRate;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleMarkKnown = (wordItem) => {
    if (!wordItem || !getWordText(wordItem)) return;
    const wordText = getWordText(wordItem);
    
    if (!knownWords.some(item => getWordText(item) === wordText)) {
      setKnownWords([...knownWords, wordItem]);
      setUnknownWords(unknownWords.filter(item => getWordText(item) !== wordText));
    }
    handleNext();
  };

  const handleMarkUnknown = (wordItem) => {
    if (!wordItem || !getWordText(wordItem)) return;
    const wordText = getWordText(wordItem);
    
    if (!unknownWords.some(item => getWordText(item) === wordText)) {
      setUnknownWords([...unknownWords, wordItem]);
      setKnownWords(knownWords.filter(item => getWordText(item) !== wordText));
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
    } else {
      setDataList(vocabularyData);
    }
    setCurrentIndex(0);
    setIsRandom(!isRandom);
    setIsFlipped(false);
  };

  if (!dataList || dataList.length === 0) {
    return (
      <div style={{ backgroundColor: '#0081cc', borderRadius: '24px', padding: '50px', textAlign: 'center', color: '#fff', fontSize: '20px', fontWeight: 'bold' }}>
        ⚠️ 唯讀或單字庫中暫無資料，請確認資料來源。
      </div>
    );
  }

  return (
    <div className="qz-wrapper">
      <style>{`
        .qz-wrapper { 
          max-width: 1000px; 
          margin: 0 auto; 
          padding: 20px; 
          font-family: system-ui, -apple-system, sans-serif;
          background-color: #0081cc !important; 
          border-radius: 24px;
          box-shadow: inset 0px 4px 10px rgba(0,0,0,0.15) !important;
        }
        .qz-toolbar { 
          background: #ffffff !important; 
          padding: 12px 20px; 
          border-radius: 14px; 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          margin-bottom: 20px; 
          border: 1px solid #cbd5e1 !important;
          box-shadow: 0 4px 6px rgba(0,0,0,0.05) !important;
        }
        .qz-tool-item { 
          display: flex; 
          align-items: center; 
          gap: 8px; 
          font-size: 14px; 
          font-weight: bold; 
          color: #334155 !important; 
        }
        .qz-slider { width: 110px; height: 6px; background: #e2e8f0; border-radius: 3px; outline: none; }
        .qz-select { 
          padding: 6px 12px; 
          border: 1px solid #cbd5e1 !important;
          border-radius: 8px; 
          background: #fff !important; 
          color: #334155 !important;
          font-weight: 500;
          outline: none;
        }
        .qz-rnd-btn { 
          background: #0066cc !important; 
          border: none; 
          padding: 6px 16px; 
          border-radius: 8px; 
          font-weight: bold; 
          cursor: pointer; 
          color: #fff !important; 
          transition: background 0.2s;
        }
        .qz-rnd-btn:hover { background: #1d4ed8 !important; }
        .qz-flashcard-container {
          background: #0066cc !important;
          border-radius: 20px;
          padding: 24px;
          margin-bottom: 20px;
        }
        .qz-flashcard-row { 
          display: flex; 
          align-items: center; 
          gap: 20px; 
        }
        .qz-arrow-btn { 
          background: none; 
          border: none; 
          color: rgba(255,255,255,0.8) !important; 
          font-size: 54px; 
          cursor: pointer; 
          user-select: none;
          transition: color 0.2s;
        }
        .qz-arrow-btn:hover { color: #fff !important; }
        .qz-card-main { 
          background: #ffffff !important; 
          border-radius: 24px; 
          width: 100%; 
          min-height: 340px; 
          padding: 30px; 
          display: flex; 
          flex-direction: column; 
          align-items: center; 
          justify-content: center; 
          position: relative; 
          cursor: pointer; 
          box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important;
        }
        .qz-side-badge { 
          position: absolute; 
          top: 18px; 
          right: 24px; 
          background: #f1f5f9 !important; 
          color: #64748b !important;
          font-size: 13px; 
          font-weight: bold; 
          padding: 4px 14px; 
          border-radius: 8px; 
        }
        .qz-flip-hint {
          background: #e0f2fe !important;
          color: #0369a1 !important;
          font-size: 13px;
          font-weight: bold;
          padding: 4px 14px;
          border-radius: 20px;
          margin-bottom: 12px;
        }
        .qz-word {
          font-size: 48px;
          font-weight: 800;
          color: #0f172a !important; 
          margin: 15px 0 8px 0; 
          text-align: center;
          line-height: 1.2;
          display: block !important;
          visibility: visible !important;
        }
        .qz-ipa-row { 
          font-size: 20px; 
          color: #475569 !important; 
          margin-bottom: 20px; 
          display: flex; 
          align-items: center; 
          gap: 10px; 
          font-family: sans-serif;
        }
        .qz-audio-icon { 
          background: none; 
          border: none; 
          color: #0066cc !important; 
          cursor: pointer; 
          font-size: 22px; 
        }
        .qz-line { 
          width: 90%; 
          height: 1px; 
          background: #e2e8f0 !important; 
          margin: 20px 0; 
        }
        .qz-sentence {
          color: #334155 !important; 
          font-size: 16px; 
          font-style: italic;
          text-align: center; 
          max-width: 650px; 
          line-height: 1.5;
          margin: 0;
        }
        .qz-chinese {
          font-size: 36px;
          font-weight: bold;
          color: #0066cc !important;
          text-align: center;
          margin: 0;
        }
        .qz-action-buttons {
          display: flex; 
          justify-content: center; 
          gap: 20px; 
          margin-bottom: 25px;
        }
        .qz-btn-wrong { border: 2px solid #ef4444 !important; color: #ef4444 !important; background: #fff !important; padding: 10px 28px; border-radius: 10px; font-weight: bold; cursor: pointer; font-size: 15px;}
        .qz-btn-right { border: 2px solid #10b981 !important; color: #10b981 !important; background: #fff !important; padding: 10px 28px; border-radius: 10px; font-weight: bold; cursor: pointer; font-size: 15px;}
        
        .qz-list-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
        @media(min-width: 768px) { .qz-list-grid { grid-template-columns: 1fr 1fr; } }
        .qz-list-box { background: #fff !important; border-radius: 16px; padding: 20px; border: 1px solid #e2e8f0 !important; box-shadow: 0 4px 6px rgba(0,0,0,0.02) !important;}
        .qz-list-header { font-size: 16px; font-weight: bold; padding-bottom: 12px; margin-bottom: 16px; border-bottom: 1px solid #e2e8f0 !important; }
        .qz-ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; max-height: 260px; overflow-y: auto; }
        
        .qz-li { 
          display: flex; 
          justify-content: space-between; 
          align-items: center;
          padding: 12px 16px; 
          background: #f8fafc !important; 
          border-radius: 12px; 
          border: 1px solid #e2e8f0 !important; 
          font-size: 15px; 
        }
        .qz-li-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .qz-li-btn-audio {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 16px;
          color: #64748b;
          padding: 0;
        }
        .qz-li-btn-audio:hover { color: #0066cc; }
        .qz-li-text-wrapper {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .qz-li-word { font-weight: bold; color: #1e293b !important; min-width: 120px; }
        .qz-li-meaning { color: #64748b !important; font-size: 14px; font-weight: normal; }
        .qz-li-status-icon { font-size: 16px; display: flex; align-items: center; }
      `}</style>

      {/* 1. 工具列 */}
      <div className="qz-toolbar">
        <div className="qz-tool-item">
          <span>🔊 語速調節:</span>
          <input type="range" min="0.5" max="1.5" step="0.05" value={speechRate} onChange={(e) => setSpeechRate(parseFloat(e.target.value))} className="qz-slider" />
          <span style={{ fontFamily: 'monospace' }}>{speechRate.toFixed(2)}x</span>
        </div>
        <div className="qz-tool-item">
          <span>📋 切換單字:</span>
          <select value={currentIndex} onChange={(e) => { setCurrentIndex(Number(e.target.value)); setIsFlipped(false); }} className="qz-select">
            {dataList.map((item, idx) => (
              <option key={idx} value={idx}>{idx + 1}. {getWordText(item)}</option>
            ))}
          </select>
        </div>
        <button className="qz-rnd-btn" onClick={handleToggleRandom}>🔀 {isRandom ? '固定排序' : '隨機播放'}</button>
        <div className="qz-tool-item" style={{ color: '#64748b' }}>
          ⏳ {currentIndex + 1} / {dataList.length}
        </div>
      </div>

      {/* 2. 單字卡主體 */}
      <div className="qz-flashcard-container">
        <div className="qz-flashcard-row">
          <button className="qz-arrow-btn" onClick={handlePrev}>‹</button>
          
          <div className="qz-card-main" onClick={() => setIsFlipped(!isFlipped)}>
            <div className="qz-side-badge">{isFlipped ? "背面" : "正面"}</div>
            
            {!isFlipped ? (
              <>
                <div className="qz-flip-hint">點擊卡片翻面</div>
                <h2 className="qz-word">{activeWord}</h2>
                <div className="qz-ipa-row">
                  {getPhoneticText(current) ? `${getPhoneticText(current)}` : ''}
                  <button className="qz-audio-icon" onClick={(e) => { e.stopPropagation(); handleSpeak(activeWord); }}>🔊</button>
                </div>
                {getSentenceText(current) && (
                  <>
                    <div className="qz-line"></div>
                    <p className="qz-sentence">"{getSentenceText(current)}"</p>
                  </>
                )}
              </>
            ) : (
              <>
                <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '10px', fontWeight: 'bold' }}>中文意思</div>
                <h2 className="qz-chinese">{getMeaningText(current)}</h2>
              </>
            )}
          </div>

          <button className="qz-arrow-btn" onClick={handleNext}>›</button>
        </div>
      </div>

      {/* 3. 按鈕 */}
      <div className="qz-action-buttons">
        <button onClick={() => handleMarkUnknown(current)} className="qz-btn-wrong">❌ 未記住 ({unknownWords.length})</button>
        <button onClick={() => handleMarkKnown(current)} className="qz-btn-right">✅ 已記住 ({knownWords.length})</button>
      </div>

      {/* 4. 清單統計 */}
      <div className="qz-list-grid">
        <div className="qz-list-box" style={{ borderTop: '4px solid #10b981' }}>
          <h3 className="qz-list-header" style={{ color: '#047857' }}>🟢 已學會的單字清單 ({knownWords.length})</h3>
          <ul className="qz-ul">
            {knownWords.length === 0 ? (
              <li style={{color:'#94a3b8', fontStyle:'italic', textAlign:'center', padding:'20px'}}>目前尚無資料</li>
            ) : (
              knownWords.map((item, index) => {
                const w = getWordText(item);
                return (
                  <li key={`${w}-${index}`} className="qz-li" style={{ borderColor: '#a7f3d0' }}>
                    <div className="qz-li-left">
                      <button className="qz-li-btn-audio" onClick={() => handleSpeak(w)}>🔊</button>
                      <div className="qz-li-text-wrapper">
                        <span className="qz-li-word">{w}</span>
                        <span className="qz-li-meaning">{getMeaningText(item)}</span>
                      </div>
                    </div>
                    <div className="qz-li-status-icon" style={{ color: '#10b981' }}>✔️</div>
                  </li>
                );
              })
            )}
          </ul>
        </div>

        <div className="qz-list-box" style={{ borderTop: '4px solid #ef4444' }}>
          <h3 className="qz-list-header" style={{ color: '#b91c1c' }}>🔴 還需要加強的單字清單 ({unknownWords.length})</h3>
          <ul className="qz-ul">
            {unknownWords.length === 0 ? (
              <li style={{color:'#94a3b8', fontStyle:'italic', textAlign:'center', padding:'20px'}}>目前尚無資料</li>
            ) : (
              unknownWords.map((item, index) => {
                const w = getWordText(item);
                return (
                  <li key={`${w}-${index}`} className="qz-li" style={{ borderColor: '#fca5a5' }}>
                    <div className="qz-li-left">
                      <button className="qz-li-btn-audio" onClick={() => handleSpeak(w)}>🔊</button>
                      <div className="qz-li-text-wrapper">
                        <span className="qz-li-word">{w}</span>
                        <span className="qz-li-meaning">{getMeaningText(item)}</span>
                      </div>
                    </div>
                    <div className="qz-li-status-icon" style={{ color: '#ef4444' }}>⭕</div>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}