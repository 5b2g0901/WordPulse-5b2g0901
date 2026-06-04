import React from 'react';

export default function UserProfile() {
  return (
    <div className="w-full max-w-2xl mx-auto text-center space-y-6 animate-fadeIn">
      <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center text-5xl mx-auto border-4 border-pink-400 shadow-md animate-bounce">
        🦊
      </div>
      <div className="space-y-1">
        <h2 className="text-3xl font-black text-purple-950">關於我 / About Me</h2>
        <p className="text-sm font-bold text-purple-400 uppercase tracking-widest">Personal Profile Space</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left font-bold text-gray-700 pt-4">
        <div className="bg-amber-50 p-4 rounded-2xl border-2 border-amber-200">
          <span className="text-amber-600 block text-xs font-black">NAME / 姓名</span>
          <p className="text-lg text-amber-950 mt-1">黃詩玥 ✨</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-2xl border-2 border-blue-200">
          <span className="text-blue-600 block text-xs font-black">STUDENT ID / 學號</span>
          <p className="text-lg text-blue-950 mt-1">5B2G0901-五專資工三甲 🎓</p>
        </div>
        <div className="bg-green-50 p-4 rounded-2xl border-2 border-green-200 sm:col-span-2">
          <span className="text-green-600 block text-xs font-black">WEBSITE THEME / 網站自訂主題說明</span>
          <p className="text-sm text-green-950 mt-2 leading-relaxed font-normal">
            本網站是以 <strong>WordPulse 沉浸式互動學習空間</strong> 為自訂主題。
            除了整合了核心的英文單字深度探索、字卡與趣味連連看遊戲之外，本學期也專注於將前端 React 元件拆分與狀態流動做完整的實務練習，打造出一個兼具視覺吸引力與學習功能性的個人專案網站。
          </p>
        </div>
      </div>
    </div>
  );
}