import React from 'react';

export default function UserProfile() {
  return (
    <div
      className="user-profile-card"
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        background: "#FFFFFF",
        borderRadius: "24px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "row",
        boxShadow: "0 15px 35px rgba(0,0,0,0.06)",
        border: "1px solid #E2E8F0",
        fontFamily: "'Microsoft JhengHei', '微軟正黑體', sans-serif"
      }}
    >
      {/* 🔥 ĐOẠN ÉP MÀU: Bất chấp CSS bên ngoài có ép màu đen, lệnh này sẽ ép lại thành màu xanh nhạt #E0F2FE */}
      <style>{`
        .user-profile-left-block,
        .user-profile-left-block h2,
        .user-profile-left-block p,
        .user-profile-left-block strong {
          color: #E0F2FE !important; /* Ép toàn bộ tiêu đề, chữ đậm, chữ thường sang #E0F2FE */
        }
        .user-profile-right-block * {
          font-family: 'Microsoft JhengHei', '微軟正黑體', sans-serif !important;
        }
        .theme-title-kaiti {
          font-family: KaiTi, "Kaiti SC", "STKaiti", "BiauKai", serif !important;
        }
      `}</style>

      {/* KHỐI TRÁI (LEFT): Thông tin cá nhân */}
      <div
        className="user-profile-left-block" /* Đặt class này để đoạn style bên trên tóm đúng mục tiêu */
        style={{
          width: "300px",
          background: "#3F5F94",
          padding: "40px 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          flexShrink: 0
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: "130px",
            height: "130px",
            borderRadius: "50%",
            background: "#050505",
            margin: "0 auto 24px",
            padding: "3px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
          }}
        >
          <img
            src="/avatar.jpg"
            alt="Avatar"
            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
          />
        </div>

        <h2 style={{ textAlign: "center", marginBottom: "24px", fontWeight: "700", fontSize: "18px", letterSpacing: "1px", borderBottom: "2px dashed #E0F2FE", paddingBottom: "12px", width: "100%" }}>
          About Me / 關於我
        </h2>

        <div style={{ lineHeight: "1.8", fontSize: "14px", width: "100%", display: "flex", flexDirection: "column", gap: "10px" }}>
          <p style={{ margin: 0 }}><strong style={{ fontWeight: "700" }}>姓名:</strong> 黃詩玥</p>
          <p style={{ margin: 0 }}><strong style={{ fontWeight: "700" }}>學號:</strong> 5B2G0901</p>
          <p style={{ margin: 0 }}><strong style={{ fontWeight: "700" }}>班級:</strong> 五專資工三甲</p>
          <p style={{ margin: 0, wordBreak: "break-all" }}><strong style={{ fontWeight: "700" }}>Email:</strong> 5b2g0901@stust.edu.tw</p>
        </div>
      </div>

      {/* KHỐI PHẢI (RIGHT): Nội dung giải thích */}
      <div className="user-profile-right-block" style={{ flex: 1, background: "#FFFFFF", padding: "40px 45px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <h1 style={{ fontSize: "36px", fontWeight: "800", color: "#1E293B", margin: "0 0 20px 0" }}>黃詩玥</h1>
        <h2 className="theme-title-kaiti" style={{ fontWeight: "bold", fontSize: "20px", color: "#1E3A8A", margin: "0 0 14px 0", borderBottom: "2px solid #3F5F94", paddingBottom: "6px" }}>
          📚 WEBSITE THEME / 網站自訂主題說明
        </h2>
        <p style={{ fontSize: "15px", lineHeight: "1.7", color: "#475569", margin: "0 0 24px 0", textAlign: "justify" }}>
          本網站是以 <strong style={{ color: "#3F5F94", fontWeight: "700" }}>WordPulse 沉浸式互動學習空間</strong> 為自訂主題。
          除了整合核心英文單字深度探索、字卡與趣味連連看遊戲之外，本學期也專注於 React 元件拆分與狀態流動的實務練習，
          成功打造出兼具視覺吸引力與學習功能性的個人專案網站 <strong style={{ color: "#1E293B" }}>Jeweled Space</strong>。
        </p>
        <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#1E293B", margin: "0 0 12px 0", display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ color: "#3F5F94" }}>🎯</span> 網站創立目的：
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div style={{ background: "#F8FAFC", padding: "16px", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
            <h4 style={{ margin: "0 0 6px 0", fontSize: "15px", fontWeight: "700", color: "#3F5F94" }}>💡 沉浸式單字學習</h4>
            <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.6", color: "#64748B", textAlign: "justify" }}>
              透過聲音、情境例句與趣味遊戲（如連連看、拼字輸入），擺脫傳統死記，讓英文單字記憶更有趣味與效率。
            </p>
          </div>
          <div style={{ background: "#F8FAFC", padding: "16px", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
            <h4 style={{ margin: "0 0 6px 0", fontSize: "15px", fontWeight: "700", color: "#3F5F94" }}>⚡ React 技術實務</h4>
            <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.6", color: "#64748B", textAlign: "justify" }}>
              專注於 React 元件拆分與狀態流動（State Flow）的實作，將課堂理論轉化為兼具視覺美感與功能性的專案。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}