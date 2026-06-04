import React from 'react';

export default function CourseSyllabus() {
  const courseWeeks = [
    {
      week: "📅 第一週：穩固基礎與核心概念",
      items: [
        { title: "JS 複習", details: "箭頭函式 (Arrow Functions)、解構賦值 (Destructuring)、展開運算子 (Spread Operator)、陣列方法 (map, filter)、ES Modules (import/export)。" },
        { title: "React 基礎", details: "JSX 語法（在 JS 中寫 HTML）、組件 (Components) 了解 Functional Components、Props（學習如何將資料從父組件傳遞給子組件）。" },
        { title: "實作練習", details: "建立一個靜態的「個人名片牆」，將姓名、職稱等資訊透過 Props 傳入。" }
      ]
    },
    {
      week: "📅 第二週：狀態管理與 Hooks 基礎",
      items: [
        { title: "React 的靈魂", details: "決定了你的網頁如何「互動」。" },
        { title: "核心 Hooks", details: "useState（學習如何管理組件內部的資料狀態）、useEffect（處理副作用，如：設定定時器、手動修改 DOM）。" },
        { title: "動態互動", details: "事件處理（onClick, onChange 等事件的綁定）、條件渲染與列表渲染（使用 if/else 或 map() 來動態顯示內容）。" },
        { title: "實作練習", details: "開發一個簡單的待辦事項清單 (Todo List) 初版。" }
      ]
    },
    {
      week: "📅 第三週：進階 Hooks 與非同步處理",
      items: [
        { title: "串接 API", details: "這週開始與後端 API 接軌，讓你的應用程式動起來。" },
        { title: "效能與 DOM", details: "useRef 與 useMemo/useCallback（學習如何存取 DOM 以及基本的效能優化概念）。" },
        { title: "資料請求", details: "Fetch API / Axios（學習如何在 useEffect 中呼叫 API 獲取資料）、處理 Loading 與 Error 狀態以提升使用者體驗。" },
        { title: "表單與實作", details: "表單處理（Controlled vs Uncontrolled Components）。實作：開發一個天氣查詢應用或電影搜尋引擎（串接公用 API，如 OpenWeather 或 TMDB）。" }
      ]
    },
    {
      week: "📅 第四週：導覽、樣式與狀態提升",
      items: [
        { title: "專案擴充", details: "當專案變大時，你需要管理多個頁面與更複雜的樣式。" },
        { title: "路由與樣式", details: "React Router (v6+)：學習單頁應用 (SPA) 的路由跳轉、動態路由 (useParams)。CSS in JS / Tailwind CSS：美化組件。" },
        { title: "全域狀態", details: "Lifting State Up（狀態向上提升）、Context API（解決深層傳遞 Props 的問題，管理全域狀態如深淺色模式、登入狀態）。" },
        { title: "實作練習", details: "建立一個多頁面的個人作品集網站。" }
      ]
    },
    {
      week: "📅 第五週：綜合實戰與部署",
      items: [
        { title: "終極目標", details: "這週的目標是完成一個可以放進履歷的完整作品。" },
        { title: "綜合實作", details: "開發一個簡易電商購物車或社群貼文牆。功能需包含：商品列表、加入購物車、刪除項目、計算總額、路由切換。" },
        { title: "優化與上線", details: "效能優化與測試基礎（React.memo 的使用時機）、部署 (Deployment)：學習使用 Vercel 或 Netlify 將你的 React 專案上線。" },
        { title: "複習整理", details: "回顧這五週的程式碼，並試著用自己的話解釋 React 的資料流。" }
      ]
    }
  ];

  return (
    <div className="w-full space-y-6 animate-fadeIn">
      {/* 頂部外層標題（藍色外層大背景下：文字保持高亮度白/藍） */}
      <div className="text-center space-y-1">
        <h2 className="text-3xl font-black text-white" style={{ color: '#FFFFFF' }}>本學期課程進度表</h2>
        <p className="text-sm font-bold text-sky-200 uppercase tracking-widest" style={{ color: '#BAE6FD' }}>React & JavaScript Full Syllabus</p>
      </div>

      {/* 課程週次內容列表區塊 */}
      <div className="grid grid-cols-1 gap-6 pt-2">
        {courseWeeks.map((w, index) => (
          <div 
            key={index} 
            className="p-6 rounded-2xl border-2 transition-all hover:shadow-lg shadow-sm"
            style={{
              backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#FAFAFA', // 交叉使用純白與超淺極致灰
              borderColor: '#CBD5E1'
            }}
          >
            {/* 週次卡片大標題：強制賦予極具對比度的深黑色 */}
            <h3 
              className="text-lg font-black border-b-2 border-dashed pb-2 mb-4 flex items-center"
              style={{ color: '#0F172A', borderColor: '#CBD5E1' }}
            >
              {w.week}
            </h3>

            {/* 核心條目明細內容 */}
            <div className="space-y-4 pl-1">
              {w.items.map((item, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-start text-base gap-2 sm:gap-0">
                  
                  {/* 單元小主題標籤：白底黑字黑邊框，結構更穩定粗實 */}
                  <span 
                    className="inline-block bg-white border-2 font-black px-2.5 py-1 rounded-xl text-xs mr-3 shadow-sm shrink-0"
                    style={{ 
                      color: '#000000', 
                      borderColor: '#000000',
                      minWidth: '100px',
                      textAlign: 'center',
                      fontWeight: '900'
                    }}
                  >
                    🚀 {item.title}
                  </span>
                  
                  {/* 說明內文詳細內容：強制指定純黑，行高加寬，避免任何泛白與視覺疲勞 */}
                  <span 
                    className="leading-relaxed flex-1 pt-0.5"
                    style={{ 
                      color: '#000000', 
                      fontWeight: '700' /* 改為 700 粗體讓字體在畫面上更具存在感 */
                    }}
                  >
                    {item.details}
                  </span>

                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}