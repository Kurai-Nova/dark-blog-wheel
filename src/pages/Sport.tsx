
import React from "react";

const Sport: React.FC = () => (
  <div className="max-w-xl mx-auto mt-10 px-4">
    <h2 className="text-2xl font-bold mb-6 text-center">Тренировка — лучший способ начать свой день</h2>
    <article className="bg-white rounded shadow p-6">
      <p className="mb-4">Утренняя физическая активность запускает обмен веществ, заряжает энергией и помогает продуктивнее справляться с задачами дня.</p>
      <h3 className="font-semibold mt-2 mb-2">Простой комплекс на каждый день:</h3>
      <ul className="list-disc pl-5 text-gray-700 mb-2">
        <li>Разминка (наклоны, вращения, легкая растяжка) — 5 минут</li>
        <li>Приседания — 3 подхода по 15</li>
        <li>Отжимания — 3 подхода по 10–15</li>
        <li>Планка — 3 × 40 секунд</li>
        <li>Бег/интенсивная ходьба — 15 минут</li>
      </ul>
      <div className="mt-4 text-gray-500 text-sm">
        Главное — регулярность! Делайте небольшой комплекс ежедневно, чтобы чувствовать прилив сил.
      </div>
    </article>
  </div>
);

export default Sport;
