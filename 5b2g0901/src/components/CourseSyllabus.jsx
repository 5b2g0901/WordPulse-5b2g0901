import React, { useState } from 'react';

export default function CourseSyllabus() {
  // Quản lý tuần đang được chọn (Mặc định là tuần đầu tiên - Index 0)
  const [activeWeekIndex, setActiveWeekIndex] = useState(0);

  const courseWeeks = [
    {
      week: "📅 第一週：穩固基礎與核心概念",
      shortLabel: "第一週",
      items: [
        { title: "JS 複習", details: "箭頭函式 (Arrow Functions)、解構賦值 (Destructuring)、展開運算子 (Spread Operator)、陣列方法 (map, filter)、ES Modules (import/export)。" },
        { title: "React 基礎", details: "JSX 語法（在 JS 中寫 HTML）、組件 (Components) 了解 Functional Components、Props（學習如何將資料 từ cha truyền xuống con）。" },
        { title: "實作練習", details: "建立一個靜態的「個人名片牆」，將姓名、職稱等資訊透過 Props 傳入。" }
      ]
    },
    {
      week: "📅 第二週：狀態管理與 Hooks 基礎",
      shortLabel: "第二週",
      items: [
        { title: "React 的靈魂", details: "決定了你的網頁如何「互動」。" },
        { title: "核心 Hooks", details: "useState（學習如何管理組件內部的資料狀態）、useEffect（處理副作用，如：設定定時器、手動修改 DOM）。" },
        { title: "動態互動", details: "事件處理（onClick, onChange 等事件的綁定）、條件渲染與列表渲染（使用 if/else 或 map() 來動態顯示內容）。" },
        { title: "實作練習", details: "開發一個簡單的待辦事項清單 (Todo List) 初版。" }
      ]
    },
    {
      week: "📅 第三週：進階 Hooks 與非同步處理",
      shortLabel: "第三週",
      items: [
        { title: "串接 API", details: "這週開始與後端 API 接軌，讓你的應用程式動起來。" },
        { title: "效能與 DOM", details: "useRef 與 useMemo/useCallback（學習如何存取 DOM 以及基本的效能優化概念）。" },
        { title: "資料請求", details: "Fetch API / Axios（學習如何在 useEffect 中呼叫 API 獲取資料）、處理 Loading 與 Error 狀態以提升使用者體驗。" },
        { title: "表單與實作", details: "表單處理（Controlled vs Uncontrolled Components）。實作：開發一個天氣查詢應用或電影搜尋引擎（串接公用 API，如 OpenWeather 或 TMDB）。" }
      ]
    },
    {
      week: "📅 第四週：導覽、樣式與狀態提升",
      shortLabel: "第四週",
      items: [
        { title: "專案擴充", details: "當專案變大時，你需要管理多個頁面與更複雜的樣式。" },
        { title: "路由與樣式", details: "React Router (v6+)：學習單頁應用 (SPA) 的路由跳轉、動態路由 (useParams)。CSS in JS / Tailwind CSS：美化組件。" },
        { title: "全域狀態", details: "Lifting State Up（狀態向上提升）、Context API（解決深層傳遞 Props 的問題，管理全域狀態如深淺色模式、登入狀態）。" },
        { title: "實作練習", details: "建立一個多頁面的個人作品集網站。" }
      ]
    },
    {
      week: "📅 第五週：綜合實戰與部署",
      shortLabel: "第五週",
      items: [
        { title: "終極目標", details: "這週的目標是完成一個可以放進履歷的完整作品。" },
        { title: "綜合實作", details: "開發一個簡易電商購物車或社群貼文牆。功能需包含：商品列表、加入購物車、刪除項目、計算總額、路由切換。" },
        { title: "優化與上線", details: "效能優化與測試基礎（React.memo 的使用時機）、部署 (Deployment)：學習使用 Vercel 或 Netlify 將你的 React 專案上線。" },
        { title: "複習整理", details: "回顧這五週的程式碼，並試著用自己的話解釋 React 的資料流。" }
      ]
    }
  ];

  const currentWeekData = courseWeeks[activeWeekIndex];

  return (
    <div className="w-full space-y-6 animate-fadeIn">
      {/* 1. Tiêu đề lớn bên ngoài (Chữ trắng trên nền xanh của Container) */}
      <div className="text-center space-y-1">
        <h2 className="text-3xl font-black text-white" style={{ color: '#FFFFFF' }}>本學期課程進度表</h2>
        <p className="text-sm font-bold text-sky-200 uppercase tracking-widest" style={{ color: '#BAE6FD' }}>本學期課程進度 React & JavaScript</p>
      </div>

      {/* 2. THANH CHỌN TUẦN NHANH */}
      <div className="flex flex-wrap justify-center gap-2 p-2 rounded-2xl bg-sky-900/30 border border-sky-400/20 max-w-2xl mx-auto">
        {courseWeeks.map((w, index) => {
          const isActive = activeWeekIndex === index;
          return (
            <button
              key={index}
              onClick={() => setActiveWeekIndex(index)}
              className="px-4 py-2 rounded-xl text-xs font-black transition-all transform active:scale-95"
              style={{
                backgroundColor: isActive ? '#FFFFFF' : '#5cb8e5',
                color: isActive ? '#000000' : '#FFFFFF',
                border: isActive ? '2px solid #000000' : '2px solid transparent',
                borderBottom: isActive ? '5px solid #000000' : '4px solid #0369A1',
                cursor: 'pointer'
              }}
            >
              {isActive ? `📍 ${w.shortLabel}` : w.shortLabel}
            </button>
          );
        })}
      </div>

      {/* 3. KHỐI NỘI DUNG CHI TIẾT THEO TUẦN */}
      <div className="pt-2 max-w-4xl mx-auto">
        {currentWeekData && (
          <div 
            className="p-6 rounded-2xl border-2 shadow-md"
            style={{
              backgroundColor: '#FFFFFF', 
              borderColor: '#000000'       
            }}
          >
            {/* TIÊU ĐỀ TUẦN: Giữ nguyên Đậm nét (font-black) để làm điểm nhấn chính */}
            <h3 
              className="text-xl font-black border-b-2 border-dashed pb-3 mb-5 flex items-center"
              style={{ color: '#000000', borderColor: '#000000', fontWeight: '900' }}
            >
              {currentWeekData.week}
            </h3>

            {/* TOÀN BỘ PHẦN NỘI DUNG BÊN DƯỚI ĐỀU VIẾT THƯỜNG (fontWeight: '400') */}
            <div className="space-y-4 pl-1">
              {currentWeekData.items.map((item, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-start text-sm gap-2 sm:gap-0">
                  
                  {/* Nhãn bài học (Ví dụ: 🚀 JS 複習): Đã chuyển sang chữ thường bình thường, không in đậm */}
                  <span 
                    className="inline-block bg-white border-2 px-2.5 py-0.5 rounded-xl text-xs mr-3 shadow-sm shrink-0"
                    style={{ 
                      color: '#000000', 
                      borderColor: '#000000',
                      minWidth: '105px',
                      textAlign: 'center',
                      fontWeight: '400' /* Thay đổi từ 800 thành 400 (Chữ thường) */
                    }}
                  >
                    🚀 {item.title}
                  </span>
                  
                  {/* Chi tiết bài học: Giữ nguyên chữ thường bình thường, màu đen rõ nét */}
                  <span 
                    className="leading-relaxed flex-1 pt-0.5 text-xs sm:text-sm"
                    style={{ 
                      color: '#000000', 
                      fontWeight: '400' /* Chữ thường mảnh */
                    }}
                  >
                    {item.details}
                  </span>

                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}