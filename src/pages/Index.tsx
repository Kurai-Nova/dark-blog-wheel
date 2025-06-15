
import React from "react";

import RadialMenu from "../components/RadialMenu";
import BrandHeader from "../components/BrandHeader";

const menuData = [
  {
    label: "Здоровье",
    onClick: () => window.location.href = "/#health",
  },
  {
    label: "Спорт",
    onClick: () => window.location.href = "/#sport",
  },
  {
    label: "Путешествия",
    onClick: () => window.location.href = "/#travel",
  },
  {
    label: "IT",
    onClick: () => window.location.href = "/#it",
  },
  {
    label: "Мысли",
    onClick: () => window.location.href = "/#thoughts",
  },
  {
    label: "Библиотека",
    onClick: () => window.location.href = "/#library",
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
