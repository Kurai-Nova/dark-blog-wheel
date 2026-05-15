import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { MarkdownRenderer } from "@Components";
import { AnimeNotes } from './Anime';


import "./style.scss";

const Notes: React.FC = () => {
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState<string>('');

  useEffect(() => {
    // Извлекаем путь из hash части URL
    const hash = location.hash.substring(1); // убираем #
    if (hash) {
      setCurrentPath(`/notes/${hash}`);
    } else {
      setCurrentPath('');
    }
  }, [location]);

  switch (true) {
    case currentPath === '/notes/anime':
      return <AnimeNotes />;

    case currentPath.length > 0:
      return <MarkdownRenderer path={currentPath} />;

    default:
  }

  return (
    <div>
      <h2 className="library-main-title">Различные записи</h2>
      <div className="section">
        <h3 className="section-title">Всё подряд</h3>
        <div className="sport-links">
          <a href="#anime" className="sport-link">Ололо-рецензии на аниму</a>
        </div>
      </div>
    </div>
  );
};

export default Notes;
