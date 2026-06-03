import React, { useState, useEffect } from 'react';
import { vocabularyData } from './data/vocabulary';
import DeepDive from './components/DeepDive';
import SpeedTyping from './components/SpeedTyping';
import BlockBlast from './components/BlockBlast';

function App() {
  const [currentMode, setCurrentMode] = useState('quiz');
  const [userNotes, setUserNotes] = useState({});
  const [activeNoteText, setActiveNoteText] = useState('');

  // --- MODES STATE ---
  const [diveIdx, setDiveIdx] = useState(0);
  const [cardIdx, setCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [typingIdx, setTypingIdx] = useState(0);
  const [typedInput, setTypedInput] = useState('');
  const [typingStatus, setTypingStatus] = useState('idle');
  const [typingScore, setTypingScore] = useState(0);
  const [listeningIdx, setListeningIdx] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechRate, setSpeechRate] = useState(0.85);
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizOptions, setQuizOptions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [gameBlocks, setGameBlocks] = useState([]);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [gameScore, setGameScore] = useState(0);
  const [shakeBlockId, setShakeBlockId] = useState(null);

  useEffect(() => {
    if (vocabularyData[diveIdx]) {
      setActiveNoteText(userNotes[vocabularyData[diveIdx].id] || '');
    }
  }, [diveIdx, userNotes]);

  const saveNote = () => {
    if (vocabularyData[diveIdx]) {
      setUserNotes(prev => ({ ...prev, [vocabularyData[diveIdx].id]: activeNoteText }));
    }
  };

  useEffect(() => {
    if (currentMode === 'quiz' && !isQuizFinished) {
      const currentWord = vocabularyData[quizIdx];
      if (currentWord) {
        const rands = vocabularyData.filter(v => v.id !== currentWord.id).sort(() => 0.5 - Math.random()).slice(0, 3);
        setQuizOptions([...rands, currentWord].sort(() => 0.5 - Math.random()));
        setSelectedAnswer(null);
      }
    }
  }, [quizIdx, currentMode, isQuizFinished]);

  useEffect(() => {
    if (currentMode === 'game') { initBlockGame(); }
  }, [currentMode]);

  const initBlockGame = () => {
    const items = [...vocabularyData].sort(() => 0.5 - Math.random()).slice(0, 6);
    const wordBlocks = items.map(v => ({ id: `w-${v.id}`, pairId: v.id, text: v.word, type: 'word', cleared: false }));
    const meanBlocks = items.map(v => ({ id: `m-${v.id}`, pairId: v.id, text: v.meaningZh, type: 'mean', cleared: false }));
    setGameBlocks([...wordBlocks, meanBlocks].flat().sort(() => 0.5 - Math.random()));
    setSelectedBlock(null);
    setGameScore(0);
  };

  const handleBlockClick = (block) => {
    if (block.cleared) return;
    if (!selectedBlock) { setSelectedBlock(block); return; }
    if (selectedBlock.id === block.id) { setSelectedBlock(null); return; }
    if (selectedBlock.pairId === block.pairId && selectedBlock.type !== block.type) {
      setGameBlocks(prev => prev.map(b => b.pairId === block.pairId ? { ...b, cleared: true } : b));
      setGameScore(prev => prev + 20);
      setSelectedBlock(null);
    } else {
      setShakeBlockId(block.id);
      setGameScore(prev => Math.max(0, prev - 10));
      setTimeout(() => setShakeBlockId(null), 500);
      setSelectedBlock(null);
    }
  };

  const handleTypingSubmit = (e) => {
    e.preventDefault();
    if (typedInput.toLowerCase().trim() === vocabularyData[typingIdx].word.toLowerCase().trim()) {
      setTypingStatus('correct');
      setTypingScore(prev => prev + 10);
      setTimeout(() => {
        setTypingIdx(prev => (prev < vocabularyData.length - 1 ? prev + 1 : 0));
        setTypedInput('');
        setTypingStatus('idle');
      }, 800);
    } else {
      setTypingStatus('wrong');
      setTimeout(() => setTypingStatus('idle'), 800);
    }
  };

  const handleSpeak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = speechRate;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const getSentenceAnalysis = (word) => {
    const analysisMap = {
      "Sibling": { structures: ["I have [quantity] siblings"], grammar: "名詞" },
      "Nuclear family": { structures: ["Live in a nuclear family"], grammar: "名詞短語" },
      "Personal hygiene": { structures: ["Maintain personal hygiene"], grammar: "名詞短語" },
      "Ingredient": { structures: ["Key ingredient in/for"], grammar: "名詞" },
      "Affordable": { structures: ["At affordable prices"], grammar: "形容詞" },
      "Convenient": { structures: ["It is convenient to do"], grammar: "形容詞" },
      "Explore": { structures: ["Explore local markets"], grammar: "動詞" },
      "Intersection": { structures: ["At the traffic intersection"], grammar: "名詞" },
      "Memorable": { structures: ["A memorable journey"], grammar: "形容詞" },
      "Privacy": { structures: ["Respect someone's privacy"], grammar: "名詞" }
    };
    return analysisMap[word] || { structures: ["常用句型"], grammar: "詞性分析" };
  };

  return (
    /* 🌈 THAY ĐỔI MÀU NỀN TOÀN BỘ PHÔNG NỀN: Đổi thành màu Hồng Tím Pastel ngọt ngào */
    <div 
      className="min-h-screen antialiased px-4 pb-20"
      style={{ 
        fontFamily: '"Fredoka", "Microsoft JhengHei", sans-serif',
        backgroundColor: '#FFEBF0', // Màu hồng kẹo ngọt chủ đạo
        minHeight: '100vh',
        paddingTop: '20px'
      }}
    >
      
      {/* THAY ĐỔI THANH TRÊN (HEADER): Viền bo tròn dày, nền Vàng Chanh hoạt hình */}
      <header 
        className="max-w-5xl mx-auto py-4 px-6 flex flex-col md:flex-row justify-between items-center gap-4 mb-8"
        style={{
          backgroundColor: '#FFF4D4', // Nền vàng tươi
          borderRadius: '24px',
          border: '4px solid #FFC107', // Viền vàng đậm 3D phong cách game
          boxShadow: '0 8px  #FFB300'
        }}
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 flex items-center justify-center text-2xl animate-bounce"
            style={{
              backgroundColor: '#FF6B8B',
              borderRadius: '16px',
              borderBottom: '4px solid #D84B6B'
            }}
          >
            🦊
          </div>
          <div>
            <h1 
              className="text-3xl font-black tracking-wider"
              style={{
                background: 'linear-gradient(to right, #FF477E, #3A86FF, #00F5D4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: '900'
              }}
            >
              WordPulse
            </h1>
            <p className="text-[11px] uppercase font-black tracking-widest" style={{ color: '#9C27B0' }}>
              ZH-TW / EN 沉浸式學習空間
            </p>
          </div>
        </div>

        {/* THANH ĐIỀU HƯỚNG MENU: Nền Xanh Mint dịu mắt phối với nút đa màu sắc */}
        <nav 
          className="flex flex-wrap justify-center gap-2 p-2 rounded-2xl"
          style={{
            backgroundColor: '#E8FDF5', // Nền xanh mint nhạt
            border: '3px solid #A7F3D0'
          }}
        >
          {[
            { id: 'dive', label: '🚀 深度探索', activeBg: '#FF477E', border: '#D81B60' },
            { id: 'card', label: '📇 單字卡', activeBg: '#3A86FF', border: '#1D4ED8' },
            { id: 'gallery', label: '🖼️ 單字庫', activeBg: '#20BF55', border: '#1B8A3F' },
            { id: 'typing', label: '⌨️ 拼字輸入', activeBg: '#F15BB5', border: '#C2185B' },
            { id: 'listening', label: '🎧 聽力訓練', activeBg: '#9B5DE5', border: '#6A1B9A' },
            { id: 'quiz', label: '🧠 核心測驗', activeBg: '#FF9F1C', border: '#E65100' },
            { id: 'game', label: '🧩 連連看', activeBg: '#00F5D4', border: '#00B4D8' }
          ].map(nav => {
            const isActive = currentMode === nav.id;
            return (
              <button 
                key={nav.id} 
                onClick={() => { setCurrentMode(nav.id); setIsFlipped(false); }} 
                className="px-3 py-2 rounded-xl text-xs font-black uppercase transition-all"
                style={{
                  backgroundColor: isActive ? nav.activeBg : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : '#4A5568',
                  border: isActive ? `2px solid ${nav.border}` : '2px solid #CBD5E1',
                  borderBottom: isActive ? `5px solid ${nav.border}` : '4px solid #94A3B8',
                  transform: isActive ? 'translateY(1px)' : 'none',
                  cursor: 'pointer'
                }}
              >
                {nav.label}
              </button>
            );
          })}
        </nav>
      </header>

      {/* Vùng hiển thị Nội dung chính */}
      <main className="max-w-5xl mx-auto" style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '32px', border: '4px solid #FBC02D', boxShadow: '0 10px 0 #FBC02D' }}>
        {currentMode === 'dive' && (
          <DeepDive diveIdx={diveIdx} vocabularyData={vocabularyData} handleSpeak={handleSpeak} getSentenceAnalysis={getSentenceAnalysis} activeNoteText={activeNoteText} setActiveNoteText={setActiveNoteText} saveNote={saveNote} setDiveIdx={setDiveIdx} />
        )}

        {/* Thẻ từ */}
        {currentMode === 'card' && (
          <div className="flex flex-col items-center justify-center py-6">
            <div onClick={() => setIsFlipped(!isFlipped)} className="w-full max-w-sm h-72 cursor-pointer perspective mb-6">
              <div className={`relative w-full h-full duration-300 transform-style preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                
                {/* Mặt trước */}
                <div className="absolute inset-0 w-full h-full rounded-3xl p-8 flex flex-col justify-between items-center backface-hidden" style={{ backgroundColor: '#FFE5EC', border: '4px solid #FFB3C6', boxShadow: '0 8px #FFB3C6' }}>
                  <span className="text-xs font-black tracking-wider text-[#FF477E] bg-white px-2.5 py-1 rounded-full border border-[#FFB3C6]">正面 ✨</span>
                  <h3 className="text-4xl font-black text-[#FF0A54] tracking-wide">{vocabularyData[cardIdx]?.word}</h3>
                  <span className="text-[11px] bg-[#FFC6FF] text-[#7209B7] px-3 py-1.5 rounded-xl font-black border border-[#B5179E]">點擊翻面 🔄</span>
                </div>

                {/* Mặt sau */}
                <div className="absolute inset-0 w-full h-full rounded-3xl p-8 flex flex-col justify-between items-center rotate-y-180 backface-hidden" style={{ backgroundColor: '#E8FCCF', border: '4px solid #C1F183', boxShadow: '0 8px #C1F183' }}>
                  <span className="text-xs font-black tracking-wider text-[#4B7314] bg-white px-2.5 py-1 rounded-full border border-[#C1F183]">背面 🧸</span>
                  <h4 className="text-2xl font-black text-[#385A09] text-center leading-snug">{vocabularyData[cardIdx]?.meaningZh}</h4>
                  <span className="text-[11px] bg-white text-[#4B7314] px-3 py-1.5 rounded-xl font-black border border-[#C1F183]">點擊翻面 🔄</span>
                </div>

              </div>
            </div>
            
            <div className="flex gap-4 items-center px-4 py-2 rounded-2xl" style={{ backgroundColor: '#FFF176', border: '2px solid #FBC02D', boxShadow: '0 4px #FBC02D' }}>
              <button onClick={() => { setIsFlipped(false); setCardIdx(p => Math.max(0, p - 1)); }} disabled={cardIdx === 0} className="w-16 h-10 rounded-xl bg-white border-2 border-b-4 border-gray-300 flex items-center justify-center font-black disabled:opacity-30 text-gray-700 active:translate-y-0.5">◀ 上一個</button>
              <span className="text-xs font-mono font-black text-gray-800 px-2">{cardIdx + 1} / {vocabularyData.length}</span>
              <button onClick={() => { setIsFlipped(false); setCardIdx(p => Math.min(vocabularyData.length - 1, p + 1)); }} disabled={cardIdx === vocabularyData.length - 1} className="w-16 h-10 rounded-xl bg-white border-2 border-b-4 border-gray-300 flex items-center justify-center font-black disabled:opacity-30 text-gray-700 active:translate-y-0.5">下一個 ▶</button>
            </div>
          </div>
        )}

        {/* Thư viện từ */}
        {currentMode === 'gallery' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {vocabularyData.map((v, i) => {
              const cardColors = [
                { bg: '#FFECEF', border: '#FFC2CD', text: '#CC2B52' }, 
                { bg: '#E6F4EA', border: '#B7E1CD', text: '#137333' }, 
                { bg: '#E8F0FE', border: '#C2D7FA', text: '#1A73E8' }, 
                { bg: '#FEF7E0', border: '#FCE8B2', text: '#B06000' }  
              ];
              const style = cardColors[i % cardColors.length];

              return (
                <div key={v.id} className="border-4 rounded-2xl p-5 hover:scale-105 transition-transform duration-200 flex flex-col justify-between gap-4" style={{ backgroundColor: style.bg, borderColor: style.border, color: style.text, boxShadow: '0 6px rgba(0,0,0,0.05)' }}>
                  <div>
                    <h4 className="text-2xl font-black tracking-wide mb-1">{v.word}</h4>
                    <p className="text-xs font-black inline-block bg-white/70 border border-current px-2.5 py-1 rounded-lg mb-3">🍬 {v.meaningZh}</p>
                    {userNotes[v.id] && (
                      <div className="mb-3 px-3 py-2 bg-yellow-100 border-2 border-yellow-300 text-xs text-yellow-800 font-bold rounded-xl truncate">
                        📌 筆記: {userNotes[v.id]}
                      </div>
                    )}
                  </div>
                  <p className="text-xs opacity-90 bg-white/50 border border-current/10 p-3 rounded-xl italic leading-relaxed">
                    "{v.example}"
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {currentMode === 'typing' && (
          <SpeedTyping vocabularyData={vocabularyData} typingIdx={typingIdx} typingScore={typingScore} typedInput={typedInput} setTypedInput={setTypedInput} typingStatus={typingStatus} handleTypingSubmit={handleTypingSubmit} />
        )}

        {/* Luyện nghe */}
        {currentMode === 'listening' && (
          <div className="max-w-md mx-auto text-center p-6 rounded-3xl space-y-6" style={{ backgroundColor: '#FDF2F8', border: '4px solid #FBCFE8', boxShadow: '0 8px #FBCFE8' }}>
            <div className="bg-[#FCE7F3] px-3 py-2 rounded-xl border-2 border-[#F9A8D4] inline-flex items-center gap-2">
              <label className="text-[10px] text-pink-700 font-black uppercase tracking-wider">語速調節:</label>
              <input type="range" min="0.5" max="1.5" step="0.1" value={speechRate} onChange={(e) => setSpeechRate(parseFloat(e.target.value))} className="accent-pink-600 cursor-pointer h-1" />
              <span className="text-[10px] font-mono text-pink-600 font-black px-1.5 py-0.5 bg-white border border-pink-200 rounded-md">{speechRate}x</span>
            </div>
            
            <div className="py-4">
              <button onClick={() => handleSpeak(vocabularyData[listeningIdx]?.word)} className="w-20 h-20 bg-[#EC4899] hover:bg-[#F472B6] rounded-full border-b-4 border-[#BE185D] text-2xl active:translate-y-1 transition-all mb-4 shadow-md text-white">📢</button>
              <h3 className="text-3xl font-black text-[#9D174D] tracking-wide">{vocabularyData[listeningIdx]?.word}</h3>
            </div>
            
            <p className="text-sm text-pink-900 bg-white border-2 border-pink-100 p-4 rounded-xl italic cursor-pointer font-bold transition-colors hover:bg-pink-50" onClick={() => handleSpeak(vocabularyData[listeningIdx]?.example)}>
              "{vocabularyData[listeningIdx]?.example}" 🔊
            </p>
          </div>
        )}

        {/* Trắc nghiệm */}
        {currentMode === 'quiz' && (
          <div className="max-w-md mx-auto pb-24">
            {!isQuizFinished ? (
              <div className="rounded-3xl p-6 relative" style={{ backgroundColor: '#FFFDF0', border: '4px solid #FDE68A', boxShadow: '0 8px #FDE68A' }}>
                
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xs font-black tracking-wider text-pink-600 bg-pink-50 border-2 border-pink-200 px-3 py-1.5 rounded-full">
                    🎯 題目 {quizIdx + 1}
                  </span>
                  <span className="text-xs font-black tracking-wider text-blue-600 bg-blue-50 border-2 border-blue-200 px-3 py-1.5 rounded-full">
                    ⭐ 當前得分: {quizScore}
                  </span>
                </div>

                <div className="mb-6 text-center py-4 bg-[#FEF3C7] border-2 border-[#FCD34D] rounded-2xl">
                  <p className="text-xs text-amber-800 font-black uppercase tracking-wider mb-1">請問以下哪個是正確的英文單字？</p>
                  <h3 className="text-2xl font-black text-[#78350F]">👉 {vocabularyData[quizIdx]?.meaningZh}</h3>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {quizOptions.map((option, idx) => {
                    const isCurrentSelected = selectedAnswer === option.word;
                    const isCorrectAnswer = option.word === vocabularyData[quizIdx]?.word;
                    
                    let btnStyle = { backgroundColor: '#EFF6FF', borderColor: '#93C5FD', color: '#1E40AF' };
                    if (selectedAnswer !== null) {
                      if (isCurrentSelected) {
                        btnStyle = isCorrectAnswer 
                          ? { backgroundColor: '#10B981', borderColor: '#047857', color: '#FFFFFF' } 
                          : { backgroundColor: '#EF4444', borderColor: '#B91C1C', color: '#FFFFFF' };
                      } else if (isCorrectAnswer) {
                        btnStyle = { backgroundColor: '#D1FAE5', borderColor: '#34D399', color: '#065F46' };
                      } else {
                        btnStyle = { backgroundColor: '#F9FAFB', borderColor: '#E5E7EB', color: '#9CA3AF', opacity: 0.4 };
                      }
                    }

                    return (
                      <button 
                        key={idx} 
                        onClick={() => { 
                          if (selectedAnswer === null) {
                            setSelectedAnswer(option.word); 
                            if (option.word === vocabularyData[quizIdx]?.word) setQuizScore(p => p + 10); 
                          }
                        }} 
                        disabled={selectedAnswer !== null} 
                        className="w-full p-4 rounded-xl border-2 font-black text-sm text-left border-b-4 transition-all"
                        style={{ ...btnStyle }}
                      >
                        <span className="inline-block w-6 h-6 rounded-lg bg-black/5 text-center leading-6 text-xs mr-3 font-bold">{idx + 1}</span>
                        {option.word}
                      </button>
                    );
                  })}
                </div>

                {/* Thanh kết quả dưới đáy */}
                {selectedAnswer !== null && (
                  <div className="fixed bottom-0 left-0 right-0 py-5 px-6 border-t-4 flex flex-col sm:flex-row justify-between items-center gap-4 z-50"
                    style={{
                      backgroundColor: selectedAnswer === vocabularyData[quizIdx]?.word ? '#A7F3D0' : '#FCA5A5',
                      borderColor: selectedAnswer === vocabularyData[quizIdx]?.word ? '#059669' : '#DC2626',
                      color: selectedAnswer === vocabularyData[quizIdx]?.word ? '#064E3B' : '#7F1D1D'
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{selectedAnswer === vocabularyData[quizIdx]?.word ? '🎉' : '😢'}</span>
                      <div>
                        <p className="text-base font-black uppercase tracking-wider">
                          {selectedAnswer === vocabularyData[quizIdx]?.word ? '太棒了！答對囉！' : '好可惜，答錯了！'}
                        </p>
                        <p className="text-xs font-bold opacity-90 mt-0.5">
                          正確答案是： <span className="font-black underline">{vocabularyData[quizIdx]?.word}</span>
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => { 
                        if (quizIdx < vocabularyData.length - 1) setQuizIdx(p => p + 1); else setIsQuizFinished(true);
                        setSelectedAnswer(null); 
                      }} 
                      className="px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest border-b-4 text-white transition-all w-full sm:w-auto"
                      style={{
                        backgroundColor: selectedAnswer === vocabularyData[quizIdx]?.word ? '#059669' : '#DC2626',
                        borderColor: selectedAnswer === vocabularyData[quizIdx]?.word ? '#047857' : '#B91C1C'
                      }}
                    >
                      下一題 ▶
                    </button>
                  </div>
                )}

              </div>
            ) : (
              <div className="bg-[#EEF2F6] border-4 border-[#CBD5E1] rounded-3xl p-8 text-center shadow-[0_8px_0_0_#CBD5E1] space-y-4">
                <div className="text-5xl">🏆</div>
                <h3 className="text-2xl font-black text-[#1E293B]">✨ 恭喜完成本次測驗！ ✨</h3>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">您的最終得分</p>
                <span className="text-5xl font-black text-[#4F46E5] block py-2">{quizScore} / 100</span>
                <button onClick={() => { setQuizIdx(0); setQuizScore(0); setIsQuizFinished(false); setSelectedAnswer(null); }} className="w-full py-3.5 bg-[#4F46E5] border-b-4 border-[#3730A3] text-white font-black rounded-xl text-xs uppercase tracking-wider active:translate-y-0.5 transition-all">重新挑戰 🚀</button>
              </div>
            )}
          </div>
        )}

        {currentMode === 'game' && (
          <BlockBlast gameScore={gameScore} initBlockGame={initBlockGame} gameBlocks={gameBlocks} selectedBlock={selectedBlock} shakeBlockId={shakeBlockId} handleBlockClick={handleBlockClick} />
        )}
      </main>
    </div>
  );
}

export default App;