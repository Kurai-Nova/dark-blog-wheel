
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import clsx from 'clsx';

import './MarkdownRenderer.scss';

interface MarkdownRendererProps {
  path: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ path }) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMarkdown = async () => {
      setLoading(true);
      setError(null);

      try {
        // Получаем базовый путь из vite.config.ts
        const basePath = import.meta.env.BASE_URL || '/';
        // Конвертируем путь в путь к файлу .md с учетом базового пути
        const filePath = `${basePath}content${path}.md`.replace('//', '/');
        const response = await fetch(filePath);

        if (!response.ok) {
          throw new Error(`Файл не найден: ${filePath}`);
        }

        const text = await response.text();
        setContent(text);
      } catch (err) {
        console.error('Error loading markdown:', err);
        setError(err instanceof Error ? err.message : 'Ошибка загрузки файла');
      } finally {
        setLoading(false);
      }
    };

    if (path) {
      loadMarkdown();
    }
  }, [path]);

  const noErrorAndHasContent = !loading && !error && content;
  const innerStyle = clsx({ "markdown-error": error, "markdown-empty": !content, "markdown-content": noErrorAndHasContent });

  if (loading) {
    return (
      <div className="markdown-renderer">
        <div className="markdown-loading">
          Загрузка...
        </div>
      </div>
    );
  }

  return (
    <div className="markdown-renderer">
      <div className={innerStyle}>
        {error &&
          <>
            <h3>Ошибка загрузки</h3>
            <p>{error}</p>
          </>
        }
        {!content &&
          <>Контент не найден</>
        }
        {noErrorAndHasContent &&
          <ReactMarkdown>
            {content}
          </ReactMarkdown>
        }
      </div>
    </div>
  );
};

export default MarkdownRenderer;
