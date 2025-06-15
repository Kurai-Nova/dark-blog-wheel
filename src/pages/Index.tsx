
import React from "react";
import "../styles/main.scss";
import RadialMenu from "../components/RadialMenu";
import BrandHeader from "../components/BrandHeader";

const menuData = [
  {
    label: "Статьи",
    onClick: () => window.location.href = "/#articles",
    children: [
      { label: "Frontend", onClick: () => window.location.href = "/#frontend" },
      { label: "Backend", onClick: () => window.location.href = "/#backend" },
      { label: "Полезное", onClick: () => window.location.href = "/#tools" },
    ],
  },
  {
    label: "О блоге",
    onClick: () => window.location.href = "/#about"
  },
  {
    label: "Контакты",
    onClick: () => window.location.href = "/#contacts"
  },
  {
    label: "Читать ещё",
    onClick: () => window.location.href = "/#more"
  },
];

const Index: React.FC = () => {
  return (
    <div>
      <BrandHeader />
      <div className="blog-main">
        <RadialMenu items={menuData} centerLabel="Меню" />
        <div style={{textAlign:"center", margin:"56px 0 0 0"}}>
          <h1 style={{marginBottom: 13}}>Добро пожаловать в <span style={{color:'#4bb6fa'}}>Scriptum Blog</span></h1>
          <p style={{maxWidth:560, margin:"0 auto", color:"#8891a6", fontSize: "1.18rem"}}>
            Этот блог — ваш источник лаконичных заметок и инструкций по современному фронтенду, технологиям и digital-инструментам.<br />
            Всё просто, современно и без лишнего.<br />
            <span style={{color:"#4bb6fa"}}>Навигация — через интерактивное круговое меню в центре!</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
