
import React from "react";
import BreadcrumbNav from "../components/BreadcrumbNav";

const Sport: React.FC = () => (
  <div>
    <div className="brand-header">Спорт и здоровье</div>
    <div className="blog-main">
      <BreadcrumbNav />
      <h2 style={{marginBottom: "24px", textAlign: "center"}}>Тренировка — лучший способ начать свой день</h2>

      <div className="sport-intro">
        <p>Утренняя физическая активность запускает обмен веществ, заряжает энергией и помогает продуктивнее справляться с задачами дня.</p>
      </div>

      <div className="sport-sections">
        <div>
          <h3 className="sport-section-title">🏃‍♂️ Кардио тренировки</h3>
          <div className="sport-links">
            <a href="#running" className="sport-link">Программы бега для начинающих</a>
            <a href="#cycling" className="sport-link">Велоспорт и велопрогулки</a>
            <a href="#swimming" className="sport-link">Плавание: техника и программы</a>
            <a href="#hiit" className="sport-link">HIIT тренировки дома</a>
          </div>
        </div>

        <div>
          <h3 className="sport-section-title">💪 Силовые тренировки</h3>
          <div className="sport-links">
            <a href="#bodyweight" className="sport-link">Упражнения с собственным весом</a>
            <a href="#gym" className="sport-link">Программы для тренажерного зала</a>
            <a href="#home-workout" className="sport-link">Домашние тренировки</a>
            <a href="#calisthenics" className="sport-link">Калистеника и уличный воркаут</a>
          </div>
        </div>

        <div>
          <h3 className="sport-section-title">🧘‍♀️ Восстановление и гибкость</h3>
          <div className="sport-links">
            <a href="#yoga" className="sport-link">Йога для начинающих</a>
            <a href="#stretching" className="sport-link">Программы растяжки</a>
            <a href="#meditation" className="sport-link">Медитация и дыхательные практики</a>
            <a href="#recovery" className="sport-link">Восстановление после тренировок</a>
          </div>
        </div>

        <div>
          <h3 className="sport-section-title">🥗 Питание и здоровье</h3>
          <div className="sport-links">
            <a href="#nutrition" className="sport-link">Основы спортивного питания</a>
            <a href="#meal-prep" className="sport-link">Подготовка еды на неделю</a>
            <a href="#supplements" className="sport-link">Спортивные добавки</a>
            <a href="#hydration" className="sport-link">Питьевой режим спортсмена</a>
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
    </div>
  </div>
);

export default Sport;
