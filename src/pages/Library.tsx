
import React from "react";

const Library: React.FC = () => (
  <div className="max-w-2xl mx-auto mt-10 px-4">
    <h2 className="text-2xl font-bold mb-6 text-center">Библиотека</h2>
    <ul className="bg-white rounded shadow divide-y">
      <li className="p-4">
        <span className="font-bold">"Рефакторинг"</span> — Мартин Фаулер.
        <div className="text-sm text-gray-500 mt-1">Практика улучшения существующего кода.</div>
      </li>
      <li className="p-4">
        <span className="font-bold">"Чистый код"</span> — Роберт Мартин.
        <div className="text-sm text-gray-500 mt-1">Как писать простой, поддерживаемый и понятный код.</div>
      </li>
      <li className="p-4">
        <span className="font-bold">"You Don't Know JS"</span> — Кайл Симпсон.
        <div className="text-sm text-gray-500 mt-1">Глубокое понимание JavaScript.</div>
      </li>
    </ul>
  </div>
);

export default Library;
