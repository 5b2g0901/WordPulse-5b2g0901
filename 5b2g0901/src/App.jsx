import React, { useState, useEffect } from 'react';
import { vocabularyData as initialVocabularyData } from './data/vocabulary'; 
import DeepDive from './components/DeepDive';
import SpeedTyping from './components/SpeedTyping';
import BlockBlast from './components/BlockBlast';
import ListeningQuiz from './components/ListeningQuiz'; 
import UserProfile from './components/UserProfile';
import CourseSyllabus from './components/CourseSyllabus';
import Flashcard from './components/Flashcard'; 
import VocabularyBank from './components/VocabularyBank';

function App() {
  const [currentMode, setCurrentMode] = useState('syllabus'); 
  const [userNotes, setUserNotes] = useState({});
  const [activeNoteText, setActiveNoteText] = useState('');

  // --- STATE QUẢN LÝ TỪ VỰNG DÀNH CHO THANH NHẬP MỚI ---
  const [vocabularyData, setVocabularyData] = useState(initialVocabularyData);
  const [newWord, setNewWord] = useState('');
  const [newMeaning, setNewMeaning] = useState('');
  const [newExample, setNewExample] = useState('');
  const [newGrammar, setNewGrammar] = useState(''); 
  const [newStructure, setNewStructure] = useState(''); // 🔥 Thêm State mới cho Mẫu câu gợi ý

  // --- STATE ĐIỀU KHIỂN ĐÓNG/MỞ THANH THÊM TỪ NHO NHỎ ---
  const [isFormExpanded, setIsFormExpanded] = useState(false);

  // --- MODES STATE ---
  const [diveIdx, setDiveIdx] = useState(0);
  const [typingIdx, setTypingIdx] = useState(0);
  const [typedInput, setTypedInput] = useState('');
  const [typingStatus, setTypingStatus] = useState('idle');
  const [typingScore, setTypingScore] = useState(0);
  const [typingHintCount, setTypingHintCount] = useState(0); 
  const [speechRate, setSpeechRate] = useState(0.85);
  
  // --- STATE CORE QUIZ ---
  const [quizStage, setQuizStage] = useState(1);
  const [stageQuestions, setStageQuestions] = useState([]);
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

  // --- HÀM XỬ LÝ THÊM TỪ VỰNG MỚI ---
  const handleAddNewWord = (e) => {
    e.preventDefault();
    if (!newWord.trim() || !newMeaning.trim()) {
      alert('請輸入英文單字與中文釋義！');
      return;
    }
    const newVocabItem = {
      id: Date.now().toString(),
      word: newWord.trim(),
      meaningZh: newMeaning.trim(),
      example: newExample.trim() || 'No example context provided.',
      grammar: newGrammar.trim() || '名詞', 
      structure: newStructure.trim() || '常用句型' // 🔥 Lưu mẫu câu người dùng tự nhập vào dữ liệu từ vựng
    };
    setVocabularyData(prev => [newVocabItem, ...prev]);
    setNewWord('');
    setNewMeaning('');
    setNewExample('');
    setNewGrammar('');
    setNewStructure(''); // 🔥 Reset ô nhập mẫu câu gợi ý
    setIsFormExpanded(false); 
  };

  useEffect(() => {
    if (vocabularyData[diveIdx]) {
      setActiveNoteText(userNotes[vocabularyData[diveIdx].id] || '');
    }
  }, [diveIdx, userNotes, vocabularyData]);

  const saveNote = () => {
    if (vocabularyData[diveIdx]) {
      setUserNotes(prev => ({ ...prev, [vocabularyData[diveIdx].id]: activeNoteText }));
    }
  };

  const initNewStage = (stageNumber) => {
    const shuffled = [...vocabularyData].sort(() => 0.5 - Math.random());
    const sliceTen = shuffled.slice(0, 10);
    setStageQuestions(sliceTen);
    setQuizStage(stageNumber);
    setQuizIdx(0);
    setQuizScore(0);
    setSelectedAnswer(null);
    setIsQuizFinished(false);
  };

  useEffect(() => {
    if (currentMode === 'quiz' && stageQuestions.length === 0) {
      initNewStage(1);
    }
  }, [currentMode, stageQuestions]);

  useEffect(() => {
    if (currentMode === 'quiz' && !isQuizFinished && stageQuestions.length > 0) {
      const currentWord = stageQuestions[quizIdx];
      if (currentWord) {
        const rands = vocabularyData
          .filter(v => v.id !== currentWord.id)
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);
        setQuizOptions([...rands, currentWord].sort(() => 0.5 - Math.random()));
        setSelectedAnswer(null);
      }
    }
  }, [quizIdx, currentMode, isQuizFinished, stageQuestions, vocabularyData]);

  const handleSelectQuizAnswer = (option) => {
    if (selectedAnswer !== null) return; 
    setSelectedAnswer(option);

    const optionText = typeof option === 'object' ? option?.word : option;
    const correctText = stageQuestions[quizIdx]?.word;

    const isCorrect = optionText === correctText;
    if (isCorrect) {
      setQuizScore(prev => prev + 10);
    }
    setTimeout(() => {
      if (quizIdx < 9) {
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
    
    const wordBlocks = items.map(v => ({ 
      id: `w-${v.id}`, 
      pairId: v.id, 
      text: v.word, 
      type: 'word', 
      cleared: false 
    }));
    
    const meanBlocks = items.map(v => ({ 
      id: `m-${v.id}`, 
      pairId: v.id, 
      text: v.meaningZh, 
      type: 'mean', 
      cleared: false 
    }));
    
    const shuffledWords = [...wordBlocks].sort(() => 0.5 - Math.random());
    const shuffledMeans = [...meanBlocks].sort(() => 0.5 - Math.random());

    setGameBlocks([...shuffledWords, ...shuffledMeans]);
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
    
    // 🔥 Kiểm tra xem từ hiện hành có thuộc nhóm từ mới được người dùng tự nhập hay không
    const customWord = vocabularyData.find(v => v.word === word);
    if (customWord) {
      return { 
        structures: [customWord.structure || "常用句型"], // Ưu tiên hiển thị mẫu câu đã nhập thủ công
        grammar: customWord.grammar || "詞性分析" 
      };
    }

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
        className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 mb-8"
        style={{
          backgroundColor: '#0284C7', 
          borderRadius: '24px',
          border: '4px solid #1e293b', 
          shadow: '0 8px #1e293b',
          color: '#FFFFFF',
          overflow: 'hidden'
        }}
      >
        {/* LOGO */}
        <div className="flex items-center gap-3 p-4 md:pl-6 w-full md:w-auto">
          <div 
            className="w-11 h-11 flex items-center justify-center text-xl animate-bounce"
            style={{
              backgroundColor: '#38BDF8',
              borderRadius: '14px',
              border: '2.5px solid #1e293b',
              borderBottom: '5px solid #1e293b'
            }}
          >
            🦊
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-wider text-white" style={{ fontWeight: '950', color: '#FFFFFF' }}>
              WordPulse
            </h1>
            <p className="text-[10px] uppercase font-black tracking-widest text-[#BAE6FD]">
              TW / EN 沉浸式學習空間
            </p>
          </div>
        </div>

        {/* THANH MENU ĐIỀU HƯỚNG */}
        <nav 
          style={{
            backgroundColor: '#133087', 
            borderLeft: '4px solid #1e293b',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'stretch',
            width: '100%',
            flex: 1,
            overflowX: 'auto', 
            boxSizing: 'border-box'
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
          ].map((nav, index, arr) => {
            const isActive = currentMode === nav.id;
            return (
              <button 
                key={nav.id} 
                onClick={() => { setCurrentMode(nav.id); }} 
                className="transition-all"
                style={{
                  flex: '1 1 0%', 
                  minWidth: '90px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '16px 8px',
                  fontSize: '14px', 
                  fontWeight: '500', 
                  whiteSpace: 'nowrap', 
                  cursor: 'pointer',
                  backgroundColor: isActive ? '#FFFFFF' : 'transparent',
                  color: isActive ? '#133087' : '#FFFFFF', 
                  border: 'none',
                  borderRight: index === arr.length - 1 ? 'none' : '3px solid #1e293b',
                  boxSizing: 'border-box'
                }}
              >
                {nav.label}
              </button>
            );
          })}
        </nav>
      </header>

      {/* 🌟 THANH THÊM TỪ THU GỌN / MỞ RỘNG THÔNG MINH 🌟 */}
      <div 
        className="max-w-5xl mx-auto mb-6"
        style={{
          backgroundColor: '#F1F5F9',
          border: '3px solid #1E293B',
          borderRadius: '16px',
          boxShadow: '0 5px 0 #1E293B',
          overflow: 'hidden',
          transition: 'all 0.3s ease'
        }}
      >
        {/* Trạng thái 1: Chỉ hiện duy nhất một thanh nhỏ nhỏ ban đầu */}
        {!isFormExpanded ? (
          <div 
            onClick={() => setIsFormExpanded(true)}
            style={{
              padding: '10px 18px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#F1F5F9',
              userSelect: 'none'
            }}
          >
            <div style={{ fontSize: '14px', fontWeight: '900', color: '#1E293B', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>➕</span> 新增單字 (點擊此處展開欄位...)
            </div>
            <div style={{ fontSize: '12px', fontWeight: '800', backgroundColor: '#E2E8F0', padding: '4px 10px', borderRadius: '8px', border: '1.5px solid #1E293B' }}>
              展開 🔽
            </div>
          </div>
        ) : (
          /* Trạng thái 2: Sau khi bấm vào sẽ xổ ra đầy đủ form điền dữ liệu */
          <div style={{ padding: '20px' }}>
            <div 
              onClick={() => setIsFormExpanded(false)}
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: '14px', paddingBottom: '10px', borderBottom: '2px dashed #CBD5E1', cursor: 'pointer'
              }}
            >
              <span style={{ fontSize: '13px', fontWeight: '900', color: '#1E293B' }}>📝 請填寫單字資訊:</span>
              <span style={{ fontSize: '10px', fontWeight: '800', backgroundColor: '#FFE4E6', color: '#E11D48', padding: '4px 10px', borderRadius: '8px', border: '1.5px solid #1E293B' }}>
                收起 🔼
              </span>
            </div>

            <form onSubmit={handleAddNewWord} className="flex flex-col gap-4 w-full">
              {/* Hàng 1: Từ vựng & Nghĩa tiếng Trung & Từ loại */}
              <div className="flex flex-col md:flex-row gap-3 w-full">
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '900', marginBottom: '5px', color: '#1E293B' }}>英文單字 (English Word)*</label>
                  <input 
                    type="text" required value={newWord} onChange={(e) => setNewWord(e.target.value)}
                    placeholder="例如: Unique"
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '2.5px solid #1E293B', fontSize: '13px', fontWeight: '800', color: '#1E293B', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '900', marginBottom: '5px', color: '#1E293B' }}>中文釋義 (Chinese Meaning)*</label>
                  <input 
                    type="text" required value={newMeaning} onChange={(e) => setNewMeaning(e.target.value)}
                    placeholder="例如: 獨特的"
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '2.5px solid #1E293B', fontSize: '13px', fontWeight: '800', color: '#1E293B', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ flex: 0.7 }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '900', marginBottom: '5px', color: '#1E293B' }}>詞性 (Part of Speech)</label>
                  <input 
                    type="text" value={newGrammar} onChange={(e) => setNewGrammar(e.target.value)}
                    placeholder="例如: 形容詞"
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '2.5px solid #1E293B', fontSize: '13px', fontWeight: '800', color: '#1E293B', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* Hàng 2: Câu ví dụ ngữ cảnh & 🔥 Mẫu câu gợi ý */}
              <div className="flex flex-col md:flex-row gap-3 w-full">
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '900', marginBottom: '5px', color: '#1E293B' }}>情境例句 (Context Example)</label>
                  <input 
                    type="text" value={newExample} onChange={(e) => setNewExample(e.target.value)}
                    placeholder="例如: Each person's fingerprints are unique."
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '2.5px solid #1E293B', fontSize: '13px', fontWeight: '800', color: '#1E293B', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '900', marginBottom: '5px', color: '#1E293B' }}>推薦句型 (Recommended Structure)</label>
                  <input 
                    type="text" value={newStructure} onChange={(e) => setNewStructure(e.target.value)}
                    placeholder="例如: It is unique to [someone/somewhere]"
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', border: '2.5px solid #1E293B', fontSize: '13px', fontWeight: '800', color: '#1E293B', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* Nút hành động */}
              <div className="flex justify-end gap-3 mt-1">
                <button 
                  type="submit"
                  style={{
                    backgroundColor: '#38BDF8', color: '#1E293B', padding: '11px 28px', borderRadius: '10px',
                    border: '2.5px solid #1E293B', boxShadow: '0 3.5px 0 #1E293B', fontSize: '13px', fontWeight: '900',
                    cursor: 'pointer', transition: 'all 0.1s'
                  }}
                  onMouseDown={(e) => { e.currentTarget.style.transform = 'translateY(2px)'; e.currentTarget.style.boxShadow = '0 1.5px 0 #1E293B'; }}
                  onMouseUp={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 3.5px 0 #1E293B'; }}
                >
                  儲存單字 💾
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
      
      {/* MAIN BLUE CONTAINER */}
      <main 
        className="max-w-5xl mx-auto main-blue-container" 
        style={{ 
          backgroundColor: currentMode === 'card' ? '#0081cc' : '#0284C7', 
          padding: '32px', 
          borderRadius: '32px', 
          border: '4px solid #1e293b', 
          boxShadow: '0 10px 0 #1e293b' 
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
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px' }}>
                <span style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '8px 14px', borderRadius: '12px', fontSize: '13px', fontWeight: '700' }}>
                  🏷️ 詞性: {getSentenceAnalysis(vocabularyData[diveIdx]?.word).grammar}
                </span>
                <span style={{ backgroundColor: '#f0fdf4', color: '#166534', padding: '8px 14px', borderRadius: '12px', fontSize: '13px', fontWeight: '700' }}>
                  💡 推薦句型: {getSentenceAnalysis(vocabularyData[diveIdx]?.word).structures[0]}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', margin: '24px 0' }}>
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

        {/* 4. ⌨️ 拼字輸入 */}
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

              <span style={{ display: 'block', fontSize: '11px', fontWeight: '900', color: '#94a3b8', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>
                CHINESE MEANING
              </span>
              <h3 style={{ fontSize: '28px', fontWeight: '900', color: '#0f172a', margin: '0 0 28px 0' }}>
                👉 {vocabularyData[typingIdx]?.meaningZh}
              </h3>

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

        {/* 6. 🧠 CORE QUIZ */}
        {currentMode === 'quiz' && stageQuestions.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '12px 0' }}>
            {!isQuizFinished ? (
              <div style={{ backgroundColor: '#ffffff', borderRadius: '32px', padding: '40px 32px', width: '100%', maxWidth: '580px', boxShadow: '0 24px 48px rgba(15, 23, 42, 0.12)', border: '3.5px solid #1e293b', boxSizing: 'border-box' }}>
                
                <div style={{ marginBottom: '28px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '6px 14px', borderRadius: '14px', fontSize: '14px', fontWeight: '900', border: '2.5px solid #1e293b' }}>
                      🎯 Question {quizIdx + 1}/10
                    </span>
                    <span style={{ backgroundColor: '#fffbeb', color: '#b45309', padding: '6px 14px', borderRadius: '14px', fontSize: '14px', fontWeight: '900', border: '2.5px solid #1e293b' }}>
                      ⭐ Score: {quizScore}
                    </span>
                  </div>
                  
                  <div style={{ width: '100%', height: '14px', backgroundColor: '#e2e8f0', borderRadius: '12px', border: '2.5px solid #1e293b', overflow: 'hidden' }}>
                    <div style={{ width: `${((quizIdx + 1) / 10) * 100}%`, height: '100%', backgroundColor: '#38bdf8', transition: 'width 0.3s ease-out' }} />
                  </div>
                </div>

                <div style={{ backgroundColor: '#f8fafc', border: '2.5px solid #1e293b', borderRadius: '24px', padding: '28px 20px', textAlign: 'center', marginBottom: '28px', boxShadow: '0 6px 0px #e2e8f0', minHeight: '110px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', fontWeight: '900', color: '#94a3b8', letterSpacing: '1.5px', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>
                    HOW DO YOU SAY THIS IN ENGLISH?
                  </span>
                  <h3 style={{ fontSize: '24px', fontWeight: '900', color: '#1e293b', margin: 0 }}>
                    {stageQuestions[quizIdx]?.meaningZh}
                  </h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {quizOptions.map((option, idx) => {
                    const optionText = typeof option === 'object' ? option?.word : option;
                    const correctText = stageQuestions[quizIdx]?.word;
                    const isSelected = selectedAnswer === option;
                    const isCorrectAnswer = optionText === correctText;
                    
                    let btnBg = '#ffffff';
                    let btnColor = '#1e293b';
                    let borderCol = '#1e293b';

                    if (selectedAnswer !== null) {
                      if (isCorrectAnswer) {
                        btnBg = '#bbf7d0';
                        btnColor = '#166534';
                        borderCol = '#166534';
                      } else if (isSelected) {
                        btnBg = '#fecaca';
                        btnColor = '#991b1b';
                        borderCol = '#991b1b';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectQuizAnswer(option)}
                        style={{
                          width: '100%', padding: '16px 20px', backgroundColor: btnBg, color: btnColor,
                          borderRadius: '16px', border: `2.5px solid ${borderCol}`, fontSize: '16px', fontWeight: '800',
                          textAlign: 'left', cursor: selectedAnswer !== null ? 'default' : 'pointer', transition: 'all 0.15s',
                          boxShadow: selectedAnswer !== null && isSelected ? 'none' : '0 4px 0 #1e293b'
                        }}
                      >
                        {optionText}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div style={{ backgroundColor: '#ffffff', borderRadius: '32px', padding: '40px 32px', width: '100%', maxWidth: '480px', textAlign: 'center', border: '3.5px solid #1e293b' }}>
                <h2>🎉 Stage {quizStage} Completed!</h2>
                <p>Final Score: {quizScore}/100</p>
                <button onClick={() => initNewStage(quizStage + 1)} style={{ padding: '12px 24px', backgroundColor: '#38bdf8', borderRadius: '12px', fontWeight: '900', border: '2.5px solid #1e293b', cursor: 'pointer' }}>Next Stage 🚀</button>
              </div>
            )}
          </div>
        )}

        {/* 7. 🧩 連連看 */}
        {currentMode === 'game' && (
          <BlockBlast 
            gameBlocks={gameBlocks}
            selectedBlock={selectedBlock}
            gameScore={gameScore}
            shakeBlockId={shakeBlockId}
            handleBlockClick={handleBlockClick}
            initBlockGame={initBlockGame}
          />
        )}

        {/* 8. 👤 個人簡介 */}
        {currentMode === 'profile' && <UserProfile />}

        {/* 9. 📚 本學期課程 */}
        {currentMode === 'syllabus' && <CourseSyllabus />}

      </main>
    </div>
  );
}

export default App;