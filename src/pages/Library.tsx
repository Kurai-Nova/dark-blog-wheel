
import React from "react";

const Library: React.FC = () => (
  <div>
    <div className="brand-header">Библиотека</div>
    <div className="blog-main">
      <h2 style={{marginBottom: "32px", textAlign: "center"}}>Моя цифровая библиотека</h2>
      
      <div className="library-section">
        <h3 className="library-section-title">📚 Книги по программированию</h3>
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

      <div className="library-section">
        <h3 className="library-section-title">📄 Полезные статьи</h3>
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
    </div>
  </div>
);

export default Library;
