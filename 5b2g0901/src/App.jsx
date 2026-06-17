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
  const [vocabularyData, setVocabularyData] = useState(() => {
    try {
      const saved = localStorage.getItem('vocabularyData');
      return saved ? JSON.parse(saved) : initialVocabularyData;
    } catch (e) {
      return initialVocabularyData;
    }
  });
  const [newWord, setNewWord] = useState('');
  const [newMeaning, setNewMeaning] = useState('');
  const [newExample, setNewExample] = useState('');
  const [newGrammar, setNewGrammar] = useState('');
  const [newStructure, setNewStructure] = useState('');

  // --- STATE QUẢN LÝ TỪ VỰNG ĐÃ LƯU (FAVORITES / BOOKMARKS) ---
  const [savedWordIds, setSavedWordIds] = useState(() => {
    try {
      const saved = localStorage.getItem('savedWordIds');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // 同步 vocabularyData 到 LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('vocabularyData', JSON.stringify(vocabularyData));
    } catch (e) {
      console.error('Failed to save vocabularyData to localStorage:', e);
    }
  }, [vocabularyData]);

  // 同步 savedWordIds 到 LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('savedWordIds', JSON.stringify(savedWordIds));
    } catch (e) {
      console.error('Failed to save savedWordIds to localStorage:', e);
    }
  }, [savedWordIds]);

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

  // --- HÀM XỬ LÝ LƯU / BỎ LƯU TỪ VỰNG (Ngăn chặn trùng lặp) ---
  const toggleSaveWord = (wordId) => {
    setSavedWordIds(prev => {
      const uniquePrev = Array.from(new Set(prev));
      if (uniquePrev.includes(wordId)) {
        return uniquePrev.filter(id => id !== wordId);
      } else {
        return [...uniquePrev, wordId];
      }
    });
  };

  // --- HÀM XỬ LÝ XÓA TỪ VỰNG (THÙNG RÁC) ---
  const handleDeleteWord = (wordId) => {
    if (window.confirm('您確定要刪除這個單字嗎？(Bạn có chắc chắn muốn xóa từ này không?)')) {
      // Xóa từ khỏi kho từ vựng chính
      setVocabularyData(prev => prev.filter(item => item.id !== wordId));

      // Đồng thời xóa khỏi danh sách đã lưu nếu có
      setSavedWordIds(prev => prev.filter(id => id !== wordId));

      // Nếu vị trí xem từ (diveIdx) vượt quá độ dài mới, reset về 0
      if (diveIdx >= vocabularyData.length - 1) {
        setDiveIdx(0);
      }
    }
  };

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
      structure: newStructure.trim() || '常用句型'
    };
    setVocabularyData(prev => [newVocabItem, ...prev]);
    setNewWord('');
    setNewMeaning('');
    setNewExample('');
    setNewGrammar('');
    setNewStructure('');
    setIsFormExpanded(false);
  };

  useEffect(() => {
    if (vocabularyData[diveIdx]) {
      setActiveNoteText(userNotes[vocabularyData[diveIdx].id] || '');
    }
  }, [diveIdx, userNotes, vocabularyData]);

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

  // --- FIXED: Đã gộp và sửa triệt độ lỗi trùng lặp hàm phân tích câu ---
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
      "Privacy": { structures: ["Respect someone's privacy"], grammar: "名詞" },
      "Parents": { structures: ["Live with one's parents"], grammar: "名詞" },
      "Grandparents": { structures: ["Visit grandparents during holidays"], grammar: "名詞" },
      "Grandson": { structures: ["Be someone's oldest grandson"], grammar: "名詞" },
      "Granddaughter": { structures: ["Buy something for their granddaughter"], grammar: "名詞" },
      "Spouses": { structures: ["Employees and their spouses"], grammar: "名詞 (複數)" },
      "Relatives": { structures: ["Gather together with relatives"], grammar: "名詞 (複數)" },
      "Uncle": { structures: ["My uncle works as an engineer"], grammar: "名詞" },
      "Aunt": { structures: ["My aunt baked a delicious cake"], grammar: "名詞" },
      "Cousin": { structures: ["Be close friends with one's cousin"], grammar: "名詞" },
      "Only child": { structures: ["Grow up as an only child"], grammar: "名詞短語" },
      "Son-in-law": { structures: ["Go out with one's son-in-law"], grammar: "名詞" },
      "Daughter-in-law": { structures: ["Welcome a new daughter-in-law"], grammar: "名詞" },
      "Niece": { structures: ["Buy a lovely dress for one's niece"], grammar: "名詞" },
      "Nephew": { structures: ["Start university as a young nephew"], grammar: "名詞" },
      "Infant": { structures: ["Rock the crying infant to sleep"], grammar: "名詞" },
      "Twin": { structures: ["They are twin brothers"], grammar: "名詞 / 形容詞" },
      "Triplet": { structures: ["Caring for triplets is challenging"], grammar: "名詞" },
      "Single family": { structures: ["Be raised in a single family"], grammar: "名詞短語" },
      "Multi-generation family": { structures: ["Live in a multi-generation family"], grammar: "名詞短語" },
      "Generation": { structures: ["A significant generation gap"], grammar: "名詞" },
      "Be born": { structures: ["Was/Were born in [year/place]"], grammar: "動詞短語" },
      "Give birth": { structures: ["Give birth to a healthy baby"], grammar: "動詞短語" },
      "Get married": { structures: ["Plan to get married next year"], grammar: "動詞短語" },
      "Divorce": { structures: ["Decide to divorce amicably"], grammar: "動詞 / 名詞" },
      "Pass away": { structures: ["Pass away peacefully at an old age"], grammar: "動詞短語" },
      "Visit relatives": { structures: ["Travel back hometown to visit relatives"], grammar: "動詞短語" },
      "Keep in touch": { structures: ["Keep in touch with someone through social media"], grammar: "動詞短語" },
      "Relationship": { structures: ["Maintain a good relationship with"], grammar: "名詞" },
      "Relatively": { structures: ["Be relatively easy compared to"], grammar: "副詞" },
      "Relatable": { structures: ["The main character is highly relatable to"], grammar: "形容詞" },
      "Brush teeth": { structures: ["Brush one's teeth twice a day"], grammar: "動詞短語" },
      "Wash face": { structures: ["Wash one's face with cold water"], grammar: "動詞短語" },
      "Take a shower": { structures: ["Take a hot shower after working out"], grammar: "動詞短語" },
      "Take a bath": { structures: ["Love to take a long bath to relax"], grammar: "動詞短語" },
      "Ear-piercing": { structures: ["Go to a salon to get an ear-piercing"], grammar: "名詞 / 動詞短語" },
      "Take care of": { structures: ["Take care of someone/pet carefully"], grammar: "動詞短語" },
      "Clear trash": { structures: ["Clear trash from a messy place"], grammar: "動詞短語" },
      "Clean up": { structures: ["Clean up the messy kitchen immediately"], grammar: "動詞短語" },
      "Wash dishes": { structures: ["It's my turn to wash the dishes"], grammar: "動詞短語" },
      "Sweep": { structures: ["Sweep the floor/porch with a broom"], grammar: "動詞" },
      "Mop the floor": { structures: ["Use a wet cloth to mop the floor"], grammar: "動詞短語" },
      "Vacuum": { structures: ["Vacuum the living room carpet"], grammar: "動詞 / 名詞" },
      "Water flowers": { structures: ["Water the flowers in the backyard garden"], grammar: "動詞短語" },
      "Washing machine": { structures: ["Put dirty clothes into the washing machine"], grammar: "名詞短語" },
      "Altar": { structures: ["Place fresh fruits and incense on the altar"], grammar: "名詞" },
      "Stroll": { structures: ["Stroll along the peaceful lake after dinner"], grammar: "動詞 / 名詞" },
      "Outing": { structures: ["Organize an exciting weekend outing to"], grammar: "名詞" },
      "Roller-skating rink": { structures: ["Meet childhood friends at the roller-skating rink"], grammar: "名詞短語" },
      "Relaxation": { structures: ["Provide total relaxation after work"], grammar: "名詞" },
      "Relaxed": { structures: ["Feel completely relaxed and refreshed"], grammar: "形容詞" }
    };

    const customWord = vocabularyData.find(v => v.word === word);
    if (customWord && !analysisMap[word]) {
      return {
        grammar: customWord.grammar || "詞性分析",
        structures: [customWord.structure || "常用句型"]
      };
    }

    return analysisMap[word] || { structures: ["常用句型"], grammar: "詞性分析" };
  };

  return (
    <div
      className="min-h-screen antialiased px-4 pb-20"
      style={{
        fontFamily: '"Fredoka", "Quicksand", "PingFang TC", "Microsoft JhengHei", sans-serif',
        backgroundColor: '#E0F2FE',
        minHeight: '100vh',
        paddingTop: '20px'
      }}
    >

      <style>{`
        *, body, div, h1, h2, h3, h4, h5, h6, p, span, label, button, input, textarea, li, strong {
          font-family: "Fredoka", "Quicksand", "PingFang TC", "Microsoft JhengHei", sans-serif !important;
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
      `}</style>

      {/* HEADER BAR */}
      <header
        className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 mb-8"
        style={{
          backgroundColor: '#0284C7',
          borderRadius: '24px',
          border: '4px solid #1e293b',
          boxShadow: '0 8px #1e293b',
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
            overflow: 'hidden',
            overflowX: 'auto',
            boxSizing: 'border-box'
          }}
        >
          {[
            { id: 'dive', label: '🚀 深度探索' },
            { id: 'card', label: '📇 單字卡' },
            { id: 'gallery', label: '🖼️ 單字庫' },
            { id: 'favorites', label: '⭐ 收藏單字' },
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
                  borderBottomLeftRadius: index === 0 ? '20px' : '0px ',
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

              <div className="flex justify-end gap-3 mt-1">
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#38BDF8', color: '#1E293B', padding: '11px 28px', borderRadius: '10px',
                    border: '2.5px solid #1E293B', boxShadow: '0 3.5px 0 #1E293B', fontSize: '13px', fontWeight: '900',
                    cursor: 'pointer', transition: 'all 0.1s'
                  }}
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

        {/* 1. 🚀 深度探索 (Dive) */}
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
              boxSizing: 'border-box',
              position: 'relative'
            }}>

              {/* ⭐ Ổ LƯU TRỮ NHỎ PHÍA TRÊN GIAO DIỆN DIVE */}
              <button
                onClick={() => toggleSaveWord(vocabularyData[diveIdx]?.id)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '25px',
                  backgroundColor: savedWordIds.includes(vocabularyData[diveIdx]?.id) ? '#FEF08A' : '#F1F5F9',
                  border: '2px solid #1E293B',
                  borderRadius: '10px',
                  padding: '6px 12px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '800',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: '0 2px 0 #1E293B'
                }}
              >
                {savedWordIds.includes(vocabularyData[diveIdx]?.id) ? '⭐ 已儲存' : '☆ 儲存單字'}
              </button>

              <div style={{ marginBottom: '16px', marginTop: '10px' }}>
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

        {/* 3. 🖼️ 單字庫 (Gallery View) */}
        {currentMode === 'gallery' && (
          <div>
            {/* TRUYỀN THÊM HÀM onDeleteWord VÀO COMPONENT */}
            <VocabularyBank
              vocabularyData={vocabularyData}
              savedWordIds={savedWordIds}
              onToggleSave={toggleSaveWord}
              onDeleteWord={handleDeleteWord}
            />
          </div>
        )}

        {/* 4. ⭐ 收藏單字 */}
        {currentMode === 'favorites' && (
          <div>
            <VocabularyBank
              vocabularyData={vocabularyData.filter(v => savedWordIds.includes(v.id))}
              savedWordIds={savedWordIds}
              onToggleSave={toggleSaveWord}
              onDeleteWord={handleDeleteWord}
            />
          </div>
        )}

        {/* 5. ⌨️ 拼字輸入 */}
        {currentMode === 'typing' && (
          <SpeedTyping
            vocabularyData={vocabularyData}
            typingIdx={typingIdx}
            setTypingIdx={setTypingIdx}
            typedInput={typedInput}
            setTypedInput={setTypedInput}
            typingStatus={typingStatus}
            typingScore={typingScore}
            handleTypingSubmit={handleTypingSubmit}
            handleGiveHint={handleGiveHint}
            handleSpeak={handleSpeak}
          />
        )}

        {/* 6. 🎧 聽力訓練 */}
        {currentMode === 'listening' && (
          <ListeningQuiz
            vocabularyData={vocabularyData}
            handleSpeak={handleSpeak}
            speechRate={speechRate}
            setSpeechRate={setSpeechRate}
          />
        )}

        {/* 7. 🧠 核心測驗 */}
        {currentMode === 'quiz' && (
          <div className="qz-wrapper w-full flex flex-col items-center">
            <div className="w-full max-w-2xl bg-slate-100 p-6 rounded-2xl border-4 border-slate-800 shadow-[0_6px_0_#1e293b]">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-black text-slate-700">階段 {quizStage} / 核心測驗</span>
                <span className="text-sm font-black bg-yellow-300 px-3 py-1 rounded-full border-2 border-slate-800">得分: {quizScore}</span>
              </div>

              {!isQuizFinished ? (
                <div>
                  <div className="mb-4 bg-white p-2 rounded-lg border-2 border-slate-300 flex justify-between">
                    <span className="font-bold text-xs text-slate-500">進度: {quizIdx + 1} / 10</span>
                    <span className="font-bold text-xs text-sky-600">提示: 請選出正確的英文單字</span>
                  </div>

                  <div className="quiz-question-box bg-white p-8 rounded-xl border-4 border-slate-800 shadow-[0_4px_0_#1e293b] mb-6 text-center">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">中文題目</p>
                    <h3 className="text-3xl font-black text-slate-800">{stageQuestions[quizIdx]?.meaningZh}</h3>
                    {stageQuestions[quizIdx]?.example && (
                      <p className="text-xs text-slate-500 mt-3 italic bg-slate-50 p-2 rounded border border-dashed border-slate-300">
                        例句提示: {stageQuestions[quizIdx]?.example.replace(new RegExp(stageQuestions[quizIdx]?.word, 'gi'), '_____')}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {quizOptions.map((opt, i) => {
                      const optText = typeof opt === 'object' ? opt?.word : opt;
                      const correctText = stageQuestions[quizIdx]?.word;
                      let btnStyle = "bg-white text-slate-800 border-slate-800 hover:bg-slate-50";

                      if (selectedAnswer !== null) {
                        if (optText === correctText) {
                          btnStyle = "bg-green-400 text-slate-900 border-slate-800 scale-[1.02]";
                        } else if (selectedAnswer === opt) {
                          btnStyle = "bg-red-400 text-slate-900 border-slate-800 opacity-90";
                        } else {
                          btnStyle = "bg-white text-slate-400 border-slate-200 opacity-50 pointer-events-none";
                        }
                      }

                      return (
                        <button
                          key={i}
                          disabled={selectedAnswer !== null}
                          onClick={() => handleSelectQuizAnswer(opt)}
                          className={`w-full py-4 px-6 rounded-xl border-3 font-black text-lg transition-all shadow-[0_4px_0_#1e293b] active:translate-y-1 active:shadow-none text-left flex justify-between items-center ${btnStyle}`}
                        >
                          <span>{i + 1}. {optText}</span>
                          {selectedAnswer !== null && optText === correctText && <span>✅</span>}
                          {selectedAnswer === opt && optText !== correctText && <span>❌</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🏆</div>
                  <h3 className="text-2xl font-black text-slate-800 mb-2">測驗完成！</h3>
                  <p className="text-lg font-bold text-slate-600 mb-6">您在本階段獲得了 <span className="text-xl text-sky-600 font-extrabold">{quizScore}</span> 分！</p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <button onClick={() => initNewStage(1)} className="py-3 px-6 bg-sky-400 font-black rounded-xl border-3 border-slate-800 shadow-[0_4px_0_#1e293b]">再試一次 🔄</button>
                    <button onClick={() => initNewStage(quizStage + 1)} className="py-3 px-6 bg-emerald-400 font-black rounded-xl border-3 border-slate-800 shadow-[0_4px_0_#1e293b]">下一階段 🚀</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 8. 🧩 連連看 */}
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

        {/* 9. 👤 個人簡介 */}
        {currentMode === 'profile' && <UserProfile />}

        {/* 10. 📚 本學期課程 */}
        {currentMode === 'syllabus' && <CourseSyllabus />}

      </main>

      {/* FOOTER CREDITS */}
      <footer className="max-w-5xl mx-auto text-center mt-12 text-xs font-bold text-sky-700 uppercase tracking-widest">
        WordPulse System v4.2 • Responsive App Architecture • 國立臺南創新技術學院 🦊
      </footer>
    </div>
  );
}

export default App;