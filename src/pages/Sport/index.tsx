import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import MarkdownRenderer from "../../components/MarkdownRenderer/MarkdownRenderer";

import "./style.scss";

const Sport: React.FC = () => {
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState<string>('');

  useEffect(() => {
    // Извлекаем путь из hash части URL
    const hash = location.hash.substring(1); // убираем #
    if (hash) {
      setCurrentPath(`/sport/${hash}`);
    } else {
      setCurrentPath('');
    }
  }, [location]);


  return (
    <div>
      {!currentPath ? (
        <>
          <div className="sport-intro">
            Движение - это жизнь. Наше тело так устроено, что если мы не двигаемся, мы начинаем болеть. <br />
            Один из самых эффективных видов активности - бег. Не можете или не любите бегать, хотя бы ходите почаще. <br />
            Бегать по утрам - не самая здравая затея. Если всё же решите бегать с утра, хотя бы не бегите сразу, дайте организму проснуться хотя бы полчаса, выпейте воды. С утра кровь густая, это негативно сказывается на сердце.
          </div>
          <div className="sections">
            <div>
              <h3 className="section-title">Общее</h3>
              <div className="sport-links">
                <a href="#training-sequence" className="sport-link">Эффективность сочетания тренировок на силу и выносливость</a>
                <a href="#bicycle" className="sport-link">Заметки про велосипеды</a>
              </div>
            </div>
            <div>
              <h3 className="section-title">Силовые тренировки</h3>
              <div className="sport-links">
                <a href="#bodyweight" className="sport-link">Упражнения с собственным весом</a>
                <a href="#gym" className="sport-link">Программы для тренажерного зала</a>
              </div>
            </div>
            <div>
              <h3 className="section-title">🥗 Питание и здоровье</h3>
              <div className="sport-links">
                <a href="#nutrition" className="sport-link">Основы спортивного питания</a>
                <a href="#supplements" className="sport-link">Спортивные добавки</a>
              </div>
            </div>
          </div>
          <div className="daily-routine">
            <h3 style={{marginBottom: "16px"}}>Простой комплекс на каждый день:</h3>
            <ul className="routine-list">
              <li>Разминка (наклоны, вращения, легкая растяжка) — 5 минут</li>
              <li>Приседания — 3 подхода по 15</li>
              <li>Отжимания — 3 подхода по 10–15</li>
              <li>Планка — 3 × 40 секунд</li>
              <li>Бег/интенсивная ходьба — 15 минут</li>
            </ul>
            <div className="routine-note">
              Главное — регулярность! Делайте небольшой комплекс ежедневно, чтобы чувствовать прилив сил.
            </div>
          </div>
        </>
      ) : (
        <MarkdownRenderer path={currentPath} />
      )}
    </div>
  );
};

export default Sport;
