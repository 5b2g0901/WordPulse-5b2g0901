import React, { useState } from 'react';

export default function CourseSyllabus() {
  const [activeWeek, setActiveWeek] = useState(1);

  // Dữ liệu lộ trình học tập chi tiết được tối ưu hóa cấu trúc trực quan
  const syllabusData = {
    1: {
      title: "穩固基礎與核心概念",
      subtitle: "JavaScript ES6+ 必備心法 & React 核心起步",
      badge: "Week 01",
      color: "#f59e0b",
      bgLight: "#f0f9ff",
      topics: [
        {
          head: "JS 核心語法複習",
          desc: "熟練箭頭函式 (Arrow Functions)、解構賦值 (Destructuring) 與展開運算子 (Spread Operator)。"
        },
        {
          head: "進階陣列處理方法",
          desc: "掌握不修改原陣列的實戰運算：map() 轉換資料、filter() 過濾條件、以及 ES Modules (import/export) 模組化觀念。"
        },
        {
          head: "React JSX 語法與元件架構",
          desc: "理解如何在 JavaScript 中撰寫聲明式 UI、建立 Functional Components，並透過 Props 進行元件間的單向資料傳遞 (從父組件傳遞數據至子組件)。"
        },
        {
          head: "第一週實作練習任務",
          desc: "動手建構一個靜態的「個人名片牆」應用程式，練習將姓名、職稱、大頭貼等關鍵資訊封裝透過 Props 注入元件。"
        }
      ]
    },
    2: {
      title: "狀態管理與事件處理",
      subtitle: "讓你的 UI 動起來！學會 React 的靈魂 Hook",
      badge: "Week 02",
      color: "#f59e0b",
      bgLight: "#fffbeb",
      topics: [
        {
          head: "useState Hook 核心基礎",
          desc: "理解 React 狀態驅動的本質、如何宣告狀態與正確使用 setter 函數觸發重新渲染 (Re-render)。"
        },
        {
          head: "事件處理與雙向資料綁定",
          desc: "處理 onClick、onChange 等前端常用事件，實作 Input 表單的雙向資料同步控管。"
        },
        {
          head: "第二週實作練習任務",
          desc: "打造一個具備動態新增、刪除、標記完成功能的互動式「待辦事項清單 (Todo List)」。"
        }
      ]
    },
    3: {
      title: "副作用處理與 API 整合",
      subtitle: "與外部世界串聯，打造會呼吸的真實應用",
      badge: "Week 03",
      color: "#f59e0b",
      bgLight: "#fffbeb",
      topics: [
        {
          head: "useEffect 生命週期管理",
          desc: "搞懂 Component Mount、Update、Unmount 的執行時機，以及相依性陣列 (Dependency Array) 的核心防坑指南。"
        },
        {
          head: "非同步 Fetch 與 API 串接",
          desc: "利用 async/await 配合 useEffect 從後端獲取真實資料，並處理加載中 (Loading) 與錯誤處理 (Error Handling) 的 UI 狀態。"
        },
        {
          head: "第三週實作練習任務",
          desc: "串接開源天氣 API 或單字庫，實作一個具備關鍵字搜尋、即時篩選呈現的「動態天氣/單字搜尋儀表板」。"
        }
      ]
    },
    4: {
      title: "進階元件設計與效能優化",
      subtitle: "架構規模化！從普通網頁走向大型專案架構",
      badge: "Week 04",
      color: "#f59e0b",
      bgLight: "#fffbeb",
      topics: [
        {
          head: "Children Props & 組合模式",
          desc: "利用 props.children 設計靈活且可重複利用的彈出視窗 (Modal) 或卡片外殼 (Layout Components)。"
        },
        {
          head: "React 樣式解決方案",
          desc: "活用 CSS Modules 或是 Tailwind CSS 進行現代化元件樣式隔離，防止全域命名衝突。"
        },
        {
          head: "第四週實作練習任務",
          desc: "重構 WordPulse 的 UI 模組，並封裝出一套可跨頁面重複使用的「復古潮流風彈出式對話盒組件」。"
        }
      ]
    },
    5: {
      title: "專案總結與雲端部署",
      subtitle: "完美收尾！將你的心血結晶分享給全網絡",
      badge: "Week 05",
      color: "#f59e0b",
      bgLight: "#fffbeb",
      topics: [
        {
          head: "React 專案打包構建",
          desc: "理解 Vite / Webpack 的 Build 機制，將開發環境原始碼壓縮優化為瀏覽器可讀的純靜態檔案。"
        },
        {
          head: "現代化雲端平台部署實戰",
          desc: "學習使用 GitHub 進行版本控制，並一鍵整合部署至 Vercel 或 Netlify 免費網頁代管空間。"
        },
        {
          head: "第五週終極期末任務",
          desc: "將 WordPulse 核心功能完成全面優化，並成功部署發布上線，產出可以放進個人履歷的亮眼作品！"
        }
      ]
    }
  };

  const currentSyllabus = syllabusData[activeWeek];

  return (
    <div className="w-full qz-wrapper" style={{ padding: '8px 0', color: '#1e293b' }}>
      
      {/* 頂部大標題區塊 */}
      <div style={{
        textAlign: 'center',
        marginBottom: '36px',
        borderBottom: '4px solid #1e293b',
        paddingBottom: '24px'
      }}>
        <div style={{
          display: 'inline-block',
          backgroundColor: '#9cb4e4',
          color: '#ffffff',
          padding: '6px 16px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: '900',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          marginBottom: '12px'
        }}>
          💡 LEARNING ROADMAP
        </div>
        <h2 style={{ fontSize: '32px', fontWeight: '950', color: '#1e293b', margin: '0 0 8px 0' }}>
          本學期課程進度表
        </h2>
        <p style={{ fontSize: '15px', fontWeight: '700', color: '#64748b', margin: 0 }}>
          前端核心技術奠基：<span style={{ color: '#0284c7', textDecoration: 'underline' }}>React & JavaScript</span> 實戰全解析
        </p>
      </div>

      {/* 週數切換頁籤 (TAB BUTTONS) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
        gap: '12px',
        marginBottom: '36px'
      }}>
        {[1, 2, 3, 4, 5].map((weekNum) => {
          const isActive = activeWeek === weekNum;
          const weekColor = syllabusData[weekNum].color;
          
          return (
            <button
              key={weekNum}
              onClick={() => setActiveWeek(weekNum)}
              style={{
                backgroundColor: isActive ? weekColor : '#ffffff',
                color: isActive ? '#ffffff' : '#1e293b',
                padding: '14px 10px',
                borderRadius: '16px',
                fontSize: '14px',
                fontWeight: '900',
                border: '3px solid #1e293b',
                boxShadow: isActive ? 'none' : '0 5px 0 #1e293b',
                transform: isActive ? 'translateY(5px)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.1s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                boxSizing: 'border-box'
              }}
            >
              <span style={{ fontSize: '10px', opacity: isActive ? 0.8 : 0.5, textTransform: 'uppercase' }}>
                WEEK
              </span>
              <span style={{ fontSize: '18px', fontWeight: '950' }}>
                0{weekNum}
              </span>
            </button>
          );
        })}
      </div>

      {/* 主要內容展示卡片 */}
      <div style={{
        backgroundColor: currentSyllabus.bgLight,
        border: '4px solid #1e293b',
        borderRadius: '28px',
        padding: '32px',
        boxShadow: '0 10px 0 #1e293b',
        transition: 'all 0.2s ease',
        boxSizing: 'border-box'
      }}>
        
        {/* 卡片頂部標題 */}
        <div style={{
          display: 'flex',
          alignItems: 'start',
          gap: '16px',
          borderBottom: '3px dashed rgba(30, 41, 59, 0.15)',
          paddingBottom: '20px',
          marginBottom: '28px',
          flexWrap: 'wrap'
        }}>
          <div style={{
            backgroundColor: currentSyllabus.color,
            color: '#ffffff',
            padding: '8px 16px',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '950',
            border: '2.5px solid #1e293b',
            boxShadow: '2px 2px 0 #1e293b',
            flexShrink: 0
          }}>
            {currentSyllabus.badge}
          </div>
          <div>
            <h3 style={{ fontSize: '24px', fontWeight: '950', color: '#1e293b', margin: '0 0 4px 0' }}>
              {currentSyllabus.title}
            </h3>
            <p style={{ fontSize: '14px', fontWeight: '700', color: '#475569', margin: 0 }}>
              🎯 {currentSyllabus.subtitle}
            </p>
          </div>
        </div>

        {/* 課程章節條目列表 - 恢復正常的左對齊易讀格局 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {currentSyllabus.topics.map((topic, index) => {
            const isTask = topic.head.includes("任務");
            return (
              <div 
                key={index}
                style={{
                  backgroundColor: '#ffffff',
                  border: '2.5px solid #1e293b',
                  borderRadius: '18px',
                  padding: '20px',
                  boxShadow: '4px 4px 0 #1e293b',
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'start',
                  boxSizing: 'border-box'
                }}
              >
                {/* 左側標籤圖示 */}
                <div style={{
                  fontSize: '22px',
                  backgroundColor: isTask ? '#fee2e2' : '#f1f5f9',
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #1e293b',
                  flexShrink: 0
                }}>
                  {isTask ? '🚀' : '📝'}
                </div>
                
                {/* 右側文字內容 */}
                <div style={{ textAlign: 'left' }}>
                  <h4 style={{ 
                    fontSize: '16px', 
                    fontWeight: '900', 
                    color: isTask ? '#dc2626' : '#1e293b', 
                    margin: '0 0 4px 0' 
                  }}>
                    {topic.head}
                  </h4>
                  <p style={{ 
                    fontSize: '14px', 
                    fontWeight: '600', 
                    color: '#475569', 
                    margin: 0,
                    lineHeight: '1.6'
                  }}>
                    {topic.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}