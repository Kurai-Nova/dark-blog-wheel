import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import MarkdownRenderer from "../../components/MarkdownRenderer/MarkdownRenderer";
import "./style.scss";

export const Library: React.FC = () => {
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState<string>('');

  useEffect(() => {
    // Извлекаем путь из hash части URL
    const hash = location.hash.substring(1); // убираем #
    if (hash) {
      setCurrentPath(`/library/${hash}`);
    } else {
      setCurrentPath('');
    }
  }, [location]);

  return (
    <div>
      {!currentPath ? (
        <>
          <h2 className="library-main-title">Моя цифровая библиотека</h2>
          <div className="section">
            <h3 className="section-title">📚 Книги по программированию</h3>
            <ul className="library-list">
              <li className="library-item">
                <span className="library-title">"Рефакторинг"</span> — Мартин Фаулер
                <div className="library-description">Практика улучшения существующего кода без изменения его функциональности.</div>
              </li>
              <li className="library-item">
                <span className="library-title">"Чистый код"</span> — Роберт Мартин
                <div className="library-description">Как писать простой, поддерживаемый и понятный код.</div>
              </li>
              <li className="library-item">
                <span className="library-title">"You Don't Know JS"</span> — Кайл Симпсон
                <div className="library-description">Глубокое понимание JavaScript и его особенностей.</div>
              </li>
            </ul>
          </div>
          <div className="section">
            <h3 className="section-title">📄 Полезные статьи</h3>
            <ul className="library-list">
              <li className="library-item">
                <a href="https://reactjs.org/docs" className="library-link">Официальная документация React</a>
                <div className="library-description">Лучший источник для изучения React от создателей.</div>
              </li>
              <li className="library-item">
                <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" className="library-link">MDN JavaScript Guide</a>
                <div className="library-description">Полное руководство по JavaScript от Mozilla.</div>
              </li>
              <li className="library-item">
                <a href="https://css-tricks.com" className="library-link">CSS-Tricks</a>
                <div className="library-description">Отличные статьи и трюки по CSS и фронтенду.</div>
              </li>
            </ul>
          </div>
        </>
      ) : (
        <MarkdownRenderer path={currentPath} />
      )}
    </div>
  );
};

export default Library;
