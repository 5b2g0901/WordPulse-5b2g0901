import React, { useState, useEffect } from 'react';

function ListeningQuiz({ vocabularyData, speechRate, setSpeechRate, handleSpeak }) {
  const [listeningIdx, setListeningIdx] = useState(0);
  const [listeningInput, setListeningInput] = useState('');
  const [listeningResult, setListeningResult] = useState('idle'); // idle, correct, wrong
  const [showListeningAnswer, setShowListeningAnswer] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Kích hoạt hiệu ứng đĩa quay đồng bộ với loa của hệ thống
  const triggerSpeak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = speechRate;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      // Fallback nếu hàm tổng quát từ App.js được truyền xuống
      handleSpeak(text);
    }
  };

  const handleVerifyListening = (e) => {
    e.preventDefault();
    const correctWord = vocabularyData[listeningIdx]?.word || '';
    if (listeningInput.toLowerCase().trim() === correctWord.toLowerCase().trim()) {
      setListeningResult('correct');
    } else {
      setListeningResult('wrong');
      setTimeout(() => setListeningResult('idle'), 1500);
    }
  };

  useEffect(() => {
    setListeningInput('');
    setListeningResult('idle');
    setShowListeningAnswer(false);
  }, [listeningIdx]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        padding: '36px 32px',
        width: '100%',
        maxWidth: '580px',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.15)',
        borderBottom: '8px solid #cbd5e1',
        boxSizing: 'border-box'
      }}>
        
        {/* ĐIỀU CHỈNH HỆ THỐNG */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px', backgroundColor: '#f8fafc', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <span style={{ fontSize: '13px', fontWeight: '800', color: '#475569' }}>🎛️ 語速調節:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, margin: '0 12px' }}>
              <input 
                type="range" min="0.5" max="1.3" step="0.05" 
                value={speechRate} onChange={(e) => setSpeechRate(parseFloat(e.target.value))} 
                style={{ width: '100%', height: '6px', cursor: 'pointer' }} 
              />
            </div>
            <span style={{ fontSize: '12px', fontWeight: '900', color: '#0284c7', backgroundColor: '#e0f2fe', padding: '2px 8px', borderRadius: '6px' }}>{speechRate}x</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '8px', borderTop: '1px dashed #e2e8f0' }}>
            <span style={{ fontSize: '13px', fontWeight: '800', color: '#166534' }}>📋 選取單字:</span>
            <select 
              value={listeningIdx} onChange={(e) => setListeningIdx(parseInt(e.target.value))} 
              style={{ flex: 1, backgroundColor: '#ffffff', color: '#0f172a', fontSize: '13px', fontWeight: '800', padding: '6px 12px', borderRadius: '10px', border: '2px solid #bbf7d0', outline: 'none' }}
            >
              {vocabularyData.map((v, idx) => (
                <option key={v.id} value={idx}>第 {idx + 1} 題 / 共 {vocabularyData.length} 題</option>
              ))}
            </select>
          </div>
        </div>

        {/* MÁY ĐĨA THAN VINTAGE */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '30px 0', padding: '20px 0', backgroundColor: '#b9d1e7', borderRadius: '20px' }}>
          <div 
            onClick={() => triggerSpeak(vocabularyData[listeningIdx]?.word)}
            className={isSpeaking ? "vinyl-playing" : ""}
            style={{
              width: '120px', height: '120px',
              backgroundColor: '#0f172a', borderRadius: '50%',
              border: '8px solid #334155', boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', position: 'relative'
            }}
          >
            <div style={{ width: '40px', height: '40px', backgroundColor: '#0284c7', borderRadius: '50%', border: '3px solid #ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '16px' }}>📢</span>
            </div>
          </div>

          <p style={{ fontSize: '13px', fontWeight: '800', color: '#64748b', marginTop: '14px', marginBottom: '8px' }}>
            {isSpeaking ? "🔊 正在播放音檔..." : "✨ 點擊大黑膠唱片即可播放聲音"}
          </p>

          <div className={isSpeaking ? "audio-wave-active" : ""} style={{ display: 'flex', alignItems: 'center', height: '30px' }}>
            <div className="audio-wave-bar"></div>
            <div className="audio-wave-bar"></div>
            <div className="audio-wave-bar"></div>
            <div className="audio-wave-bar"></div>
          </div>
        </div>

        {/* THỬ THÁCH NGHE CHÉP CHÍNH TẢ */}
        <div style={{ borderTop: '2px dashed #cbd5e1', paddingTop: '24px' }}>
          <h4 style={{ fontSize: '15px', fontWeight: '900', color: '#0f172a', margin: '0 0 12px 0', textAlign: 'left' }}>
            ✍️ 聽寫反饋小測試 (Dictation Challenge)
          </h4>

          <form onSubmit={handleVerifyListening} style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
            <input 
              type="text" value={listeningInput} onChange={(e) => setListeningInput(e.target.value)}
              placeholder="請聽音頻並在此盲打輸入單字..."
              style={{ flex: 1, padding: '12px 16px', borderRadius: '12px', border: '2px solid #cbd5e1', fontSize: '15px', fontWeight: '700', color: '#1e293b', outline: 'none' }}
            />
            <button type="submit" style={{ padding: '0 20px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: '900', cursor: 'pointer', boxShadow: '0 4px 0 #0369a1' }}>
              核對
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: '36px', backgroundColor: '#f8fafc', padding: '8px 14px', borderRadius: '10px' }}>
            <div>
              {listeningResult === 'correct' && <span style={{ color: '#10b981', fontWeight: '900', fontSize: '14px' }}>🎉 聽力太讚了！完全正確！</span>}
              {listeningResult === 'wrong' && <span style={{ color: '#ef4444', fontWeight: '900', fontSize: '14px' }}>❌ 拼寫好似有誤，再聽一次！</span>}
              {listeningResult === 'idle' && <span style={{ color: '#64748b', fontWeight: '700', fontSize: '13px' }}>等待核對中...</span>}
            </div>

            <button 
              type="button" 
              onClick={() => setShowListeningAnswer(!showListeningAnswer)}
              style={{ background: 'none', border: 'none', color: '#0369a1', fontSize: '13px', fontWeight: '800', cursor: 'pointer', textDecoration: 'underline' }}
            >
              {showListeningAnswer ? "🙈 隱藏答案" : "👁️ 顯示答案"}
            </button>
          </div>

          {showListeningAnswer && (
            <div style={{ marginTop: '12px', padding: '14px', backgroundColor: '#e0f2fe', borderRadius: '12px', borderLeft: '5px solid #0ea5e9', textAlign: 'left' }}>
              <p style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: '900', color: '#0369a1' }}>
                💡 {vocabularyData[listeningIdx]?.word}
              </p>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#334155' }}>
                中文含意：{vocabularyData[listeningIdx]?.meaningZh}
              </p>
            </div>
          )}
        </div>

        {/* FOOTER ĐIỀU HƯỚNG */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
          <button 
            onClick={() => setListeningIdx(p => Math.max(0, p - 1))} disabled={listeningIdx === 0}
            style={{ opacity: listeningIdx === 0 ? 0.5 : 1, padding: '8px 16px', backgroundColor: '#e2e8f0', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: '800', cursor: 'pointer' }}
          >
            ⏮️ 上一題
          </button>
          <span style={{ fontSize: '14px', fontWeight: '900', color: '#94a3b8', alignSelf: 'center' }}>
            {listeningIdx + 1} / {vocabularyData.length}
          </span>
          <button 
            onClick={() => setListeningIdx(p => Math.min(vocabularyData.length - 1, p + 1))} disabled={listeningIdx === vocabularyData.length - 1}
            style={{ opacity: listeningIdx === vocabularyData.length - 1 ? 0.5 : 1, padding: '8px 16px', backgroundColor: '#e2e8f0', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: '800', cursor: 'pointer' }}
          >
            下一題 ⏭️
          </button>
        </div>

      </div>
    </div>
  );
}

export default ListeningQuiz;