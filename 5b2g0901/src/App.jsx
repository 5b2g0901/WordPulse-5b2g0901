import React, { useState, useEffect } from 'react';
import { vocabularyData } from './data/vocabulary';
import DeepDive from './components/DeepDive';
import SpeedTyping from './components/SpeedTyping';
import BlockBlast from './components/BlockBlast';
import ListeningQuiz from './components/ListeningQuiz'; // Gọi chính xác component riêng biệt
import UserProfile from './components/UserProfile';
import CourseSyllabus from './components/CourseSyllabus';
import Flashcard from './components/Flashcard'; 
import VocabularyBank from './components/VocabularyBank';

function App() {
  const [currentMode, setCurrentMode] = useState('syllabus'); 
  const [userNotes, setUserNotes] = useState({});
  const [activeNoteText, setActiveNoteText] = useState('');

  // --- MODES STATE ---
  const [diveIdx, setDiveIdx] = useState(0);
  const [typingIdx, setTypingIdx] = useState(0);
  const [typedInput, setTypedInput] = useState('');
  const [typingStatus, setTypingStatus] = useState('idle');
  const [typingScore, setTypingScore] = useState(0);
  const [typingHintCount, setTypingHintCount] = useState(0); 
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

  // --- STATE KHO ĐƠN TỰ (GALLERY VIEW) CHUYÊN NGHIỆP ---
  const [galSearch, setGalSearch] = useState('');
  const [galFilter, setGalFilter] = useState('all'); 

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
        setTypingHintCount(0); 
      }, 800);
    } else {
      setTypingStatus('wrong');
      setTimeout(() => setTypingStatus('idle'), 800);
    }
  };

  const handleGiveHint = () => {
    const currentCorrectWord = vocabularyData[typingIdx]?.word || '';
    if (typingHintCount < currentCorrectWord.length) {
      const nextHintCount = typingHintCount + 1;
      setTypingHintCount(nextHintCount);
      const partialHint = currentCorrectWord.substring(0, nextHintCount);
      setTypedInput(partialHint);
    }
  };

  const handleSpeak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = speechRate;
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
      
      {/* KHU VỰC CSS FIX */}
      <style>{`
        *, body, div, h1, h2, h3, h4, h5, h6, p, span, label, button, input, textarea, li, strong {
          font-family: "Brandon Grotesque", "Helvetica Neue", Arial, sans-serif !important;
        }

        .main-blue-container,
        .main-blue-container h1,
        .main-blue-container h2,
        .main-blue-container h3,
        .main-blue-container h4,
        .main-blue-container h5,
        .main-blue-container p,
        .main-blue-container span,
        .main-blue-container label,
        .main-blue-container div:not(.bg-white):not([style*="background-color: white"]):not(.qz-wrapper):not(.qz-wrapper *):not(.gal-card):not(.gal-card *) {
          color: #000000 !important;
        }

        .main-blue-container .sub-light-label {
          color: #BAE6FD !important;
          font-weight: 800;
        }

        .bg-white:not(.qz-wrapper):not(.qz-wrapper *):not(.gal-card):not(.gal-card *),
        .bg-white *:not(.qz-wrapper):not(.qz-wrapper *):not(.gal-card):not(.gal-card *),
        [style*="background-color: white"] *:not(.qz-wrapper):not(.qz-wrapper *):not(.gal-card):not(.gal-card *),
        [style*="background-color: rgb(255, 255, 255)"] *:not(.qz-wrapper):not(.qz-wrapper *):not(.gal-card):not(.gal-card *),
        .course-syllabus-wrapper .bg-white,
        .course-syllabus-wrapper .bg-white *,
        .quiz-question-box,
        .quiz-question-box * {
          color: #1E293B !important;
        }

        @keyframes vinyl-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .vinyl-playing {
          animation: vinyl-spin 3s linear infinite;
        }

        .audio-wave-bar {
          display: inline-block; width: 4px; height: 15px; background-color: #0284c7;
          margin: 0 2px; border-radius: 2px; transition: height 0.2s ease;
        }
        .audio-wave-active .audio-wave-bar:nth-child(1) { animation: wave-anim 0.6s infinite alternate-grow; }
        .audio-wave-active .audio-wave-bar:nth-child(2) { animation: wave-anim 0.4s infinite alternate-grow 0.1s; }
        .audio-wave-active .audio-wave-bar:nth-child(3) { animation: wave-anim 0.8s infinite alternate-grow 0.2s; }
        .audio-wave-active .audio-wave-bar:nth-child(4) { animation: wave-anim 0.5s infinite alternate-grow 0.3s; }
        
        @keyframes wave-anim {
          from { height: 6px; }
          to { height: 24px; }
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
                onClick={() => { setCurrentMode(nav.id); }} 
                className="px-3 py-2 rounded-xl text-xs font-black uppercase transition-all"
                style={{
                  backgroundColor: isActive ? '#FFFFFF' : '#0284C7',
                  color: isActive ? '#0369A1' : '#FFFFFF', 
                  border: isActive ? '2px solid #38BDF8' : '2px solid #0284C7',
                  borderBottom: isActive ? '5px solid #38BDF8' : '4px solid #0284C7',
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
          backgroundColor: currentMode === 'card' ? '#0081cc' : '#0284C7', 
          padding: '32px', 
          borderRadius: '32px', 
          border: '4px solid #38BDF8', 
          boxShadow: '0 10px 0 #0369A1' 
        }}
      >
        
        {/* 1. 🚀 深度探索 */}
        {currentMode === 'dive' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              padding: '40px 32px',
              width: '100%',
              maxWidth: '680px',
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.15)',
              borderBottom: '8px solid #cbd5e1',
              textAlign: 'center',
              boxSizing: 'border-box'
            }}>
              <div style={{ marginBottom: '16px' }}>
                <span style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: '#0284c7', marginBottom: '6px' }}>
                  CURRENT WORD
                </span>
                <h2 style={{ fontSize: '42px', fontWeight: '900', color: '#0f172a', margin: 0 }}>
                  {vocabularyData[diveIdx]?.word}
                </h2>
              </div>
              <div style={{ marginBottom: '24px' }}>
                <button 
                  onClick={() => handleSpeak(vocabularyData[diveIdx]?.word)} 
                  style={{
                    width: '54px',
                    height: '54px',
                    backgroundColor: '#e0f2fe',
                    border: '2px solid #38bdf8',
                    borderRadius: '50%',
                    fontSize: '20px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 0 #38bdf8'
                  }}
                >
                  🔊
                </button>
              </div>
              <hr style={{ border: 'none', borderTop: '2px dashed #e2e8f0', margin: '24px 0' }} />
              <div style={{ marginBottom: '24px' }}>
                <span style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#64748b', marginBottom: '6px' }}>
                  中文釋義
                </span>
                <p style={{ fontSize: '24px', fontWeight: '800', color: '#0369a1', margin: 0 }}>
                  {vocabularyData[diveIdx]?.meaningZh}
                </p>
              </div>
              <div style={{ marginBottom: '28px', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '16px', borderLeft: '4px solid #0ea5e9' }}>
                <span style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#64748b', marginBottom: '6px', textAlign: 'left' }}>
                  情境例句
                </span>
                <p style={{ fontSize: '16px', fontWeight: '600', fontStyle: 'italic', color: '#334155', margin: 0, textAlign: 'left', lineHeight: '1.5' }}>
                  "{vocabularyData[diveIdx]?.example}"
                </p>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyQontent: 'center', gap: '12px' }}>
                <span style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '8px 14px', borderRadius: '12px', fontSize: '13px', fontWeight: '700' }}>
                  🏷️ 詞性: {getSentenceAnalysis(vocabularyData[diveIdx]?.word).grammar}
                </span>
                <span style={{ backgroundColor: '#f0fdf4', color: '#166534', padding: '8px 14px', borderRadius: '12px', fontSize: '13px', fontWeight: '700' }}>
                  💡 推薦句型: {getSentenceAnalysis(vocabularyData[diveIdx]?.word).structures[0]}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyQontent: 'center', gap: '20px', margin: '24px 0' }}>
              <button onClick={() => setDiveIdx(p => Math.max(0, p - 1))} disabled={diveIdx === 0} style={{ padding: '10px 20px', backgroundColor: '#ffffff', borderRadius: '12px', fontWeight: '800', cursor: 'pointer' }}>◀ 上一個</button>
              <span style={{ fontSize: '16px', fontWeight: '900', color: '#ffffff' }}>{diveIdx + 1} / {vocabularyData.length}</span>
              <button onClick={() => setDiveIdx(p => Math.min(vocabularyData.length - 1, p + 1))} disabled={diveIdx === vocabularyData.length - 1} style={{ padding: '10px 20px', backgroundColor: '#ffffff', borderRadius: '12px', fontWeight: '800', cursor: 'pointer' }}>下一個 ▶</button>
            </div>
          </div>
        )}

        {/* 2. 📇 單字卡 */}
        {currentMode === 'card' && <Flashcard vocabularyData={vocabularyData} />}

        {/* 3. 🖼️ 單字庫 */}
        {currentMode === 'gallery' && <VocabularyBank vocabularyData={vocabularyData} />}

        {/* 4. ⌨️ 拼字輸入 - SỬA LỖI LỆCH VÀ TRÀN KHUNG INPUT */}
        {currentMode === 'typing' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <div style={{ 
              backgroundColor: '#ffffff', 
              borderRadius: '32px', 
              padding: '40px 32px', 
              width: '100%', 
              maxWidth: '560px', 
              textAlign: 'center',
              boxShadow: '0 10px 0 #cbd5e1',
              boxSizing: 'border-box'
            }}>
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '8px' }}>
                  <button 
                    type="button" 
                    onClick={handleGiveHint} 
                    style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '8px 16px', borderRadius: '20px', fontWeight: '800', border: 'none', cursor: 'pointer' }}
                  >
                    💡 Suggest ({typingHintCount}/{vocabularyData[typingIdx]?.word.length})
                  </button>
                  <span style={{ backgroundColor: '#fef3c7', color: '#d97706', padding: '8px 16px', borderRadius: '20px', fontWeight: '800' }}>
                    🔥 Score: {typingScore}
                  </span>
                </div>
              </div>

              <span style={{ display: 'block', fontSize: '11px', fontWeight: '900', color: '#94a3b8', trackingSpace: '1px', uppercase: true, marginBottom: '4px' }}>
                CHINESE MEANING
              </span>
              <h3 style={{ fontSize: '28px', fontWeight: '900', color: '#0f172a', margin: '0 0 28px 0' }}>
                👉 {vocabularyData[typingIdx]?.meaningZh}
              </h3>

              {/* Bọc form có maxWidth để Input không bị tràn bè ra 2 bên */}
              <form 
                onSubmit={handleTypingSubmit} 
                style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '440px', margin: '0 auto' }}
              >
                <input 
                  type="text" 
                  value={typedInput} 
                  onChange={(e) => setTypedInput(e.target.value)} 
                  placeholder="在此輸入英文單字..." 
                  style={{ 
                    width: '100%', 
                    padding: '16px', 
                    borderRadius: '20px', 
                    textAlign: 'center', 
                    fontWeight: '800', 
                    fontSize: '22px', 
                    border: '3px solid #38bdf8', 
                    outline: 'none',
                    backgroundColor: '#f8fafc',
                    boxSizing: 'border-box',
                    transition: 'all 0.2s'
                  }} 
                />
                <button 
                  type="submit" 
                  style={{ 
                    width: '100%', 
                    padding: '16px', 
                    backgroundColor: '#0284c7', 
                    color: '#ffffff', 
                    borderRadius: '20px', 
                    fontSize: '18px',
                    fontWeight: '900', 
                    border: 'none',
                    boxShadow: '0 5px 0 #0369a1',
                    cursor: 'pointer',
                    transition: 'transform 0.1s'
                  }}
                  onMouseDown={(e) => e.currentTarget.style.transform = 'translateY(3px)'}
                  onMouseUp={(e) => e.currentTarget.style.transform = 'none'}
                >
                  送出答案 🚀
                </button>
              </form>
            </div>
          </div>
        )}

        {/* 5. 🎧 聽力訓練 */}
        {currentMode === 'listening' && (
          <ListeningQuiz 
            vocabularyData={vocabularyData}
            speechRate={speechRate}
            setSpeechRate={setSpeechRate}
            handleSpeak={handleSpeak}
          />
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

        {/* 9. 📚 本學期課程 */}
        {currentMode === 'syllabus' && (
          <div 
            className="course-syllabus-wrapper p-4 rounded-2xl" 
            style={{ 
              backgroundColor: '#FFFFFF',
              color: '#000000',
            }}
          >
            <style>{`
              .course-syllabus-wrapper *,
              .course-syllabus-wrapper h3,
              .course-syllabus-wrapper span,
              .course-syllabus-wrapper p,
              .course-syllabus-wrapper div {
                color: #000000 !important;
              }
            `}</style>
            <CourseSyllabus />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;