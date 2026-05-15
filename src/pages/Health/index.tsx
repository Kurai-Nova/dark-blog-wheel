import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { MarkdownRenderer } from "@Components";

import "./style.scss";

const Health: React.FC = () => {
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState<string>('');

  useEffect(() => {
    // Извлекаем путь из hash части URL
    const hash = location.hash.substring(1); // убираем #
    if (hash) {
      setCurrentPath(`/health/${hash}`);
    } else {
      setCurrentPath('');
    }
  }, [location]);


  return (
    <div>
      {!currentPath ? (
        <>
          <div className="sections">
            <div>
              <h3 className="section-title">🥗 Питание и здоровье</h3>
              <div className="sport-links">
                <a href="#proteins" className="sport-link">Сколько белка нужно есть</a>
              </div>
            </div>
          </div>
        </>
      ) : (
        <MarkdownRenderer path={currentPath} />
      )}
    </div>
  );
};

export default Health;
