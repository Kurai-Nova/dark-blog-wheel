import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { MarkdownRenderer } from "@Components";

import { NginxNotes } from "./Nginx";


import "./style.scss";

export const ItSection: React.FC = () => {
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState<string>('');

  useEffect(() => {
    // Извлекаем путь из hash части URL
    const hash = location.hash.substring(1); // убираем #
    if (hash) {
      setCurrentPath(`/it/${hash}`);
    } else {
      setCurrentPath('');
    }
  }, [location]);

  switch (true) {
    case currentPath === '/it/nginx': // Оставлено для примера как добавлять кастомные страницы
      return <NginxNotes/>;

    case currentPath.length > 0:
      return <MarkdownRenderer path={currentPath} />;

    default:
  }

  return (
    <div>
      <h2 className="library-main-title">Полезные заметки и статьи про IT</h2>
      <div className="section">
        <h3 className="section-title">Всё подряд</h3>
        <div className="sport-links">
          <a href="#android_cleanup" className="sport-link">Шпаргалка по удалению ненужных программ с Android</a>
          <a href="#nginx" className="sport-link">Базовая настройка Nginx</a>
        </div>
      </div>
    </div>
  );
};

export default ItSection;
