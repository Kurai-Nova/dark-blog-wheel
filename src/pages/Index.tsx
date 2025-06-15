
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import MainMenu from "../components/MainMenu/MainMenu";
import MarkdownRenderer from "../components/MarkdownRenderer/MarkdownRenderer";

const Index: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState<string>('');

  useEffect(() => {
    // Извлекаем путь из hash части URL
    const hash = location.hash.substring(1); // убираем #
    if (hash) {
      setCurrentPath(`/${hash}`);
    } else {
      setCurrentPath('');
    }
  }, [location]);

  return (
    <div>
      <div className="brand-header">Nick Notebook</div>
      <div className="blog-main">
        <MainMenu navigate={navigate} />
        <div style={{textAlign:"center", margin:"56px 0 0 0"}}>
          <h1 style={{marginBottom: 13}}>Добро пожаловать в <span style={{color:'#4bb6fa'}}>Scriptum Blog</span></h1>
          <p style={{maxWidth:560, margin:"0 auto", color:"#8891a6", fontSize: "1.18rem"}}>
            Этот блог — ваш источник лаконичных заметок и инструкций по современному фронтенду, технологиям и digital-инструментам.<br />
            Всё просто, современно и без лишнего.<br />
            <span style={{color:"#4bb6fa"}}>Навигация — через интерактивное круговое меню в центре!</span>
          </p>
        </div>
        <div style={{margin:"56px 0 0 0"}}>
          <MarkdownRenderer path={currentPath} />
        </div>
      </div>
    </div>
  );
};

export default Index;
