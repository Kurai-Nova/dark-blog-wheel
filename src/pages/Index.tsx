
import React from "react";
import { useNavigate } from "react-router-dom";

import MainMenu from "../components/MainMenu/MainMenu";

const menuData = [
  {
    label: "Здоровье",
    onClick: (navigate?: (path: string) => void) => navigate ? navigate("/#health") : window.location.href = "/#health",
  },
  {
    label: "Спорт",
    onClick: (navigate?: (path: string) => void) => navigate ? navigate("/sport") : window.location.href = "/sport",
  },
  {
    label: "Путешествия",
    onClick: (navigate?: (path: string) => void) => navigate ? navigate("/#travel") : window.location.href = "/#travel",
  },
  {
    label: "IT",
    onClick: (navigate?: (path: string) => void) => navigate ? navigate("/#it") : window.location.href = "/#it",
  },
  {
    label: "Мысли",
    onClick: (navigate?: (path: string) => void) => navigate ? navigate("/#thoughts") : window.location.href = "/#thoughts",
  },
  {
    label: "Библиотека",
    children: [
      {
        label: "Книги",
        onClick: (navigate?: (path: string) => void) => navigate ? navigate("/library#books") : window.location.href = "/library#books",
      },
      {
        label: "Статьи",
        onClick: (navigate?: (path: string) => void) => navigate ? navigate("/library#articles") : window.location.href = "/library#articles",
      }
    ]
  },
];

const Index: React.FC = () => {
  const navigate = useNavigate();

  // Передаем навигатор в RadialMenu для роутинга без перезагрузки
  const menuWithNav = menuData.map(item => ({
    ...item,
    onClick: item.onClick ? () => item.onClick(navigate) : undefined,
    children: item.children?.map(child => ({
      ...child,
      onClick: () => child.onClick(navigate),
    }))
  }));

  return (
    <div>
      <div className="brand-header">Nick Notebook</div>
      <div className="blog-main">
        <MainMenu items={menuWithNav} centerLabel="Меню" />
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
