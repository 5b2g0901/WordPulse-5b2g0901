import React, { useState, useEffect } from 'react';
import { vocabularyData } from './data/vocabulary';
import DeepDive from './components/DeepDive';
import SpeedTyping from './components/SpeedTyping';
import BlockBlast from './components/BlockBlast';
import ListeningQuiz from './components/ListeningQuiz';
import UserProfile from './components/UserProfile';
import CourseSyllabus from './components/CourseSyllabus';

function App() {
  const [currentMode, setCurrentMode] = useState('syllabus'); 
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
  
  // --- STATE CORE QUIZ ---
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizOptions, setQuizOptions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  
  // --- STATE GAME ---
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

  const handleSelectQuizAnswer = (optionWord) => {
    if (selectedAnswer !== null) return; 
    setSelectedAnswer(optionWord);
    const isCorrect = optionWord === vocabularyData[quizIdx]?.word;
    if (isCorrect) {
      setQuizScore(prev => prev + 10);
    }
    setTimeout(() => {
      if (quizIdx < vocabularyData.length - 1) {
        setQuizIdx(prev => prev + 1);
      } else {
        setIsQuizFinished(true);
      }
    }, 1200);
  };

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
    <div 
      className="min-h-screen antialiased px-4 pb-20"
      style={{ 
        fontFamily: '"Brandon Grotesque", "Helvetica Neue", Arial, sans-serif',
        backgroundColor: '#E0F2FE', 
        minHeight: '100vh',
        paddingTop: '20px'
      }}
    >
      
      {/* KHU VỰC CSS FIX TRIỆT ĐỂ: NỀN XANH CHỮ TRẮNG, NỀN TRẮNG CHỮ ĐEN MỜI XEM QUA */}
      <style>{`
        /* Đảm bảo toàn bộ phông chữ thống nhất */
        *, body, div, h1, h2, h3, h4, h5, h6, p, span, label, button, input, textarea, li, strong {
          font-family: "Brandon Grotesque", "Helvetica Neue", Arial, sans-serif !important;
        }

        /* Quy tắc 1: Trong vùng container nền xanh (Mặc định tất cả các text là màu trắng tinh) */
        .main-blue-container,
        .main-blue-container h1,
        .main-blue-container h2,
        .main-blue-container h3,
        .main-blue-container h4,
        .main-blue-container h5,
        .main-blue-container p,
        .main-blue-container span,
        .main-blue-container label,
        .main-blue-container div:not(.bg-white):not([style*="background-color: white"]) {
          color: #FFFFFF !important;
        }

        .main-blue-container .sub-light-label {
          color: #BAE6FD !important;
          font-weight: 800;
        }

        /* Quy tắc 2: TẤT CẢ CÁC VÙNG NỀN TRẮNG (CÁC KHỐI BÊN DƯỚI) THÌ CHỮ PHẢI MÀU ĐEN */
        /* Bao gồm: Toàn bộ thẻ con của .bg-white, thẻ Syllabus, các thẻ li, p, span bên trong nó */
        .bg-white,
        .bg-white *,
        [style*="background-color: white"] *,
        [style*="background-color: rgb(255, 255, 255)"] *,
        .course-syllabus-wrapper .bg-white,
        .course-syllabus-wrapper .bg-white *,
        .gallery-card,
        .gallery-card *,
        .quiz-question-box,
        .quiz-question-box * {
          color: #1E293B !important; /* Chữ màu đen xám đậm thanh lịch, cực nét */
        }

        /* Đảm bảo tiêu đề các tuần học hoặc từ khóa có màu đen tuyền trên nền trắng */
        .course-syllabus-wrapper .bg-white h1,
        .course-syllabus-wrapper .bg-white h2,
        .course-syllabus-wrapper .bg-white h3,
        .course-syllabus-wrapper .bg-white h4,
        .course-syllabus-wrapper .bg-white p,
        .course-syllabus-wrapper .bg-white li,
        .course-syllabus-wrapper .bg-white span,
        .course-syllabus-wrapper .bg-white strong {
          color: #0F172A !important;
        }

        /* Nút lựa chọn của game连连看 nằm trên nền trắng */
        .game-block-fix button {
          background-color: #FFFFFF !important;
          color: #0369A1 !important; 
          font-weight: 900 !important;
          border: 2px solid #38BDF8 !important;
        }

        .quiz-option-btn-default {
          color: #FFFFFF !important; 
        }
      `}</style>
      
      {/* HEADER BAR */}
      <header 
        className="max-w-5xl mx-auto py-4 px-6 flex flex-col md:flex-row justify-between items-center gap-4 mb-8"
        style={{
          backgroundColor: '#0284C7', 
          borderRadius: '24px',
          border: '4px solid #0EA5E9', 
          boxShadow: '0 8px #0369A1',
          color: '#FFFFFF'
        }}
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 flex items-center justify-center text-2xl animate-bounce"
            style={{
              backgroundColor: '#38BDF8',
              borderRadius: '16px',
              borderBottom: '4px solid #0284C7'
            }}
          >
            🦊
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-wider text-white" style={{ fontWeight: '900', color: '#FFFFFF' }}>
              WordPulse
            </h1>
            <p className="text-[11px] uppercase font-black tracking-widest text-[#E0F2FE]">
              TW / EN 沉浸式學習空間
            </p>
          </div>
        </div>

        {/* MENU TABS */}
        <nav 
          className="flex flex-wrap justify-center gap-2 p-2 rounded-2xl"
          style={{
            backgroundColor: '#0369A1', 
            border: '3px solid #0EA5E9'
          }}
        >
          {[
            { id: 'dive', label: '🚀 深度探索' },
            { id: 'card', label: '📇 單字卡' },
            { id: 'gallery', label: '🖼️ 單字庫' },
            { id: 'typing', label: '⌨️ 拼字輸入' },
            { id: 'listening', label: '🎧 聽力訓練' },
            { id: 'quiz', label: '🧠 核心測驗' },
            { id: 'game', label: '🧩 連連看' },
            { id: 'profile', label: '👤 個人簡介' },
            { id: 'syllabus', label: '📚 本學期課程' }
          ].map(nav => {
            const isActive = currentMode === nav.id;
            return (
              <button 
                key={nav.id} 
                onClick={() => { setCurrentMode(nav.id); setIsFlipped(false); }} 
                className="px-3 py-2 rounded-xl text-xs font-black uppercase transition-all"
                style={{
                  backgroundColor: isActive ? '#FFFFFF' : '#0284C7',
                  color: isActive ? '#0369A1' : '#FFFFFF', 
                  border: isActive ? '2px solid #38BDF8' : '2px solid #0284C7',
                  borderBottom: isActive ? '5px solid #38BDF8' : '4px solid #0369A1',
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

      {/* MAIN BLUE CONTAINER */}
      <main 
        className="max-w-5xl mx-auto main-blue-container" 
        style={{ 
          backgroundColor: '#0284C7', 
          padding: '32px', 
          borderRadius: '32px', 
          border: '4px solid #38BDF8', 
          boxShadow: '0 10px 0 #0369A1' 
        }}
      >
        
        {/* 1. 🚀 深度探索 */}
        {currentMode === 'dive' && (
          <div className="space-y-6 text-center">
            <div>
              <span className="sub-light-label block text-sm uppercase tracking-widest mb-1">Current Word</span>
              <h2 className="text-5xl font-black tracking-wide text-white">{vocabularyData[diveIdx]?.word}</h2>
            </div>
            
            <div className="py-2">
              <button onClick={() => handleSpeak(vocabularyData[diveIdx]?.word)} className="p-3 bg-[#0EA5E9] border-2 border-[#7DD3FC] rounded-full hover:scale-110 transition-transform">🔊</button>
            </div>

            <hr className="border-sky-400/40 my-4" />

            <div>
              <span className="sub-light-label block text-sm mb-1">中文釋義</span>
              <p className="text-2xl font-bold text-white">{vocabularyData[diveIdx]?.meaningZh}</p>
            </div>

            <div>
              <span className="sub-light-label block text-sm mb-1">情境例句</span>
              <p className="text-lg italic text-sky-100 px-6 max-w-2xl mx-auto">"{vocabularyData[diveIdx]?.example}"</p>
            </div>

            <div className="flex justify-center gap-6">
              <div>
                <span className="sub-light-label block text-xs mb-1">詞性標籤</span>
                <span className="inline-block bg-sky-500/50 px-3 py-1 rounded-xl text-xs font-bold border border-sky-300">🏷️ {getSentenceAnalysis(vocabularyData[diveIdx]?.word).grammar}</span>
              </div>
              <div>
                <span className="sub-light-label block text-xs mb-1">推薦句型</span>
                <span className="inline-block bg-sky-500/50 px-3 py-1 rounded-xl text-xs font-bold border border-sky-300">💡 {getSentenceAnalysis(vocabularyData[diveIdx]?.word).structures[0]}</span>
              </div>
            </div>

            <div className="flex gap-4 items-center justify-center pt-4">
              <button onClick={() => setDiveIdx(p => Math.max(0, p - 1))} disabled={diveIdx === 0} className="px-4 py-2 bg-white text-slate-900 border-2 rounded-xl text-xs font-black disabled:opacity-30">◀ 上一個</button>
              <span className="font-mono font-black text-white">{diveIdx + 1} / {vocabularyData.length}</span>
              <button onClick={() => setDiveIdx(p => Math.min(vocabularyData.length - 1, p + 1))} disabled={diveIdx === vocabularyData.length - 1} className="px-4 py-2 bg-white text-slate-900 border-2 rounded-xl text-xs font-black disabled:opacity-30">下一個 ▶</button>
            </div>

            <div className="max-w-md mx-auto pt-4 text-left">
              <label className="sub-light-label block text-xs mb-1">📌 筆記空間</label>
              <textarea value={activeNoteText} onChange={(e) => setActiveNoteText(e.target.value)} placeholder="在此輸入您對該單字的記憶聯想、補充筆記..." className="w-full p-3 rounded-xl bg-white border-2 border-sky-300 text-slate-900 text-sm focus:outline-none" rows={3} />
              <button onClick={saveNote} className="mt-2 w-full py-2 bg-emerald-500 border-b-4 border-emerald-700 text-white font-black text-xs rounded-xl uppercase tracking-wider active:translate-y-0.5 transition-all">💾 儲存筆記</button>
            </div>
          </div>
        )}

        {/* 2. 📇 單字卡 */}
        {currentMode === 'card' && (
          <div className="flex flex-col items-center justify-center py-6">
            <div onClick={() => setIsFlipped(!isFlipped)} className="w-full max-w-sm h-72 cursor-pointer perspective mb-6">
              <div className={`relative w-full h-full duration-300 transform-style preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                <div className="absolute inset-0 w-full h-full rounded-3xl p-8 flex flex-col justify-between items-center backface-hidden" style={{ backgroundColor: '#0369A1', border: '4px solid #38BDF8', boxShadow: '0 8px #38BDF8' }}>
                  <span className="text-xs font-black tracking-wider bg-[#0284C7] px-2.5 py-1 rounded-full border border-[#38BDF8] text-white">正面 ✨</span>
                  <h3 className="text-4xl font-black tracking-wide text-white"> {vocabularyData[cardIdx]?.word}</h3>
                  <span className="text-[11px] bg-white text-[#0369A1] px-3 py-1.5 rounded-xl font-black border border-[#38BDF8]">點擊翻面 🔄</span>
                </div>
                <div className="absolute inset-0 w-full h-full rounded-3xl p-8 flex flex-col justify-between items-center rotate-y-180 backface-hidden" style={{ backgroundColor: '#0EA5E9', border: '4px solid #BAE6FD', boxShadow: '0 8px #BAE6FD' }}>
                  <span className="text-xs font-black tracking-wider bg-[#0284C7] px-2.5 py-1 rounded-full border border-[#BAE6FD] text-white">背面 🧸</span>
                  <h4 className="text-2xl font-black text-center leading-snug text-white">{vocabularyData[cardIdx]?.meaningZh}</h4>
                  <span className="text-[11px] bg-white text-[#0EA5E9] px-3 py-1.5 rounded-xl font-black border border-[#BAE6FD]">點擊翻面 🔄</span>
                </div>
              </div>
            </div>
            <div className="flex gap-4 items-center px-4 py-2 rounded-2xl" style={{ backgroundColor: '#0369A1', border: '2px solid #38BDF8' }}>
              <button onClick={() => { setIsFlipped(false); setCardIdx(p => Math.max(0, p - 1)); }} disabled={cardIdx === 0} className="px-4 py-2 rounded-xl bg-white border-2 text-slate-900 font-black disabled:opacity-30">◀ 上一個</button>
              <span className="text-xs font-mono font-black px-2 text-white">{cardIdx + 1} / {vocabularyData.length}</span>
              <button onClick={() => { setIsFlipped(false); setCardIdx(p => Math.min(vocabularyData.length - 1, p + 1)); }} disabled={cardIdx === vocabularyData.length - 1} className="px-4 py-2 rounded-xl bg-white border-2 text-slate-900 font-black disabled:opacity-30">下一個 ▶</button>
            </div>
          </div>
        )}

        {/* 3. 🖼️ 單字庫 */}
{currentMode === 'gallery' && (
  <div className="max-w-4xl mx-auto">
    {vocabularyData.map((v, index) => (
      <div key={v.id}>
        
        <div className="py-8 text-center">
          
          <h3
            className="text-3xl font-black mb-4"
            style={{ color: '#FFFFFF' }}
          >
            {v.word}
          </h3>

          <p
            className="text-xl mb-4"
            style={{ color: '#E0F2FE' }}
          >
            {v.meaningZh}
          </p>

          <p
            className="italic text-lg mb-5 px-4"
            style={{ color: '#FFFFFF' }}
          >
            "{v.example}"
          </p>

          <button
            onClick={() => handleSpeak(v.word)}
            className="px-4 py-2 rounded-lg font-bold"
            style={{
              backgroundColor: '#FFFFFF',
              color: '#0369A1'
            }}
          >
            🔊 發音
          </button>

          {userNotes[v.id] && (
            <div
              className="mt-4 p-3 rounded-xl"
              style={{
                backgroundColor: '#FEF3C7',
                color: '#92400E'
              }}
            >
              📌 {userNotes[v.id]}
            </div>
          )}
        </div>

        {index !== vocabularyData.length - 1 && (
          <hr
            style={{
              border: 'none',
              height: '2px',
              backgroundColor: '#7DD3FC',
              width: '100%'
            }}
          />
        )}

      </div>
    ))}
  </div>
)}

        {/* 4. ⌨️ 拼字輸入 */}
        {currentMode === 'typing' && (
          <div className="max-w-md mx-auto text-center space-y-6">
            <div>
              <span className="sub-light-label block text-xs uppercase tracking-widest mb-1">⚡ Speed Typing 🔥 Score: {typingScore}</span>
              <p className="text-sm font-bold text-sky-200">請根據意思拼寫出正確英文單字</p>
            </div>
            <h3 className="text-3xl font-black text-white">👉 {vocabularyData[typingIdx]?.meaningZh}</h3>
            
            <form onSubmit={handleTypingSubmit} className="space-y-4">
              <input type="text" value={typedInput} onChange={(e) => setTypedInput(e.target.value)} placeholder="在此輸入英文單字..." className="w-full p-4 rounded-xl bg-white text-slate-900 text-center font-bold text-lg border-4 border-sky-300 focus:outline-none" />
              <button type="submit" className="w-full py-3 bg-white text-sky-800 border-2 border-b-4 font-black rounded-xl text-xs uppercase">送出答案 🚀</button>
            </form>
            {typingStatus === 'correct' && <p className="text-emerald-400 font-black animate-bounce">🎉 太棒了，正確！</p>}
            {typingStatus === 'wrong' && <p className="text-rose-400 font-black animate-shake">❌ 答錯了，再試一次！</p>}
          </div>
        )}

        {/* 5. 🎧 聽力訓練 */}
        {currentMode === 'listening' && (
          <div className="max-w-md mx-auto text-center space-y-6">
            <div className="flex items-center justify-center gap-2">
              <span className="sub-light-label text-sm">語速調節:</span>
              <input type="range" min="0.5" max="1.5" step="0.05" value={speechRate} onChange={(e) => setSpeechRate(parseFloat(e.target.value))} className="w-32 h-2 bg-sky-600 rounded-lg appearance-none cursor-pointer" />
              <span className="text-xs font-mono bg-sky-900 px-2 py-0.5 rounded text-white">{speechRate}x</span>
            </div>
            
            <div className="bg-sky-900/40 p-4 rounded-xl border border-sky-400/30 flex items-center justify-center gap-2">
              <span className="text-xs font-bold text-sky-200">📋 切換單字:</span>
              <select value={listeningIdx} onChange={(e) => setListeningIdx(parseInt(e.target.value))} className="bg-white text-slate-900 text-xs font-bold p-1.5 rounded-lg border-2 border-sky-300">
                {vocabularyData.map((v, idx) => (
                  <option key={v.id} value={idx}>{idx + 1}. {v.word}</option>
                ))}
              </select>
            </div>

            <div className="py-4">
              <button onClick={() => handleSpeak(vocabularyData[listeningIdx]?.word)} className={`w-20 h-20 text-3xl bg-white border-4 border-sky-300 rounded-full flex items-center justify-center shadow-lg transform active:scale-95 transition-transform ${isSpeaking ? 'animate-ping' : ''}`}>📢</button>
            </div>

            <h3 className="text-3xl font-black text-white tracking-wide">{vocabularyData[listeningIdx]?.word}</h3>

            <div className="flex gap-4 items-center justify-center pt-2">
              <button onClick={() => setListeningIdx(p => Math.max(0, p - 1))} disabled={listeningIdx === 0} className="px-4 py-2 bg-white text-slate-900 border-2 rounded-xl text-xs font-black disabled:opacity-30">◀ 上一個</button>
              <span className="font-mono font-black text-white">{listeningIdx + 1} / {vocabularyData.length}</span>
              <button onClick={() => setListeningIdx(p => Math.min(vocabularyData.length - 1, p + 1))} disabled={listeningIdx === vocabularyData.length - 1} className="px-4 py-2 bg-white text-slate-900 border-2 rounded-xl text-xs font-black disabled:opacity-30">下一個 ▶</button>
            </div>
          </div>
        )}

        {/* 6. 🧠 核心測驗 */}
        {currentMode === 'quiz' && (
          <div className="max-w-md mx-auto">
            {!isQuizFinished ? (
              <div className="rounded-3xl p-6 relative" style={{ backgroundColor: '#0369A1', border: '4px solid #38BDF8', boxShadow: '0 8px #38BDF8' }}>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xs font-black tracking-wider bg-sky-100 text-sky-800 px-3 py-1.5 rounded-full border border-sky-300">
                    🎯 題目 {quizIdx + 1} / {vocabularyData.length}
                  </span>
                  <span className="text-xs font-black tracking-wider bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-full border border-emerald-300">
                    ⭐ 得分: {quizScore}
                  </span>
                </div>

                <div className="quiz-question-box mb-6 text-center py-5 bg-white border-2 border-[#38BDF8] rounded-2xl px-4">
                  <p className="text-xs font-black uppercase tracking-wider text-sky-600 mb-1">請選擇對應的英文單字：</p>
                  <h3 className="text-2xl font-black">👉 {vocabularyData[quizIdx]?.meaningZh}</h3>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {quizOptions.map((option, idx) => {
                    const isCurrentSelected = selectedAnswer === option.word;
                    const isCorrectAnswer = option.word === vocabularyData[quizIdx]?.word;
                    
                    let btnStyle = { backgroundColor: '#0EA5E9', borderColor: '#7DD3FC' };
                    if (selectedAnswer !== null) {
                      if (isCurrentSelected) {
                        btnStyle = isCorrectAnswer 
                          ? { backgroundColor: '#10B981', borderColor: '#047857' } 
                          : { backgroundColor: '#EF4444', borderColor: '#B91C1C' };
                      } else if (isCorrectAnswer) {
                        btnStyle = { backgroundColor: '#059669', borderColor: '#34D399' };
                      } else {
                        btnStyle = { backgroundColor: '#0284C7', borderColor: '#0369A1', opacity: 0.4 };
                      }
                    }

                    return (
                      <button 
                        key={idx} 
                        onClick={() => handleSelectQuizAnswer(option.word)} 
                        disabled={selectedAnswer !== null} 
                        className="quiz-option-btn-default w-full p-4 rounded-xl border-2 font-black text-sm text-left border-b-4 transition-all flex items-center"
                        style={{ ...btnStyle }}
                      >
                        <span className="inline-block w-6 h-6 rounded-lg bg-white/20 text-center leading-6 text-xs mr-3 font-bold text-white">{idx + 1}</span>
                        {option.word}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-white border-4 border-[#38BDF8] rounded-3xl p-8 text-center shadow-[0_8px_0_0_#0369A1] space-y-4">
                <div className="text-5xl">🏆</div>
                <h3 className="text-2xl font-black">✨ 恭喜完成本次測驗！ ✨</h3>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">您的最終得分</p>
                <span className="text-5xl font-black block py-2 text-sky-600">{quizScore} / {vocabularyData.length * 10}</span>
                <button onClick={() => { setQuizIdx(0); setQuizScore(0); setIsQuizFinished(false); setSelectedAnswer(null); }} className="w-full py-3.5 bg-[#0284C7] border-b-4 border-[#0369A1] text-white font-black rounded-xl text-xs uppercase tracking-wider active:translate-y-0.5 transition-all">重新挑戰 🚀</button>
              </div>
            )}
          </div>
        )}

        {/* 7. 🧩 連連看 */}
        {currentMode === 'game' && (
          <div className="game-block-fix">
            <BlockBlast gameScore={gameScore} initBlockGame={initBlockGame} gameBlocks={gameBlocks} selectedBlock={selectedBlock} shakeBlockId={shakeBlockId} handleBlockClick={handleBlockClick} />
          </div>
        )}

        {/* 8. 👤 個人簡介 */}
        {currentMode === 'profile' && (
          <UserProfile />
        )}

        {/* 9. 📚 本學期課程 (Sửa dứt điểm lỗi chữ trắng nền trắng - image_6b6877.png) */}
        {currentMode === 'syllabus' && (
          <div className="course-syllabus-wrapper">
            <CourseSyllabus />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;