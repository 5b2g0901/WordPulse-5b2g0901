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
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        border: "1px solid #E2E8F0"
      }}
    >
      {/* 🌟 ĐOẠN FIX LỖI TRIỆT ĐỂ: Ép khối bên phải hiển thị đúng màu tối, không bị chữ trắng */}
      <style>{`
        .user-profile-right-block,
        .user-profile-right-block h1,
        .user-profile-right-block h2,
        .user-profile-right-block p,
        .user-profile-right-block strong {
          color: #334155 !important; /* Ép chữ sang màu xám than cao cấp */
        }
        .user-profile-right-block h2 {
          color: #2563EB !important; /* Ép riêng tiêu đề chủ đề sang màu xanh tương phản */
        }
        .user-profile-right-block h1 {
          color: #0F172A !important; /* Ép tên lớn thành màu đen đậm hẳn */
        }
      `}</style>

      {/* KHỐI TRÁI (LEFT): Thông tin cơ bản trên nền xanh đậm */}
      <div
        style={{
          width: "320px",
          background: "#3F5F94",
          color: "white",
          padding: "40px 30px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          shrink: 0
        }}
      >
        {/* Avatar bọc viền trắng mềm mại */}
        <div
          style={{
            width: "150px",
            height: "150px",
            borderRadius: "50%",
            background: "#050505",
            margin: "0 auto 30px",
            padding: "4px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
          }}
        >
          <img
            src="/avatar.jpg"
            alt="Avatar"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "50%"
            }}
          />
        </div>

        <h2
          style={{
            textAlign: "center",
            marginBottom: "35px",
            fontWeight: "900",
            fontSize: "20px",
            letterSpacing: "1px",
            borderBottom: "2px dashed rgba(255,255,255,0.3)",
            paddingBottom: "12px",
            width: "100%"
          }}
        >
          About Me / 關於我
        </h2>

        {/* Thông tin cá nhân gọn gàng bên trái */}
        <div
          style={{
            lineHeight: "2",
            fontSize: "15px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "12px"
          }}
        >
          <p style={{ margin: 0, fontWeight: "400" }}>
            <strong style={{ fontWeight: "700" }}>Name / 姓名:</strong> 黃詩玥
          </p>
          <p style={{ margin: 0, fontWeight: "400" }}>
            <strong style={{ fontWeight: "700" }}>學號:</strong> 5B2G0901
          </p>
          <p style={{ margin: 0, fontWeight: "400" }}>
            <strong style={{ fontWeight: "700" }}>班級:</strong> 五專資工三甲
          </p>
          <p style={{ margin: 0, fontWeight: "400", wordBreak: "break-all" }}>
            <strong style={{ fontWeight: "700" }}>Email:</strong> 5b2g0901@stust.edu.tw
          </p>
        </div>
      </div>

      {/* KHỐI PHẢI (RIGHT): Nội dung giải thích không in đậm, chữ tối màu rõ nét */}
      <div
        className="user-profile-right-block"
        style={{
          flex: 1,
          background: "#FFFFFF",
          padding: "50px md:padding-60px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        }}
      >
        <h1
          style={{
            fontSize: "40px",
            fontWeight: "900",
            margin: "0 0 4px 0"
          }}
        >
          黃詩玥
        </h1>

        <p
          style={{
            fontSize: "14px",
            color: "#64748B",
            letterSpacing: "2px",
            textTransform: "uppercase",
            fontWeight: "600",
            margin: "0 0 40px 0"
          }}
        >
        </p>

        <h2
          style={{
            fontWeight: "800",
            fontSize: "18px",
            letterSpacing: "0.5px",
            margin: "0 0 16px 0",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          📚 WEBSITE THEME / 網站自訂主題說明
        </h2>

        <p
          style={{
            fontSize: "15px",
            lineHeight: "1.8",
            fontWeight: "400", /* Giữ chữ thường, không in đậm */
            margin: 0,
            textAlign: "justify"
          }}
        >
          本網站是以 <strong style={{ fontWeight: "700" }}>WordPulse 沉浸式互動學習空間</strong> 為自訂主題。
          除了整合核心英文單字深度探索、字卡與趣味連連看遊戲之外，
          本學期也專注於 React 元件拆分與狀態流動的實務練習，
          打造出兼具視覺吸引力與學習功能性的個人專案網站 Jeweled Space。
        </p>
      </div>
    </div>
  );
}